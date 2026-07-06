from uuid import UUID
from pydantic import BaseModel, ConfigDict

class EducationItem(BaseModel):
    """Schema representing an education entry in a parsed resume."""
    degree: str | None = None
    institution: str | None = None
    year: str | None = None
    raw_text: str | None = None

    model_config = ConfigDict(from_attributes=True)

class ExperienceItem(BaseModel):
    """Schema representing a professional experience entry in a parsed resume."""
    title: str | None = None
    company: str | None = None
    duration: str | None = None
    description: str | None = None
    raw_text: str | None = None

    model_config = ConfigDict(from_attributes=True)

class ProjectItem(BaseModel):
    """Schema representing a project entry in a parsed resume."""
    name: str | None = None
    description: str | None = None
    technologies: list[str] = []
    raw_text: str | None = None

    model_config = ConfigDict(from_attributes=True)

class ConfidentStr(BaseModel):
    value: str | None = None
    confidence: float = 0.0

    model_config = ConfigDict(from_attributes=True)

class ConfidentStrList(BaseModel):
    value: list[str] = []
    confidence: float = 0.0

    model_config = ConfigDict(from_attributes=True)

class ConfidentEducationList(BaseModel):
    value: list[EducationItem] = []
    confidence: float = 0.0

    model_config = ConfigDict(from_attributes=True)

class ConfidentExperienceList(BaseModel):
    value: list[ExperienceItem] = []
    confidence: float = 0.0

    model_config = ConfigDict(from_attributes=True)

class ConfidentProjectList(BaseModel):
    value: list[ProjectItem] = []
    confidence: float = 0.0

    model_config = ConfigDict(from_attributes=True)

class ParsedResumeDataStatistics(BaseModel):
    """Schema representing the statistical data of parsed resume content."""
    text_length: int
    page_count: int
    skills_found: int
    education_found: int
    experience_found: int
    projects_found: int
    certifications_found: int
    links_found: int
    processing_time_ms: int
    empty_sections: int
    summary_found: int | None = None
    languages_found: int | None = None
    achievements_found: int | None = None

    model_config = ConfigDict(from_attributes=True)

class ParsedResumeDataInner(BaseModel):
    """Schema representing the core parsed resume entities."""
    name: ConfidentStr
    email: ConfidentStr
    phone: ConfidentStr
    links: ConfidentStrList
    skills: ConfidentStrList
    education: ConfidentEducationList
    experience: ConfidentExperienceList
    projects: ConfidentProjectList
    certifications: ConfidentStrList
    summary: ConfidentStr | None = None
    languages: ConfidentStrList | None = None
    achievements: ConfidentStrList | None = None

    model_config = ConfigDict(from_attributes=True)

class ParsedResumeData(BaseModel):
    """Schema representing the outer structure of parsed resume data in v2."""
    parser_version: str = "v2"
    parsed_at: str
    model: str = "en_core_web_sm"
    statistics: ParsedResumeDataStatistics
    data: ParsedResumeDataInner

    model_config = ConfigDict(from_attributes=True)

class ParseResumeResponse(BaseModel):
    """Schema representing the API response for a resume parsing request."""
    message: str
    resume_id: UUID
    status: str
    parser_version: str = "v2"
    processing_time_ms: int | None = None
    parsed_data: ParsedResumeData | None = None

    model_config = ConfigDict(from_attributes=True)
