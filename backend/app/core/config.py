from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
import json
from pydantic import field_validator

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "CareerPilot AI"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    API_PREFIX: str = "/api/v1"
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000"]
    LOG_LEVEL: str = "INFO"

    # Parser settings
    SPACY_MODEL: str = "en_core_web_sm"
    PARSER_VERSION: str = "v2"
    MAX_PAGES: int = 10
    MAX_TEXT_LENGTH: int = 200000

    # ATS settings
    ATS_MIN_SKILLS_FOR_FULL_SCORE: int = 8
    ATS_MIN_EXPERIENCE_ENTRIES: int = 2
    ATS_RECOMMENDATION_LIMIT: int = 8

    # Job Match settings
    JOB_MATCH_MIN_SKILLS: int = 5
    JOB_MATCH_MAX_RECOMMENDATIONS: int = 10
    JOB_MATCH_KEYWORD_LIMIT: int = 100
    JOB_MATCH_VERSION: str = "v1"

    STORAGE_PROVIDER: str = "LOCAL"
    LOCAL_STORAGE_PATH: str = "storage/resumes"
    MAX_FILE_SIZE_MB: int = 5
    ALLOWED_EXTENSIONS: list[str] = ["pdf", "docx"]
    ALLOWED_MIME_TYPES: dict = {
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    # AI settings
    AI_PROVIDER: str = "ollama"
    OLLAMA_HOST: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5:3b"
    AI_TEMPERATURE: float = 0.3
    AI_TOP_P: float = 0.9
    AI_MAX_TOKENS: int = 2048
    AI_TIMEOUT: int = 60
    AI_RETRY_COUNT: int = 3
    PROMPT_CACHE_ENABLED: bool = True
    PROMPT_CACHE_TTL: int = 300
    PROMPT_TEMPLATE_PATH: str = "app/ai/prompts/templates"

    # Cover Letter settings
    COVER_LETTER_DEFAULT_STYLE: str = "PROFESSIONAL"
    COVER_LETTER_DEFAULT_MODE: str = "STANDARD"
    COVER_LETTER_MAX_LENGTH: int = 4000

    # AI Interview settings
    INTERVIEW_DEFAULT_TYPE: str = "BEHAVIORAL"
    INTERVIEW_DEFAULT_DIFFICULTY: str = "MEDIUM"
    INTERVIEW_MAX_QUESTIONS: int = 15
    INTERVIEW_MAX_SESSION_MINUTES: int = 60
    INTERVIEW_PROMPT_VERSION: str = "1.0.0"
    INTERVIEW_CONTEXT_CACHE: bool = True
    INTERVIEW_WORKFLOW_VERSION: str = "1.0.0"

    # AI Career Roadmap settings
    ROADMAP_DEFAULT_MONTHS: int = 12
    ROADMAP_DEFAULT_PHASES: int = 3
    ROADMAP_MAX_MILESTONES: int = 15
    ROADMAP_PROMPT_VERSION: str = "1.0.0"
    ROADMAP_CONTEXT_CACHE: bool = True
    ROADMAP_WORKFLOW_VERSION: str = "1.0.0"

    # RAG settings
    CHROMA_STORAGE_DIR: str = "storage/chromadb"
    RAG_EMBEDDING_PROVIDER: str = "ollama"
    RAG_EMBEDDING_MODEL: str = "nomic-embed-text"
    RAG_TOP_K: int = 4
    RAG_DEFAULT_TOP_K: int = 4
    RAG_MAX_TOP_K: int = 20
    RAG_SIMILARITY_THRESHOLD: float = 0.7
    RAG_RETRIEVAL_LIMIT: int = 10
    RAG_SCORE_NORMALIZATION: bool = True
    RAG_METADATA_FILTERING: bool = True
    RAG_DUPLICATE_REMOVAL: bool = True

    # RAG Collection names
    RAG_COLLECTION_RESUME: str = "resume_kb"
    RAG_COLLECTION_COMPANY: str = "company_kb"
    RAG_COLLECTION_COURSE: str = "course_kb"
    RAG_COLLECTION_SKILLS: str = "skills_kb"
    RAG_COLLECTION_INTERVIEW: str = "interview_kb"
    RAG_COLLECTION_ATS: str = "ats_kb"
    RAG_COLLECTION_JOB: str = "job_kb"

    # RAG Chunking settings
    RAG_CHUNK_SIZE: int = 500
    RAG_CHUNK_OVERLAP: int = 50
    RAG_MAX_CHUNK_SIZE: int = 2000
    RAG_MIN_CHUNK_SIZE: int = 50
    RAG_TOKEN_ESTIMATE_RATIO: float = 0.25
    RAG_STRIP_WHITESPACE: bool = True
    RAG_KEEP_SEPARATOR: bool = True
    RAG_RECURSIVE_SEPARATORS: Union[List[str], str] = ["\n\n", "\n", " ", ""]
    RAG_MARKDOWN_HEADERS: Union[List[str], str] = ["#", "##", "###", "####"]

    # RAG indexing & pipeline configurations
    RAG_BATCH_SIZE: int = 32
    RAG_EMBEDDING_TIMEOUT: float = 60.0
    RAG_RETRY_COUNT: int = 3
    RAG_MAX_RETRIES: int = 5
    RAG_DUPLICATE_POLICY: str = "skip"
    RAG_ASYNC_WORKERS: int = 4
    RAG_VECTOR_PERSISTENCE: bool = True
    RAG_AUTO_INDEXING: bool = False
    RAG_COLLECTION_DEFAULTS: Union[dict, str] = "{}"

    # Multi-Collection & Search Strategy configuration settings
    RAG_DEFAULT_KNOWLEDGE_BASE: str = "resume_kb"
    RAG_DEFAULT_SEARCH_STRATEGY: str = "global"
    RAG_COLLECTION_PRIORITY: Union[dict, str] = {"resume_kb": 1, "job_kb": 2, "company_kb": 3, "course_kb": 4, "skills_kb": 5, "interview_kb": 6, "ats_kb": 7}
    RAG_COLLECTION_WEIGHT: Union[dict, str] = {"resume_kb": 1.0, "job_kb": 1.0, "company_kb": 1.0, "course_kb": 1.0, "skills_kb": 1.0, "interview_kb": 1.0, "ats_kb": 1.0}
    RAG_MAX_COLLECTIONS: int = 10
    RAG_CROSS_COLLECTION_SEARCH: bool = True

    # RAG Generation settings
    RAG_MAX_CONTEXT_TOKENS: int = 4096
    RAG_MAX_RETRIEVED_CHUNKS: int = 10
    RAG_MAX_PROMPT_SIZE: int = 8192
    RAG_DEFAULT_PROMPT_TEMPLATE: str = "general"
    RAG_TEMPERATURE: float = 0.3
    RAG_TOP_P: float = 0.9
    RAG_MAX_OUTPUT_TOKENS: int = 1024
    RAG_HALLUCINATION_GUARD: bool = True
    RAG_STRICT_CONTEXT_MODE: bool = True

    # RAG Production settings
    RAG_CACHE_TTL: int = 300
    RAG_CACHE_SIZE: int = 1000
    RAG_MAX_RETRIEVAL_TIME: float = 10.0
    RAG_MAX_GENERATION_TIME: float = 30.0
    RAG_CITATION_MODE: str = "standard"
    RAG_METRICS_ENABLED: bool = True
    RAG_OBSERVABILITY_ENABLED: bool = True
    RAG_HEALTH_MONITORING: bool = True
    RAG_STRICT_PRODUCTION_MODE: bool = False

    # Agent configurations
    AGENT_MAX_AGENTS: int = 5
    AGENT_EXECUTION_TIMEOUT: float = 30.0
    AGENT_PARALLEL_EXECUTION: bool = False
    AGENT_RETRY_COUNT: int = 2
    AGENT_MEMORY_TTL: int = 300
    AGENT_LOGGING_ENABLED: bool = True






    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                # Try parsing as JSON array
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
            except json.JSONDecodeError:
                pass
            # Fallback to comma-separated list
            return [x.strip() for x in v.split(",") if x.strip()]
        elif isinstance(v, list):
            return [str(item) for item in v]
        return []

    @field_validator("AI_PROVIDER")
    @classmethod
    def validate_ai_provider(cls, v: str) -> str:
        valid_providers = ["ollama", "openai", "anthropic", "gemini", "groq", "together"]
        if v.lower() not in valid_providers:
            raise ValueError(f"AI_PROVIDER must be one of {valid_providers}")
        return v.lower()

    @field_validator("AI_TEMPERATURE")
    @classmethod
    def validate_temperature(cls, v: float) -> float:
        if not (0.0 <= v <= 1.0):
            raise ValueError("AI_TEMPERATURE must be between 0.0 and 1.0")
        return v

    @field_validator("AI_TOP_P")
    @classmethod
    def validate_top_p(cls, v: float) -> float:
        if not (0.0 <= v <= 1.0):
            raise ValueError("AI_TOP_P must be between 0.0 and 1.0")
        return v

    @field_validator("AI_MAX_TOKENS", "AI_TIMEOUT")
    @classmethod
    def validate_positive_int(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Value must be a positive integer")
        return v

    @field_validator("AI_RETRY_COUNT", "PROMPT_CACHE_TTL")
    @classmethod
    def validate_non_negative_int(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Value must be a non-negative integer")
        return v

settings = Settings()

