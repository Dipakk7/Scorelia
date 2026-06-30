import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile
from sqlalchemy.orm import Session
import structlog

from app.core.db import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.resume import ResumeResponse, ResumeListResponse, ResumeUploadResponse
from app.schemas.parser import ParseResumeResponse
from app.services import resume_service

logger = structlog.get_logger()
router = APIRouter()


@router.post("/upload", response_model=ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a resume file (PDF or DOCX).
    
    Validates size and MIME type, saves the file to local storage,
    and creates a database record.
    """
    resume = await resume_service.process_upload(
        db=db,
        file=file,
        current_user=current_user
    )
    return ResumeUploadResponse(
        message="Resume uploaded successfully",
        resume=ResumeResponse.model_validate(resume),
        next_step="Ready for parsing"
    )


@router.get("", response_model=ResumeListResponse, status_code=status.HTTP_200_OK)
async def get_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all resumes uploaded by the authenticated user."""
    resumes = resume_service.get_user_resumes(db=db, user_id=current_user.id)
    return ResumeListResponse(
        resumes=[ResumeResponse.model_validate(r) for r in resumes],
        total=len(resumes)
    )


@router.get("/{resume_id}", response_model=ResumeResponse, status_code=status.HTTP_200_OK)
async def get_resume(
    resume_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve metadata for a specific resume."""
    resume = resume_service.get_resume_by_id(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id
    )
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    return ResumeResponse.model_validate(resume)


@router.delete("/{resume_id}", status_code=status.HTTP_200_OK)
async def delete_resume(
    resume_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a resume by ID (both filesystem and database record)."""
    resume = resume_service.get_resume_by_id(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id
    )
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    resume_service.delete_resume(db=db, resume=resume)
    return {"message": "Resume deleted successfully"}


@router.post("/{resume_id}/parse", response_model=ParseResumeResponse, status_code=status.HTTP_200_OK)
async def parse_resume_endpoint(
    resume_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Trigger the parsing of an uploaded resume using spaCy NLP and regex."""
    import time
    from app.services.parser.parser_service import parse_resume
    from app.core.config import settings

    resume = resume_service.get_resume_by_id(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id
    )
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    start_time = time.time()
    try:
        parsed_data = parse_resume(db=db, resume_id=resume_id)
        processing_time_ms = int((time.time() - start_time) * 1000)

        return ParseResumeResponse(
            message="Resume parsed successfully",
            resume_id=resume.id,
            status=resume.status.value,
            parser_version=settings.PARSER_VERSION,
            processing_time_ms=processing_time_ms,
            parsed_data=parsed_data
        )
    except Exception as e:
        logger.error("resume_parsing_failed", resume_id=str(resume_id), error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Parsing failed: {str(e)}"
        )

