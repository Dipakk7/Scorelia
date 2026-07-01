import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.models.ai_cover_letter_optimization import AICoverLetterOptimization

def create_cover_letter(
    db: Session,
    user_id: uuid.UUID,
    resume_id: uuid.UUID,
    company_name: str,
    job_title: str,
    job_description: str | None,
    writing_style: str,
    generation_mode: str,
    generated_content: str | None,
    cover_letter_metadata: dict | None,
    provider: str | None = None,
    model: str | None = None,
    prompt_version: str | None = None
) -> AICoverLetter:
    """Create a new AI cover letter record."""
    db_cover_letter = AICoverLetter(
        user_id=user_id,
        resume_id=resume_id,
        company_name=company_name,
        job_title=job_title,
        job_description=job_description,
        writing_style=writing_style,
        generation_mode=generation_mode,
        generated_content=generated_content,
        cover_letter_metadata=cover_letter_metadata,
        provider=provider,
        model=model,
        prompt_version=prompt_version,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_cover_letter)
    db.commit()
    db.refresh(db_cover_letter)
    return db_cover_letter

def get_cover_letter_by_id(
    db: Session,
    cover_letter_id: uuid.UUID,
    user_id: uuid.UUID
) -> AICoverLetter | None:
    """Retrieve a specific AI cover letter for a user by its ID."""
    return db.query(AICoverLetter).filter(
        AICoverLetter.id == cover_letter_id,
        AICoverLetter.user_id == user_id
    ).first()

def get_cover_letters_by_user_id(
    db: Session,
    user_id: uuid.UUID
) -> list[AICoverLetter]:
    """Retrieve all AI cover letters created by/for a specific user, ordered by created_at descending."""
    return db.query(AICoverLetter).filter(
        AICoverLetter.user_id == user_id
    ).order_by(desc(AICoverLetter.created_at)).all()

def get_cover_letters_by_resume_id(
    db: Session,
    resume_id: uuid.UUID,
    user_id: uuid.UUID
) -> list[AICoverLetter]:
    """Retrieve all AI cover letters for a specific resume, ordered by created_at descending."""
    return db.query(AICoverLetter).filter(
        AICoverLetter.resume_id == resume_id,
        AICoverLetter.user_id == user_id
    ).order_by(desc(AICoverLetter.created_at)).all()

def delete_cover_letter_record(
    db: Session,
    cover_letter: AICoverLetter
) -> bool:
    """Delete an AI cover letter record from the database."""
    db.delete(cover_letter)
    db.commit()
    return True

def create_cover_letter_optimization(
    db: Session,
    user_id: uuid.UUID,
    cover_letter_id: uuid.UUID,
    optimization_result: dict,
    quality_score: int,
    category_scores: dict,
    keyword_analysis: dict,
    provider: str,
    model: str,
    prompt_version: str,
    optimization_metadata: dict | None = None
) -> AICoverLetterOptimization:
    """Create a new AI cover letter optimization record."""
    db_opt = AICoverLetterOptimization(
        user_id=user_id,
        cover_letter_id=cover_letter_id,
        optimization_result=optimization_result,
        quality_score=quality_score,
        category_scores=category_scores,
        keyword_analysis=keyword_analysis,
        provider=provider,
        model=model,
        prompt_version=prompt_version,
        optimization_metadata=optimization_metadata,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_opt)
    db.commit()
    db.refresh(db_opt)
    return db_opt

def get_optimization_by_id(
    db: Session,
    optimization_id: uuid.UUID,
    user_id: uuid.UUID
) -> AICoverLetterOptimization | None:
    """Retrieve a specific AI cover letter optimization record for a user by its ID."""
    return db.query(AICoverLetterOptimization).filter(
        AICoverLetterOptimization.id == optimization_id,
        AICoverLetterOptimization.user_id == user_id
    ).first()

def get_optimizations_by_user_id(
    db: Session,
    user_id: uuid.UUID
) -> list[AICoverLetterOptimization]:
    """Retrieve all AI cover letter optimizations for a user, ordered by created_at descending."""
    return db.query(AICoverLetterOptimization).filter(
        AICoverLetterOptimization.user_id == user_id
    ).order_by(desc(AICoverLetterOptimization.created_at)).all()

def get_optimizations_by_cover_letter_id(
    db: Session,
    cover_letter_id: uuid.UUID,
    user_id: uuid.UUID
) -> list[AICoverLetterOptimization]:
    """Retrieve all AI cover letter optimizations for a specific cover letter, ordered by created_at descending."""
    return db.query(AICoverLetterOptimization).filter(
        AICoverLetterOptimization.cover_letter_id == cover_letter_id,
        AICoverLetterOptimization.user_id == user_id
    ).order_by(desc(AICoverLetterOptimization.created_at)).all()

from app.cover_letter.models.ai_cover_letter_export import AICoverLetterExport

def delete_optimization_record(
    db: Session,
    optimization: AICoverLetterOptimization
) -> bool:
    """Delete an AI cover letter optimization record from the database."""
    db.delete(optimization)
    db.commit()
    return True

def create_export_record(
    db: Session,
    user_id: uuid.UUID,
    cover_letter_id: uuid.UUID,
    optimization_id: uuid.UUID | None,
    export_format: str,
    template_name: str,
    file_name: str,
    file_size: int,
    export_metadata: dict | None = None
) -> AICoverLetterExport:
    """Create a new AI cover letter export record."""
    db_export = AICoverLetterExport(
        user_id=user_id,
        cover_letter_id=cover_letter_id,
        optimization_id=optimization_id,
        export_format=export_format,
        template_name=template_name,
        file_name=file_name,
        file_size=file_size,
        export_metadata=export_metadata,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_export)
    db.commit()
    db.refresh(db_export)
    return db_export

def get_export_by_id(
    db: Session,
    export_id: uuid.UUID,
    user_id: uuid.UUID
) -> AICoverLetterExport | None:
    """Retrieve an export record by ID and check ownership."""
    return db.query(AICoverLetterExport).filter(
        AICoverLetterExport.id == export_id,
        AICoverLetterExport.user_id == user_id
    ).first()

def get_exports_by_user_id(
    db: Session,
    user_id: uuid.UUID
) -> list[AICoverLetterExport]:
    """Retrieve all export records for a specific user, ordered by created_at descending."""
    return db.query(AICoverLetterExport).filter(
        AICoverLetterExport.user_id == user_id
    ).order_by(desc(AICoverLetterExport.created_at)).all()

def delete_export_record(
    db: Session,
    export: AICoverLetterExport
) -> bool:
    """Delete an export record from the database."""
    db.delete(export)
    db.commit()
    return True

