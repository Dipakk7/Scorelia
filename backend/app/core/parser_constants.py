"""Constants used in the resume parsing pipeline to avoid magic strings."""

PDF_EXTENSION = ".pdf"
DOCX_EXTENSION = ".docx"
DEFAULT_ENCODING = "utf-8"

SUPPORTED_FILE_TYPES = [
    PDF_EXTENSION,
    DOCX_EXTENSION,
]

# Regex patterns for contact info
EMAIL_REGEX = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
PHONE_REGEX = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
URL_REGEX = r'(?:https?://)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)'

# Section headers for simple parser heuristics
SECTION_HEADERS = {
    "education": ["education", "academics", "qualification", "qualifications", "academic background", "academic history", "study"],
    "experience": ["experience", "work experience", "professional experience", "employment", "career history", "employment history", "professional background", "work history", "history"],
    "projects": ["projects", "personal projects", "academic projects", "key projects", "technical projects"],
    "certifications": ["certifications", "certificates", "licenses", "courses", "awards", "credentials"],
    "skills": ["skills", "technical skills", "core skills", "technologies", "expertise", "core competencies", "skills & tools"],
    "summary": ["summary", "professional summary", "about me", "objective", "career objective", "profile", "personal profile", "executive summary"],
    "languages": ["languages", "language proficiency", "languages spoken"],
    "achievements": ["achievements", "accomplishments", "honors", "key achievements", "awards & achievements"]
}

