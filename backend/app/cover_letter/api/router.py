import uuid
import os
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
import structlog

from app.core.db import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.models.ai_cover_letter_optimization import AICoverLetterOptimization
from app.cover_letter.models.ai_cover_letter_export import AICoverLetterExport
from app.cover_letter.schemas.schemas import (
    CoverLetterRequest,
    CoverLetterResponse,
    CoverLetterHistory,
    CoverLetterMetadata,
    ValidationErrorResponse,
    CoverLetterOptimizationRequest,
    CoverLetterOptimizationResponse,
    CoverLetterOptimizationListResponse,
    CoverLetterCompareRequest,
    VersionComparison,
    ModifiedSection,
    OptimizationMetadata,
    QualityScore,
    CategoryScore,
    OptimizationSuggestion,
    KeywordAnalysis,
    CompanyAlignment,
    CoverLetterExportRequest,
    CoverLetterExportResponse,
    CoverLetterExportListResponse
)
from app.cover_letter.services.service import CoverLetterService, FactValidationError
from app.cover_letter.services.optimization_service import CoverLetterOptimizationService
from app.cover_letter.services.export_service import CoverLetterExportService

logger = structlog.get_logger()
router = APIRouter()

def map_cover_letter_to_response(db_cl: AICoverLetter) -> CoverLetterResponse:
    """Helper to convert database AICoverLetter instance to CoverLetterResponse schema."""
    metadata_dict = db_cl.cover_letter_metadata or {}
    
    metadata = CoverLetterMetadata(
        ats_score=metadata_dict.get("ats_score"),
        review_id=metadata_dict.get("review_id"),
        rewrite_id=metadata_dict.get("rewrite_id"),
        optimization_id=metadata_dict.get("optimization_id"),
        prompt_metadata=metadata_dict.get("prompt_metadata"),
        interview_context=metadata_dict.get("interview_context")
    )
    
    return CoverLetterResponse(
        id=db_cl.id,
        user_id=db_cl.user_id,
        resume_id=db_cl.resume_id,
        company_name=db_cl.company_name,
        job_title=db_cl.job_title,
        job_description=db_cl.job_description,
        writing_style=db_cl.writing_style,
        generation_mode=db_cl.generation_mode,
        generated_content=db_cl.generated_content,
        metadata=metadata,
        provider=db_cl.provider,
        model=db_cl.model,
        prompt_version=db_cl.prompt_version,
        created_at=db_cl.created_at,
        updated_at=db_cl.updated_at
    )

@router.post(
    "/generate",
    response_model=CoverLetterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate tailored AI cover letter",
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
        404: {"description": "Resume not found"},
    }
)
async def generate_cover_letter(
    request: CoverLetterRequest,
    model_override: Optional[str] = Query(None, description="Override active LLM model"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Orchestrates building context and creating a tailored AI cover letter record."""
    service = CoverLetterService(db)
    try:
        db_cover_letter = await service.generate_cover_letter(
            user_id=current_user.id,
            request=request,
            model_override=model_override
        )
        return map_cover_letter_to_response(db_cover_letter)
    except FactValidationError as fact_err:
        logger.error("generate_cover_letter_fact_validation_failed", user_id=str(current_user.id))
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=ValidationErrorResponse(
                error=True,
                status_code=422,
                message="Fact validation failed: generated cover letter contains fabricated details.",
                detail=fact_err.details
            ).model_dump()
        )
    except ValueError as val_err:
        logger.error("generate_cover_letter_validation_failed", error=str(val_err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("generate_cover_letter_system_error", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"System error generating cover letter: {str(err)}"
        )


@router.get(
    "/history",
    response_model=CoverLetterHistory,
    summary="Get cover letter generation history",
)
async def get_cover_letter_history(
    resume_id: Optional[uuid.UUID] = Query(None, description="Filter history by resume ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all previously generated cover letters for the current user."""
    service = CoverLetterService(db)
    try:
        cover_letters = await service.get_history(user_id=current_user.id, resume_id=resume_id)
        return CoverLetterHistory(
            cover_letters=[map_cover_letter_to_response(cl) for cl in cover_letters],
            total=len(cover_letters)
        )
    except Exception as err:
        logger.error("get_history_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve history: {str(err)}"
        )

def map_optimization_to_response(db_opt: AICoverLetterOptimization) -> CoverLetterOptimizationResponse:
    """Helper to convert database AICoverLetterOptimization instance to CoverLetterOptimizationResponse schema."""
    res_dict = db_opt.optimization_result
    meta_dict = db_opt.optimization_metadata or {}
    
    # 1. QualityScore
    cat_scores = CategoryScore(
        grammar=db_opt.category_scores.get("grammar", 0),
        professional_tone=db_opt.category_scores.get("professional_tone", 0),
        readability=db_opt.category_scores.get("readability", 0),
        ats=db_opt.category_scores.get("ats", 0),
        keyword_usage=db_opt.category_scores.get("keyword_usage", 0),
        company_alignment=db_opt.category_scores.get("company_alignment", 0),
        job_alignment=db_opt.category_scores.get("job_alignment", 0),
        personalization=db_opt.category_scores.get("personalization", 0),
        structure=db_opt.category_scores.get("structure", 0),
        closing=db_opt.category_scores.get("closing", 0)
    )
    quality_score = QualityScore(
        overall_score=db_opt.quality_score,
        category_scores=cat_scores
    )

    # 2. KeywordAnalysis
    kw_raw = db_opt.keyword_analysis
    keyword_analysis = KeywordAnalysis(
        matched_keywords=kw_raw.get("matched_keywords", []),
        missing_keywords=kw_raw.get("missing_keywords", []),
        recommended_keywords=kw_raw.get("recommended_keywords", []),
        overused_keywords=kw_raw.get("overused_keywords", []),
        weak_keywords=kw_raw.get("weak_keywords", []),
        strong_action_verbs=kw_raw.get("strong_action_verbs", [])
    )

    # 3. CompanyAlignment
    ca_raw = res_dict.get("company_alignment") or {}
    company_alignment = CompanyAlignment(
        mission_alignment=ca_raw.get("mission_alignment", ""),
        culture_fit=ca_raw.get("culture_fit", ""),
        role_alignment=ca_raw.get("role_alignment", ""),
        technical_alignment=ca_raw.get("technical_alignment", ""),
        industry_language=ca_raw.get("industry_language", ""),
        alignment_confidence=float(ca_raw.get("alignment_confidence", 0.0))
    )

    # 4. Suggestions
    sug_raw = res_dict.get("suggestions") or {}
    suggestions = {}
    for priority in ["high_priority", "medium_priority", "low_priority"]:
        suggestions[priority] = [
            OptimizationSuggestion(
                reason=s.get("reason", ""),
                expected_benefit=s.get("expected_benefit", ""),
                suggested_improvement=s.get("suggested_improvement", ""),
                estimated_ats_improvement=int(s.get("estimated_ats_improvement", 0))
            )
            for s in sug_raw.get(priority, [])
        ]

    # 5. VersionComparison
    vc_raw = res_dict.get("version_comparison") or {}
    version_comparison = VersionComparison(
        added_content=vc_raw.get("added_content", []),
        removed_content=vc_raw.get("removed_content", []),
        modified_sections=[
            ModifiedSection(
                from_text=m.get("from", ""),
                to_text=m.get("to", "")
            )
            for m in vc_raw.get("modified_sections", [])
        ],
        improvement_summary=vc_raw.get("improvement_summary", ""),
        estimated_quality_gain=int(vc_raw.get("estimated_quality_gain", 0))
    )

    # 6. OptimizationMetadata
    metadata = OptimizationMetadata(
        prompt_version=db_opt.prompt_version,
        model=db_opt.model,
        provider=db_opt.provider,
        created_at=db_opt.created_at,
        latency_ms=float(meta_dict.get("latency_ms", 0.0))
    )

    return CoverLetterOptimizationResponse(
        id=db_opt.id,
        user_id=db_opt.user_id,
        cover_letter_id=db_opt.cover_letter_id,
        quality_score=quality_score,
        keyword_analysis=keyword_analysis,
        company_alignment=company_alignment,
        suggestions=suggestions,
        original_content=res_dict.get("original_content", ""),
        optimized_content=res_dict.get("optimized_content", ""),
        version_comparison=version_comparison,
        metadata=metadata,
        created_at=db_opt.created_at,
        updated_at=db_opt.updated_at
    )

@router.post(
    "/optimize",
    response_model=CoverLetterOptimizationResponse,
    status_code=status.HTTP_200_OK,
    summary="Optimize a cover letter and perform analysis",
)
async def optimize_cover_letter(
    request: CoverLetterOptimizationRequest,
    mode: str = Query("STANDARD", description="Optimization mode: FAST, STANDARD, DETAILED"),
    model_override: Optional[str] = Query(None, description="Override LLM model name"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Optimize an existing cover letter using AIService."""
    service = CoverLetterOptimizationService(db)
    try:
        db_opt = await service.optimize_cover_letter(
            user_id=current_user.id,
            request=request,
            mode=mode,
            model_override=model_override,
            bypass_cache=request.bypass_cache
        )
        return map_optimization_to_response(db_opt)
    except ValueError as val_err:
        logger.warning("optimize_cover_letter_validation_failed", error=str(val_err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("optimize_cover_letter_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Optimization failed: {str(err)}"
        )

@router.post(
    "/compare",
    response_model=VersionComparison,
    status_code=status.HTTP_200_OK,
    summary="Compare original and optimized cover letters",
)
async def compare_cover_letters(
    request: CoverLetterCompareRequest,
    current_user: User = Depends(get_current_user)
):
    """Calculate and return word-level difference mapping between two cover letter versions."""
    try:
        from app.utils.diff_engine import compute_diff
        diff_res = compute_diff(request.original_content, request.optimized_content)
        
        return VersionComparison(
            added_content=diff_res.get("added", []),
            removed_content=diff_res.get("removed", []),
            modified_sections=[
                ModifiedSection(
                    from_text=m.get("from", ""),
                    to_text=m.get("to", "")
                )
                for m in diff_res.get("modified", [])
            ],
            improvement_summary=request.improvement_summary or "Calculated text differences.",
            estimated_quality_gain=request.estimated_quality_gain or 0
        )
    except Exception as err:
        logger.error("compare_cover_letters_failed", error=str(err))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diff calculation failed: {str(err)}"
        )

@router.get(
    "/optimizations",
    response_model=CoverLetterOptimizationListResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve all cover letter optimizations for the current user",
)
async def get_cover_letter_optimizations(
    cover_letter_id: Optional[uuid.UUID] = Query(None, description="Filter optimizations by cover letter ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch history of cover letter optimizations for the user."""
    service = CoverLetterOptimizationService(db)
    try:
        if cover_letter_id:
            db_opts = await service.get_optimizations_for_cover_letter(cover_letter_id=cover_letter_id, user_id=current_user.id)
        else:
            db_opts = await service.get_optimizations_for_user(user_id=current_user.id)
            
        responses = [map_optimization_to_response(opt) for opt in db_opts]
        return CoverLetterOptimizationListResponse(optimizations=responses, total=len(responses))
    except Exception as err:
        logger.error("get_cover_letter_optimizations_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve optimizations: {str(err)}"
        )

@router.get(
    "/optimization/{id}",
    response_model=CoverLetterOptimizationResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve details of a specific cover letter optimization",
)
async def get_cover_letter_optimization(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch details of a specific cover letter optimization record by its ID."""
    service = CoverLetterOptimizationService(db)
    db_opt = await service.get_optimization(optimization_id=id, user_id=current_user.id)
    if not db_opt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cover letter optimization with ID '{id}' not found."
        )
    return map_optimization_to_response(db_opt)

@router.delete(
    "/optimization/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a cover letter optimization record",
)
async def delete_cover_letter_optimization(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a cover letter optimization record from database history."""
    service = CoverLetterOptimizationService(db)
    deleted = await service.delete_optimization(optimization_id=id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cover letter optimization with ID '{id}' not found or not owned by user."
        )
    return {
        "success": True,
        "message": "Cover letter optimization deleted successfully."
    }

def map_export_to_response(db_export: AICoverLetterExport) -> CoverLetterExportResponse:
    """Helper to convert database AICoverLetterExport instance to CoverLetterExportResponse schema."""
    return CoverLetterExportResponse(
        id=db_export.id,
        user_id=db_export.user_id,
        cover_letter_id=db_export.cover_letter_id,
        optimization_id=db_export.optimization_id,
        export_format=db_export.export_format,
        template_name=db_export.template_name,
        file_name=db_export.file_name,
        file_size=db_export.file_size,
        metadata=db_export.export_metadata,
        created_at=db_export.created_at
    )


@router.post(
    "/export/pdf",
    response_model=CoverLetterExportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Export cover letter to PDF",
)
async def export_cover_letter_pdf(
    request: CoverLetterExportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = CoverLetterExportService(db)
    try:
        db_export = await service.export_cover_letter(
            user_id=current_user.id,
            cover_letter_id=request.cover_letter_id,
            export_format="PDF",
            template_name=request.template_name,
            optimization_id=request.optimization_id
        )
        return map_export_to_response(db_export)
    except ValueError as val_err:
        logger.warning("export_cover_letter_pdf_validation_failed", error=str(val_err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("export_cover_letter_pdf_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF Export failed: {str(err)}"
        )


@router.post(
    "/export/docx",
    response_model=CoverLetterExportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Export cover letter to DOCX",
)
async def export_cover_letter_docx(
    request: CoverLetterExportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = CoverLetterExportService(db)
    try:
        db_export = await service.export_cover_letter(
            user_id=current_user.id,
            cover_letter_id=request.cover_letter_id,
            export_format="DOCX",
            template_name=request.template_name,
            optimization_id=request.optimization_id
        )
        return map_export_to_response(db_export)
    except ValueError as val_err:
        logger.warning("export_cover_letter_docx_validation_failed", error=str(val_err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("export_cover_letter_docx_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"DOCX Export failed: {str(err)}"
        )


@router.post(
    "/export/md",
    response_model=CoverLetterExportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Export cover letter to Markdown",
)
async def export_cover_letter_md(
    request: CoverLetterExportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = CoverLetterExportService(db)
    try:
        db_export = await service.export_cover_letter(
            user_id=current_user.id,
            cover_letter_id=request.cover_letter_id,
            export_format="MD",
            template_name=request.template_name,
            optimization_id=request.optimization_id
        )
        return map_export_to_response(db_export)
    except ValueError as val_err:
        logger.warning("export_cover_letter_md_validation_failed", error=str(val_err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("export_cover_letter_md_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Markdown Export failed: {str(err)}"
        )


@router.post(
    "/export/txt",
    response_model=CoverLetterExportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Export cover letter to Plain Text",
)
async def export_cover_letter_txt(
    request: CoverLetterExportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = CoverLetterExportService(db)
    try:
        db_export = await service.export_cover_letter(
            user_id=current_user.id,
            cover_letter_id=request.cover_letter_id,
            export_format="TXT",
            template_name=request.template_name,
            optimization_id=request.optimization_id
        )
        return map_export_to_response(db_export)
    except ValueError as val_err:
        logger.warning("export_cover_letter_txt_validation_failed", error=str(val_err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("export_cover_letter_txt_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Plain Text Export failed: {str(err)}"
        )


@router.get(
    "/exports",
    response_model=CoverLetterExportListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all cover letter exports for the current user",
)
async def get_cover_letter_exports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = CoverLetterExportService(db)
    try:
        exports = await service.get_exports(user_id=current_user.id)
        return CoverLetterExportListResponse(
            exports=[map_export_to_response(e) for e in exports],
            total=len(exports)
        )
    except Exception as err:
        logger.error("get_exports_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve exports: {str(err)}"
        )


@router.get(
    "/export/{id}",
    summary="Download a generated cover letter export file",
)
async def download_cover_letter_export(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = CoverLetterExportService(db)
    db_export = await service.get_export(export_id=id, user_id=current_user.id)
    if not db_export:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cover letter export record with ID '{id}' not found."
        )

    file_path = os.path.join(service.export_dir, f"{db_export.id}.{db_export.export_format.lower()}")
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested export file does not exist on disk."
        )

    media_types = {
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "md": "text/markdown",
        "txt": "text/plain"
    }
    mimetype = media_types.get(db_export.export_format.lower(), "application/octet-stream")
    return FileResponse(
        path=file_path,
        media_type=mimetype,
        filename=db_export.file_name
    )


@router.delete(
    "/export/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a cover letter export record and file",
)
async def delete_cover_letter_export(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = CoverLetterExportService(db)
    deleted = await service.delete_export(export_id=id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cover letter export with ID '{id}' not found or not owned by user."
        )
    return {
        "success": True,
        "message": "Cover letter export deleted successfully."
    }


@router.get(
    "/{id}",
    response_model=CoverLetterResponse,
    summary="Get specific cover letter details",
)
async def get_cover_letter(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve details of a specific cover letter."""
    service = CoverLetterService(db)
    db_cover_letter = await service.get_cover_letter(cover_letter_id=id, user_id=current_user.id)
    if not db_cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cover letter with ID '{id}' not found."
        )
    return map_cover_letter_to_response(db_cover_letter)


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a cover letter",
)
async def delete_cover_letter(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a cover letter history entry."""
    service = CoverLetterService(db)
    deleted = await service.delete_cover_letter(cover_letter_id=id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cover letter with ID '{id}' not found or not owned by user."
        )
    return {
        "success": True,
        "message": "Cover letter deleted successfully."
    }


