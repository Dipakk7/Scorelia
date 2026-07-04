# app/modules/rag/services/normalization.py

import re
import unicodedata


def normalize_content(text: str) -> str:
    """Cleans and standardizes document text content for downstream vector ingest.

    - Normalizes Unicode representations using standard Compatibility Decomposition (NFKC).
    - Translates carriage return combinations to standard newlines.
    - Removes zero-width and other common control characters while preserving structural elements.
    - Replaces tabs with spaces.
    - Collapses excessive horizontal spaces to a single space.
    - Collapses three or more consecutive newlines down to exactly two (preserving paragraph breaks).
    - Truncates padding whitespaces from ends.
    """
    if not text:
        return ""

    # 1. Unicode Normalization (NFKC compatibility decomposition)
    normalized = unicodedata.normalize("NFKC", text)

    # 2. Normalize line endings (\r\n and \r -> \n)
    normalized = normalized.replace("\r\n", "\n").replace("\r", "\n")

    # 3. Remove invisible unicode structures and select control characters
    # Preserve tabs and standard newlines
    remove_chars = {"\u200b", "\u00a0", "\u00ad"}
    cleaned_chars = []
    
    for char in normalized:
        if char in remove_chars:
            continue
        # Category 'Cc' represents Control characters
        if unicodedata.category(char) == "Cc" and char not in {"\n", "\t"}:
            continue
        cleaned_chars.append(char)
        
    normalized = "".join(cleaned_chars)

    # 4. Convert tab marks to standard single space spacing
    normalized = normalized.replace("\t", " ")

    # 5. Collapse excessive horizontal spaces (excluding newlines)
    normalized = re.sub(r"[ \t]+", " ", normalized)
    # Strip horizontal spaces around newlines
    normalized = re.sub(r"[ \t]+\n", "\n", normalized)
    normalized = re.sub(r"\n[ \t]+", "\n", normalized)

    # 6. Normalize structural paragraph/header spacing (multiple empty lines)
    # Collapse three or more newlines down to a maximum of two newlines
    normalized = re.sub(r"\n\s*\n\s*\n+", "\n\n", normalized)

    # 7. Trim leading and trailing spaces/newlines
    return normalized.strip()
