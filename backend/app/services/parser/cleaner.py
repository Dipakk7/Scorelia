"""Text cleaning and normalization utilities for resume raw text."""

import re
import unicodedata
import structlog
from app.core.config import settings

logger = structlog.get_logger()

def clean_text(raw_text: str) -> str:
    """Clean and normalize raw extracted text.

    Args:
        raw_text: The raw text string.

    Returns:
        The cleaned and normalized text.
    """
    if raw_text is None:
        return ""

    # 1. Unicode normalization
    text = unicodedata.normalize("NFKC", raw_text)

    # 2. Remove invisible unicode
    # Zero Width Space, NBSP, Soft Hyphen
    # Also remove control characters, except standard spacing controls (newline, CR, tab)
    remove_chars = {"\u200b", "\u00a0", "\u00ad"}
    cleaned_chars = []
    for char in text:
        if char in remove_chars:
            continue
        # Cc represents Other, Control category in Unicode.
        # Preserve newlines (\n, \r) and tabs (\t). Note: \t will be replaced in step 3.
        if unicodedata.category(char) == "Cc" and char not in {"\n", "\r", "\t"}:
            continue
        cleaned_chars.append(char)
    text = "".join(cleaned_chars)

    # 3. Replace tabs with spaces
    text = text.replace("\t", " ")

    # 4. Collapse multiple spaces (consecutive space characters, preserving newlines)
    text = re.sub(r" +", " ", text)

    # 5. Collapse multiple blank lines (consecutive newlines/carriage returns, with optional spaces, collapsed to max 2 newlines)
    text = re.sub(r"(\r?\n\s*){2,}", "\n\n", text)

    # 6. Strip whitespace
    text = text.strip()

    # 7. Truncate using settings.MAX_TEXT_LENGTH
    if len(text) > settings.MAX_TEXT_LENGTH:
        text = text[:settings.MAX_TEXT_LENGTH]
        logger.warning("resume_text_truncated", max_length=settings.MAX_TEXT_LENGTH)

    logger.info("resume_text_cleaned")
    return text
