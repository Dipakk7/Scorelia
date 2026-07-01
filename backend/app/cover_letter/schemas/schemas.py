from datetime import datetime
from uuid import UUID
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict, Field

from pydantic import field_validator

class WritingStyle(str, Enum):
    PROFESSIONAL = "PROFESSIONAL"
    MODERN = "MODERN"
    FORMAL = "FORMAL"
    FRIENDLY = "FRIENDLY"
    EXECUTIVE = "EXECUTIVE"
    STARTUP = "STARTUP"
    ACADEMIC = "ACADEMIC"
    GOVERNMENT = "GOVERNMENT"
    CONCISE = "CONCISE"
    ENTHUSIASTIC = "ENTHUSIASTIC"
    CREATIVE = "CREATIVE"

# Configurable list of supported writing styles
SUPPORTED_WRITING_STYLES = [style.value for style in WritingStyle]

class ExperienceLevel(str, Enum):
    INTERNSHIP = "INTERNSHIP"
    FRESHER = "FRESHER"
    EXPERIENCED = "EXPERIENCED"
    CAREER_CHANGE = "CAREER_CHANGE"
    REFERRAL = "REFERRAL"
    EXECUTIVE = "EXECUTIVE"

class GenerationMode(str, Enum):
    STANDARD = "STANDARD"
    FAST = "FAST"
    DETAILED = "DETAILED"

class CoverLetterMetadata(BaseModel):
    ats_score: Optional[int] = None
    review_id: Optional[UUID] = None
    rewrite_id: Optional[UUID] = None
    optimization_id: Optional[UUID] = None
    prompt_metadata: Optional[Dict[str, Any]] = None
    interview_context: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class CoverLetterRequest(BaseModel):
    resume_id: UUID
    company_name: str = Field(..., min_length=1, max_length=100)
    job_title: str = Field(..., min_length=1, max_length=100)
    job_description: Optional[str] = None
    writing_style: Optional[str] = "PROFESSIONAL"
    generation_mode: Optional[GenerationMode] = GenerationMode.STANDARD
    experience_level: Optional[ExperienceLevel] = ExperienceLevel.EXPERIENCED
    metadata: Optional[CoverLetterMetadata] = None

    @field_validator("writing_style", mode="before")
    @classmethod
    def validate_writing_style(cls, v):
        if v is None:
            return "PROFESSIONAL"
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        if val_upper not in SUPPORTED_WRITING_STYLES:
            raise ValueError(f"Writing style '{v}' is not supported. Choose from {SUPPORTED_WRITING_STYLES}")
        return val_upper

    @field_validator("experience_level", mode="before")
    @classmethod
    def validate_experience_level(cls, v):
        if v is None:
            return ExperienceLevel.EXPERIENCED
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        for level in ExperienceLevel:
            if level.value == val_upper:
                return level
        raise ValueError(f"Experience level '{v}' is not supported. Choose from {[e.value for e in ExperienceLevel]}")



class CoverLetterResponse(BaseModel):
    id: UUID
    user_id: UUID
    resume_id: UUID
    company_name: str
    job_title: str
    job_description: Optional[str]
    writing_style: str
    generation_mode: GenerationMode
    generated_content: Optional[str]
    metadata: Optional[CoverLetterMetadata] = None
    provider: Optional[str]
    model: Optional[str]
    prompt_version: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CoverLetterHistory(BaseModel):
    cover_letters: List[CoverLetterResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)

class ValidationErrorDetail(BaseModel):
    loc: List[str]
    msg: str
    type: str

class ValidationErrorResponse(BaseModel):
    error: bool = True
    status_code: int = 422
    message: str = "Validation error"
    detail: List[ValidationErrorDetail]

    model_config = ConfigDict(from_attributes=True)

class CategoryScores(BaseModel):
    grammar: int = Field(..., ge=0, le=100)
    professional_tone: int = Field(..., ge=0, le=100)
    readability: int = Field(..., ge=0, le=100)
    ats_friendliness: int = Field(..., ge=0, le=100)
    role_alignment: int = Field(..., ge=0, le=100)
    company_alignment: int = Field(..., ge=0, le=100)

class AICoverLetterOutput(BaseModel):
    title: str
    greeting: str
    introduction: str
    body: str
    closing: str
    signature: str
    overall_quality: int = Field(..., ge=0, le=100)
    ats_score: int = Field(..., ge=0, le=100)
    tone: str
    writing_style: str
    provider: str
    model: str
    prompt_version: str
    created_at: str
    category_scores: CategoryScores


class CoverLetterOptimizationRequest(BaseModel):
    cover_letter_id: UUID
    job_description: Optional[str] = None
    model_override: Optional[str] = None
    bypass_cache: bool = False

class CategoryScore(BaseModel):
    grammar: int = Field(..., ge=0, le=100)
    professional_tone: int = Field(..., ge=0, le=100)
    readability: int = Field(..., ge=0, le=100)
    ats: int = Field(..., ge=0, le=100)
    keyword_usage: int = Field(..., ge=0, le=100)
    company_alignment: int = Field(..., ge=0, le=100)
    job_alignment: int = Field(..., ge=0, le=100)
    personalization: int = Field(..., ge=0, le=100)
    structure: int = Field(..., ge=0, le=100)
    closing: int = Field(..., ge=0, le=100)

class QualityScore(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    category_scores: CategoryScore

class OptimizationSuggestion(BaseModel):
    reason: str
    expected_benefit: str
    suggested_improvement: str
    estimated_ats_improvement: int

class KeywordAnalysis(BaseModel):
    matched_keywords: List[str]
    missing_keywords: List[str]
    recommended_keywords: List[str]
    overused_keywords: List[str]
    weak_keywords: List[str]
    strong_action_verbs: List[str]

class ModifiedSection(BaseModel):
    from_text: str = Field(..., alias="from")
    to_text: str = Field(..., alias="to")
    model_config = ConfigDict(populate_by_name=True)

class VersionComparison(BaseModel):
    added_content: List[str]
    removed_content: List[str]
    modified_sections: List[ModifiedSection]
    improvement_summary: str
    estimated_quality_gain: int

class CompanyAlignment(BaseModel):
    mission_alignment: str
    culture_fit: str
    role_alignment: str
    technical_alignment: str
    industry_language: str
    alignment_confidence: float = Field(..., ge=0.0, le=1.0)

class OptimizationMetadata(BaseModel):
    prompt_version: str
    model: str
    provider: str
    created_at: datetime
    latency_ms: float

class CoverLetterOptimizationResponse(BaseModel):
    id: UUID
    user_id: UUID
    cover_letter_id: UUID
    quality_score: QualityScore
    keyword_analysis: KeywordAnalysis
    company_alignment: CompanyAlignment
    suggestions: Dict[str, List[OptimizationSuggestion]]
    original_content: str
    optimized_content: str
    version_comparison: VersionComparison
    metadata: OptimizationMetadata
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class CoverLetterCompareRequest(BaseModel):
    original_content: str
    optimized_content: str
    improvement_summary: Optional[str] = "Version comparison computed successfully."
    estimated_quality_gain: Optional[int] = 0

class CoverLetterOptimizationListResponse(BaseModel):
    optimizations: List[CoverLetterOptimizationResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)

class CoverLetterExportRequest(BaseModel):
    cover_letter_id: UUID
    optimization_id: Optional[UUID] = None
    template_name: Optional[str] = "Professional"

    @field_validator("template_name", mode="before")
    @classmethod
    def validate_template_name(cls, v):
        if v is None:
            return "Professional"
        from app.cover_letter.utils.templates import SUPPORTED_TEMPLATES
        # Title case to match key casing in configuration dictionary
        val_title = str(v).strip().title()
        if val_title not in SUPPORTED_TEMPLATES:
            raise ValueError(f"Template '{v}' is not supported. Choose from {SUPPORTED_TEMPLATES}")
        return val_title

class CoverLetterExportResponse(BaseModel):
    id: UUID
    user_id: UUID
    cover_letter_id: UUID
    optimization_id: Optional[UUID] = None
    export_format: str
    template_name: str
    file_name: str
    file_size: int
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime


    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class CoverLetterExportListResponse(BaseModel):
    exports: List[CoverLetterExportResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)



