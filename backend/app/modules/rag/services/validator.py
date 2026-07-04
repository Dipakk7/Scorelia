# app/modules/rag/services/validator.py

import os
import mimetypes
from typing import Dict, Any, List
from fastapi import UploadFile

from app.core.config import settings
from app.modules.rag.exceptions import (
    UnsupportedFormatError,
    ValidationFailureError,
    EmptyDocumentError,
)
from app.modules.rag.services.loaders import resolve_extension

# Acceptable extensions
SUPPORTED_EXTENSIONS = {"pdf", "docx", "txt", "md", "html"}

# Map of supported extension to its accepted MIME types
SUPPORTED_MIME_TYPES = {
    "pdf": {"application/pdf"},
    "docx": {"application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
    "txt": {"text/plain"},
    "md": {"text/markdown", "text/x-markdown", "text/plain"},
    "html": {"text/html", "application/xhtml+xml"},
}

# Explicitly blocked dangerous executable or system binary formats
BLOCKED_EXTENSIONS = {
    "exe", "dll", "so", "dylib", "bin", "bat", "cmd", "sh", "js", "ts", "py",
    "jar", "war", "msi", "com", "vbs", "ps1", "elf"
}


class DocumentValidator:
    """Validator for RAG document uploads enforcing file types, mime types, size and empty checks."""

    def __init__(self):
        # Configure file limits from global settings
        self.max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024

    def validate_file_info(self, filename: str, content_type: str, file_size: int) -> Dict[str, Any]:
        """Perform validation checks on file properties before parsing.

        Args:
            filename: The name of the file.
            content_type: The MIME type provided by client.
            file_size: File size in bytes.

        Returns:
            A dict containing validation details if successful.

        Raises:
            UnsupportedFormatError: If format/extension is not supported.
            ValidationFailureError: If file details are invalid (e.g. too large).
            EmptyDocumentError: If file size is 0.
        """
        # 1. Empty Check
        if file_size <= 0:
            raise EmptyDocumentError("The uploaded file is empty (0 bytes).")

        # 2. Size Check
        if file_size > self.max_size_bytes:
            raise ValidationFailureError(
                f"File size of {file_size} bytes exceeds maximum allowed limit of {self.max_size_bytes} bytes."
            )

        # 3. Extension Check
        ext = resolve_extension(filename)
        if ext in BLOCKED_EXTENSIONS:
            raise UnsupportedFormatError(f"Executable or script format '.{ext}' is strictly blocked.")
        if ext not in SUPPORTED_EXTENSIONS:
            raise UnsupportedFormatError(f"Unsupported file format: '.{ext}'. Supported formats: {list(SUPPORTED_EXTENSIONS)}")

        # 4. MIME Type validation
        # Client content_type might be lowercase, check it against allowed set
        allowed_mimes = SUPPORTED_MIME_TYPES.get(ext, set())
        if content_type.lower() not in allowed_mimes:
            # Try mapping with standard guess to check if client content-type is just wrong
            guessed_mime, _ = mimetypes.guess_type(filename)
            if not guessed_mime or guessed_mime.lower() not in allowed_mimes:
                raise ValidationFailureError(
                    f"MIME type '{content_type}' is invalid for extension '.{ext}'. Allowed types: {list(allowed_mimes)}"
                )

        return {
            "valid": True,
            "extension": ext,
            "mime_type": content_type,
            "file_size": file_size,
        }

    def validate_file_content_on_disk(self, file_path: str, extension: str) -> None:
        """Inspects file contents on disk for corruption, binary rules and script detection.

        Args:
            file_path: Absolute path to local file copy.
            extension: Resolved extension (txt, md, html, pdf, docx).

        Raises:
            ValidationFailureError: If binary content is detected in text files.
            EmptyDocumentError: If file is verified empty on disk.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found on path: {file_path}")

        file_size = os.path.getsize(file_path)
        if file_size == 0:
            raise EmptyDocumentError("The file is empty on disk (0 bytes).")

        # Detect MIME type securely using python-magic if available
        detected_mime = self.detect_mime_type_securely(file_path)
        allowed_mimes = SUPPORTED_MIME_TYPES.get(extension, set())
        
        # If magic is strict, check that it maps to accepted types (skip check if magic detects text/plain for md/html/docx)
        if detected_mime != "application/octet-stream" and extension not in {"docx", "md", "html"}:
            if detected_mime not in allowed_mimes and not detected_mime.startswith("text/"):
                raise ValidationFailureError(
                    f"File contents do not match extension. Detected type: '{detected_mime}'."
                )

        # For text-based formats, read sample bytes to reject binary content
        if extension in {"txt", "md", "html"}:
            with open(file_path, "rb") as f:
                sample_bytes = f.read(2048)
                
            if self._is_binary_buffer(sample_bytes):
                raise ValidationFailureError(
                    f"Binary or executable content was detected in text-based document format (.{extension})."
                )

    def detect_mime_type_securely(self, file_path: str) -> str:
        """Heuristically detect MIME type using Magic headers, falling back to mimetypes guess."""
        try:
            import magic
            mime = magic.from_file(file_path, mime=True)
            if mime:
                return mime
        except Exception:
            pass
        guessed, _ = mimetypes.guess_type(file_path)
        return guessed or "application/octet-stream"

    def _is_binary_buffer(self, buf: bytes) -> bool:
        """Check if a sample byte buffer represents binary content."""
        if not buf:
            return False
        # Null bytes represent binary structures (e.g. executables, images)
        if b"\x00" in buf:
            return True
        
        # Count non-printable control characters
        control_chars = 0
        for byte in buf:
            # Control characters outside of formatting whitespaces (tab, LF, CR, VT, FF)
            if byte < 9 or (13 < byte < 32):
                control_chars += 1
                
        # If more than 15% of bytes are control characters, treat it as binary
        if (control_chars / len(buf)) > 0.15:
            return True
            
        return False
