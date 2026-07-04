from enum import Enum

class StorageProvider(str, Enum):
    LOCAL = "LOCAL"
    AWS_S3 = "AWS_S3"
    AZURE_BLOB = "AZURE_BLOB"
    GCS = "GCS"

class ResumeStatus(str, Enum):
    UPLOADED = "UPLOADED"
    QUEUED = "QUEUED"
    PARSING = "PARSING"
    PARSED = "PARSED"
    FAILED = "FAILED"


class InterviewType(str, Enum):
    BEHAVIORAL = "BEHAVIORAL"
    TECHNICAL = "TECHNICAL"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"
    FIT = "FIT"
    HR = "HR"
    RESUME_BASED = "RESUME_BASED"
    MIXED = "MIXED"


class InterviewDifficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class InterviewStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class QuestionCategory(str, Enum):
    BEHAVIORAL = "BEHAVIORAL"
    TECHNICAL = "TECHNICAL"
    SITUATIONAL = "SITUATIONAL"
    BACKGROUND = "BACKGROUND"
    ROLE_SPECIFIC = "ROLE_SPECIFIC"


class RoadmapStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ExperienceLevel(str, Enum):
    ENTRY = "ENTRY"
    MID = "MID"
    SENIOR = "SENIOR"
    LEAD = "LEAD"
    EXECUTIVE = "EXECUTIVE"


class LearningPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class MilestoneStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


