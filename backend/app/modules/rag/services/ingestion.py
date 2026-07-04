# app/modules/rag/services/ingestion.py

import os
import tempfile
import time
from typing import Dict, Any, Optional
import structlog
from fastapi import UploadFile

from app.modules.rag.schemas.document import LoadedDocument, Document
from app.modules.rag.services.validator import DocumentValidator
from app.modules.rag.services.metadata_extractor import MetadataExtractor
from app.modules.rag.services.normalization import normalize_content
from app.modules.rag.services.loaders import LOADER_REGISTRY, resolve_extension
from app.modules.rag.exceptions import (
    UnsupportedFormatError,
    EmptyDocumentError,
    ParsingFailureError,
)

logger = structlog.get_logger()


class DocumentIngestionService:
    """Service coordinates document loading, validation, metadata extraction and content normalization."""

    def __init__(self, validator: DocumentValidator):
        self.validator = validator

    def ingest_local_file(
        self,
        file_path: str,
        mime_type: str,
        custom_metadata: Optional[Dict[str, Any]] = None,
        original_filename: Optional[str] = None,
    ) -> LoadedDocument:
        """Ingests a document from a local filepath, normalizes, and extracts metadata.

        Args:
            file_path: Absolute path to the file.
            mime_type: MIME type of the file.
            custom_metadata: Optional dictionary of user-defined metadata.
            original_filename: Optional user-provided filename to store in metadata.

        Returns:
            A LoadedDocument object.
        """
        start_time = time.perf_counter()
        file_name = original_filename or os.path.basename(file_path)
        file_size = os.path.getsize(file_path)

        ext = resolve_extension(file_name)

        # 1. Content and file-structure validation on disk
        self.validator.validate_file_content_on_disk(file_path, ext)

        # 2. Select appropriate format loader strategy
        loader_cls = LOADER_REGISTRY.get(ext)
        if not loader_cls:
            raise UnsupportedFormatError(f"No document loader registered for extension '.{ext}'")

        loader = loader_cls()

        # 3. Load text content from document pages/blocks
        try:
            pages = loader.load(file_path, custom_metadata=custom_metadata)
        except Exception as e:
            logger.error(
                "document_parsing_failed",
                file_name=file_name,
                file_type=ext,
                error=str(e),
            )
            raise ParsingFailureError(f"Failed to parse document content: {str(e)}") from e

        # 4. Normalize pages and accumulate full text
        normalized_pages = []
        full_raw_parts = []
        total_pages = 0

        for page in pages:
            total_pages += 1
            norm_text = normalize_content(page.content)
            full_raw_parts.append(norm_text)
            normalized_pages.append(
                Document(content=norm_text, metadata=page.metadata)
            )

        full_normalized_text = "\n\n".join(full_raw_parts).strip()
        if not full_normalized_text:
            raise EmptyDocumentError("The document contains no readable text content after normalization.")

        # 5. Extract metadata details
        metadata = MetadataExtractor.extract(
            file_path=file_path,
            content=full_normalized_text,
            mime_type=mime_type,
            num_pages=total_pages,
            custom_metadata=custom_metadata,
            file_name=file_name,
        )

        duration = time.perf_counter() - start_time

        # 6. Log strictly only non-PII attributes (filenames, types, size, duration, status)
        logger.info(
            "document_ingestion_completed",
            file_name=file_name,
            file_type=ext,
            file_size=file_size,
            processing_duration_seconds=round(duration, 4),
            validation_status="success",
            num_pages=total_pages,
            num_words=metadata.num_words,
        )

        return LoadedDocument(
            content=full_normalized_text,
            metadata=metadata,
            pages=normalized_pages,
        )

    async def ingest_uploaded_file(
        self,
        upload_file: UploadFile,
        custom_metadata: Optional[Dict[str, Any]] = None,
    ) -> LoadedDocument:
        """Validates and processes an uploaded FastAPI file stream securely.

        Uses sequential chunk writing to local temporary storage to avoid loading entire
        large files into memory. Automatically removes the temporary files after ingestion.

        Args:
            upload_file: FastAPI UploadFile object.
            custom_metadata: Optional custom metadata map.

        Returns:
            A LoadedDocument object.
        """
        file_size = upload_file.size
        if file_size is None:
            # Fallback for older versions using underlying file object
            upload_file.file.seek(0, 2)
            file_size = upload_file.file.tell()
            upload_file.file.seek(0)


        file_name = upload_file.filename or "unknown"
        content_type = upload_file.content_type or "application/octet-stream"

        # Validate headers and parameters
        val_info = self.validator.validate_file_info(file_name, content_type, file_size)
        resolved_ext = val_info["extension"]
        resolved_mime = val_info["mime_type"]

        # Ensure temp directory exists under workspace
        temp_dir = os.path.join(os.getcwd(), "storage", "temp")
        os.makedirs(temp_dir, exist_ok=True)

        suffix = f".{resolved_ext}"
        temp_fd, temp_path = tempfile.mkstemp(dir=temp_dir, suffix=suffix)

        try:
            with os.fdopen(temp_fd, "wb") as f_temp:
                # Stream write chunks (64 KB) to avoid excessive RAM allocation
                while True:
                    chunk = await upload_file.read(65536)
                    if not chunk:
                        break
                    f_temp.write(chunk)

            # Process file locally
            return self.ingest_local_file(
                file_path=temp_path,
                mime_type=resolved_mime,
                custom_metadata=custom_metadata,
                original_filename=file_name,
            )
        finally:
            # Securely cleanup temporary files
            if os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                except Exception as e:
                    logger.warning("failed_to_delete_temp_file", path=temp_path, error=str(e))
