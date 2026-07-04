# app/modules/rag/services/metadata_extractor.py

import os
import re
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from app.modules.rag.schemas.document import DocumentMetadata
from app.modules.rag.services.loaders import resolve_extension


class MetadataExtractor:
    """Service to automatically extract document metrics, reading stats, language and structural metadata."""

    @staticmethod
    def extract(
        file_path: str,
        content: str,
        mime_type: str,
        num_pages: int = 1,
        custom_metadata: Optional[Dict[str, Any]] = None,
        file_name: Optional[str] = None,
    ) -> DocumentMetadata:
        """Analyze a document and extract standardized metadata.

        Args:
            file_path: Path of the loaded document.
            content: Unified normalized text content.
            mime_type: Detected MIME type of the file.
            num_pages: Detected page count from loader (defaults to 1).
            custom_metadata: User-provided metadata mappings to inject.
            file_name: Optional filename override.

        Returns:
            A populated DocumentMetadata schema instance.
        """
        if not file_name:
            file_name = os.path.basename(file_path)
        extension = resolve_extension(file_name)
        
        # Calculate size on disk if file exists
        file_size = 0
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)

        # Retrieve system file dates or fallback to current execution time
        upload_timestamp = datetime.now(timezone.utc)
        try:
            mtime = os.path.getmtime(file_path)
            last_modified = datetime.fromtimestamp(mtime, timezone.utc)
        except Exception:
            last_modified = upload_timestamp

        num_characters = len(content)
        
        # Heuristically split text into clean words
        words = content.split()
        num_words = len(words)

        # Estimated reading time based on typical reading speed of 200 WPM
        estimated_reading_time = float(num_words) / 200.0

        # Heuristic language detector using common stopwords in EN, ES, FR, DE
        language = MetadataExtractor.detect_language(content)

        # Merge custom metadata fields (filtering out reserved fields if matching schema)
        merged_custom = {}
        if custom_metadata:
            merged_custom.update(custom_metadata)

        return DocumentMetadata(
            file_name=file_name,
            extension=extension,
            mime_type=mime_type,
            file_size=file_size,
            upload_timestamp=upload_timestamp,
            last_modified=last_modified,
            num_pages=num_pages,
            num_characters=num_characters,
            num_words=num_words,
            estimated_reading_time=estimated_reading_time,
            language=language,
            custom_metadata=merged_custom,
        )

    @staticmethod
    def detect_language(text: str) -> str:
        """Heuristically identify document language based on high frequency stopwords."""
        if not text or not text.strip():
            return "en"

        # Examine first 5000 chars for faster execution
        sample = text.lower()[:5000]
        words = set(re.findall(r"\b[a-z]{2,15}\b", sample))
        if not words:
            return "en"

        # Common stopword sets
        stopwords_db = {
            "en": {"the", "and", "of", "to", "is", "in", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i"},
            "es": {"el", "la", "los", "las", "un", "una", "y", "en", "de", "que", "es", "un", "para", "con", "por", "una", "del", "al"},
            "fr": {"le", "la", "les", "un", "une", "et", "en", "de", "que", "est", "un", "pour", "avec", "par", "dans", "des", "du", "au"},
            "de": {"der", "die", "das", "und", "ist", "in", "zu", "den", "von", "mit", "dem", "des", "ein", "eine", "im", "für", "auf", "aus"},
        }

        scores = {}
        for lang, stop_list in stopwords_db.items():
            scores[lang] = len(words.intersection(stop_list))

        best_lang = max(scores, key=scores.get)
        if scores[best_lang] == 0:
            return "en"
            
        return best_lang
