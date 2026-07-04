# app/modules/rag/services/loaders/pdf.py

import os
import fitz
from typing import List, Generator, Dict, Any
from app.modules.rag.services.loaders.base import BaseDocumentLoader
from app.modules.rag.schemas.document import Document
from app.modules.rag.exceptions import CorruptedFileError, ParsingFailureError, InvalidDocumentError


class PDFLoader(BaseDocumentLoader):
    """Document loader for PDF files using PyMuPDF (fitz)."""

    def load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> List[Document]:
        """Completely load the PDF and return a list of page Documents."""
        return list(self.lazy_load(file_path, custom_metadata))

    def lazy_load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> Generator[Document, None, None]:
        """Lazily load the PDF page by page, yielding Document objects."""
        try:
            doc = fitz.open(file_path)
        except Exception as e:
            raise CorruptedFileError(f"Failed to open PDF file. It might be corrupted: {str(e)}") from e

        with doc:
            if doc.is_encrypted or doc.needs_pass:
                raise ParsingFailureError("Encrypted or password-protected PDF is not supported.")

            num_pages = len(doc)
            if num_pages == 0:
                raise InvalidDocumentError("PDF has zero pages.")

            # Capture document-level metadata if available in PDF properties
            doc_info = doc.metadata or {}

            for page_idx in range(num_pages):
                try:
                    page = doc[page_idx]
                    text = page.get_text()
                except Exception as e:
                    raise CorruptedFileError(f"Failed to read page {page_idx + 1} from PDF: {str(e)}") from e

                # Standard page metadata
                page_metadata = {
                    "page_number": page_idx + 1,
                    "total_pages": num_pages,
                }
                
                # Incorporate document PDF metadata properties
                if doc_info.get("title"):
                    page_metadata["title"] = doc_info["title"]
                if doc_info.get("author"):
                    page_metadata["author"] = doc_info["author"]
                if doc_info.get("subject"):
                    page_metadata["subject"] = doc_info["subject"]

                if custom_metadata:
                    page_metadata.update(custom_metadata)

                yield Document(content=text, metadata=page_metadata)
