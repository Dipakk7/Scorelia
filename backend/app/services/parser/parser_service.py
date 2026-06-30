"""Main parser service orchestrating the resume parsing pipeline."""

from uuid import UUID
from sqlalchemy.orm import Session
import structlog

from app.schemas.parser import ParsedResumeData
from app.models.resume import Resume
from app.core.enums import ResumeStatus
from app.services.parser.extractor import extract_pdf_text, extract_docx_text, extract_text
from app.services.parser.cleaner import clean_text

logger = structlog.get_logger()

async def extract_and_save_text(
    db: Session,
    resume: Resume
) -> Resume:
    """Orchestrates the raw text extraction and saves it to the database.

    Updates status, rolls back on error, and uses structured logging.

    Args:
        db: The database session.
        resume: The Resume model instance.

    Returns:
        The updated Resume model instance.
    """
    logger.info("resume_extraction_started", resume_id=str(resume.id), file_type=resume.file_type)

    try:
        # 1. Update status to PARSING
        resume.status = ResumeStatus.PARSING
        db.commit()

        # 2. Extract text (which auto-detects type and cleans text)
        cleaned_text = extract_text(resume)

        # 3. Save: resume.raw_text
        resume.raw_text = cleaned_text

        # 4. Commit
        db.commit()
        logger.info("resume_text_saved", resume_id=str(resume.id))

        # 5. Return Resume
        return resume

    except Exception as e:
        # On failure:
        # - db.rollback()
        # - Update status: ResumeStatus.FAILED
        # - Save: resume.error_message
        # - Commit.
        # - Log failure.
        # - Re-raise exception.
        db.rollback()

        # Update status and save error message
        resume.status = ResumeStatus.FAILED
        resume.error_message = str(e)

        try:
            db.commit()
        except Exception as commit_err:
            logger.error("failed_to_save_error_status", error=str(commit_err))

        logger.error("resume_extraction_failed", resume_id=str(resume.id), error=str(e))
        raise e

def extract_entities(text: str) -> dict:
    """Extract entities (contact info, skills, experience, education) from cleaned text.

    Args:
        text: Cleaned text content of the resume.

    Returns:
        A dictionary containing the flat extracted entities.
    """
    from app.services.parser import entity_extractor

    return {
        "name": entity_extractor.extract_name(text),
        "email": entity_extractor.extract_email(text),
        "phone": entity_extractor.extract_phone(text),
        "links": entity_extractor.extract_links(text),
        "skills": entity_extractor.extract_skills(text),
        "education": entity_extractor.extract_education(text),
        "experience": entity_extractor.extract_experience(text),
        "projects": entity_extractor.extract_projects(text),
        "certifications": entity_extractor.extract_certifications(text),
    }

def parse_resume(db: Session, resume_id: UUID) -> ParsedResumeData:
    """Orchestrate the parsing flow for a given resume database ID.

    Loads the resume file, extracts text, cleans it, runs entity extraction,
    and updates the database record status.

    Args:
        db: The database session.
        resume_id: The UUID of the resume database record.

    Returns:
        A ParsedResumeData schema containing the parsed information.
    """
    import time
    from datetime import datetime, timezone
    from app.core.config import settings

    start_time = time.time()
    logger.info("parser_started", resume_id=str(resume_id))

    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise ValueError(f"Resume with ID {resume_id} not found.")

    try:
        # Update status to PARSING
        resume.status = ResumeStatus.PARSING
        db.commit()

        # If raw_text is not yet extracted, do it
        if not resume.raw_text:
            logger.info("resume_text_extraction_started", resume_id=str(resume_id))
            resume.raw_text = extract_text(resume)
            db.commit()

        # Run entity extraction (which also handles normalization and deduplication)
        flat_entities = extract_entities(resume.raw_text)

        logger.info(
            "entities_found",
            resume_id=str(resume_id),
            name_extracted=bool(flat_entities.get("name")),
            email_extracted=bool(flat_entities.get("email")),
            phone_extracted=bool(flat_entities.get("phone")),
            skills_count=len(flat_entities.get("skills", [])),
            education_count=len(flat_entities.get("education", [])),
            experience_count=len(flat_entities.get("experience", [])),
            projects_count=len(flat_entities.get("projects", [])),
            certifications_count=len(flat_entities.get("certifications", [])),
            links_count=len(flat_entities.get("links", []))
        )

        logger.info("normalization_complete", resume_id=str(resume_id))

        # Get page count
        page_count = 1
        if resume.file_type.lower().strip(".") == "pdf" and resume.file_path:
            try:
                import fitz
                with fitz.open(resume.file_path) as doc:
                    page_count = len(doc)
            except Exception as e:
                logger.warning("failed_to_get_pdf_page_count", resume_id=str(resume_id), error=str(e))
                page_count = 1

        # Calculate confidences
        name_val = flat_entities.get("name")
        name_conf = 0.98 if name_val and len(name_val.split()) >= 2 else (0.70 if name_val else 0.0)

        email_val = flat_entities.get("email")
        email_conf = 0.99 if email_val else 0.0

        phone_val = flat_entities.get("phone")
        phone_conf = 0.98 if phone_val and phone_val.startswith('+') else (0.95 if phone_val else 0.0)

        links_val = flat_entities.get("links", [])
        links_conf = round(min(0.90 + 0.05 * len(links_val), 0.99), 2) if links_val else 0.0

        skills_val = flat_entities.get("skills", [])
        skills_conf = 0.95 if skills_val else 0.0

        edu_val = flat_entities.get("education", [])
        if edu_val:
            item_confs = []
            for item in edu_val:
                has_deg = bool(item.get("degree"))
                has_inst = bool(item.get("institution"))
                if has_deg and has_inst:
                    item_confs.append(0.95)
                elif has_deg or has_inst:
                    item_confs.append(0.70)
                else:
                    item_confs.append(0.50)
            edu_conf = round(sum(item_confs) / len(item_confs), 2)
        else:
            edu_conf = 0.0

        exp_val = flat_entities.get("experience", [])
        if exp_val:
            item_confs = []
            for item in exp_val:
                has_title = bool(item.get("title"))
                has_comp = bool(item.get("company"))
                if has_title and has_comp:
                    item_confs.append(0.95)
                elif has_title or has_comp:
                    item_confs.append(0.75)
                else:
                    item_confs.append(0.50)
            exp_conf = round(sum(item_confs) / len(item_confs), 2)
        else:
            exp_conf = 0.0

        proj_val = flat_entities.get("projects", [])
        if proj_val:
            item_confs = []
            for item in proj_val:
                has_name = bool(item.get("name"))
                has_desc = bool(item.get("description"))
                if has_name and has_desc:
                    base = 0.90
                    if item.get("technologies"):
                        base = min(base + 0.05, 0.99)
                    item_confs.append(base)
                else:
                    item_confs.append(0.60)
            proj_conf = round(sum(item_confs) / len(item_confs), 2)
        else:
            proj_conf = 0.0

        certs_val = flat_entities.get("certifications", [])
        cert_conf = 0.85 if certs_val else 0.0

        confident_data = {
            "name": {"value": name_val, "confidence": name_conf},
            "email": {"value": email_val, "confidence": email_conf},
            "phone": {"value": phone_val, "confidence": phone_conf},
            "links": {"value": links_val, "confidence": links_conf},
            "skills": {"value": skills_val, "confidence": skills_conf},
            "education": {"value": edu_val, "confidence": edu_conf},
            "experience": {"value": exp_val, "confidence": exp_conf},
            "projects": {"value": proj_val, "confidence": proj_conf},
            "certifications": {"value": certs_val, "confidence": cert_conf},
        }

        # Calculate empty sections count
        empty_sections = sum([
            1 if not name_val else 0,
            1 if not email_val else 0,
            1 if not phone_val else 0,
            1 if not links_val else 0,
            1 if not skills_val else 0,
            1 if not edu_val else 0,
            1 if not exp_val else 0,
            1 if not proj_val else 0,
            1 if not certs_val else 0,
        ])

        processing_time_ms = int((time.time() - start_time) * 1000)

        stats = {
            "text_length": len(resume.raw_text) if resume.raw_text else 0,
            "page_count": page_count,
            "skills_found": len(skills_val),
            "education_found": len(edu_val),
            "experience_found": len(exp_val),
            "projects_found": len(proj_val),
            "certifications_found": len(certs_val),
            "links_found": len(links_val),
            "processing_time_ms": processing_time_ms,
            "empty_sections": empty_sections
        }

        logger.info("statistics_generated", resume_id=str(resume_id), stats=stats)

        parsed_data_dict = {
            "parser_version": "v2",
            "parsed_at": datetime.now(timezone.utc).isoformat(),
            "model": settings.SPACY_MODEL,
            "statistics": stats,
            "data": confident_data
        }

        parsed_data_obj = ParsedResumeData.model_validate(parsed_data_dict)

        # Update database fields
        resume.parsed_data = parsed_data_obj.model_dump()
        resume.status = ResumeStatus.PARSED
        resume.error_message = None
        db.commit()

        logger.info("parser_finished", resume_id=str(resume_id))
        return parsed_data_obj

    except Exception as e:
        db.rollback()
        resume.status = ResumeStatus.FAILED
        resume.error_message = str(e)
        try:
            db.commit()
        except Exception as commit_err:
            logger.error("failed_to_save_failed_status", error=str(commit_err))
        logger.error("resume_parsing_failed", resume_id=str(resume_id), error=str(e))
        raise e

