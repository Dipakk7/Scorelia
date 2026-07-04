# app/modules/rag/services/loaders/txt.py

import os
from typing import List, Generator, Dict, Any
from app.modules.rag.services.loaders.base import BaseDocumentLoader
from app.modules.rag.schemas.document import Document
from app.modules.rag.exceptions import EncodingFailureError


class TXTLoader(BaseDocumentLoader):
    """Document loader for plain text (.txt) files supporting multiple encodings."""

    def load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> List[Document]:
        """Completely load the text file and return a list containing a single Document."""
        return list(self.lazy_load(file_path, custom_metadata))

    def lazy_load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> Generator[Document, None, None]:
        """Lazily load the text file."""
        encodings = ["utf-8", "latin-1", "utf-16", "utf-32"]
        text = None
        
        for enc in encodings:
            try:
                with open(file_path, "r", encoding=enc) as f:
                    text = f.read()
                break
            except UnicodeDecodeError:
                continue

        if text is None:
            # Final fallback with replacement characters to prevent complete failure
            try:
                with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                    text = f.read()
            except Exception as e:
                raise EncodingFailureError(f"Failed to read TXT file encoding: {str(e)}") from e

        meta = {
            "total_pages": 1,
        }
        if custom_metadata:
            meta.update(custom_metadata)

        yield Document(content=text, metadata=meta)
