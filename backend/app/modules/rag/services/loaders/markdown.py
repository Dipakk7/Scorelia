# app/modules/rag/services/loaders/markdown.py

import os
import re
import yaml
from typing import List, Generator, Dict, Any
from app.modules.rag.services.loaders.base import BaseDocumentLoader
from app.modules.rag.schemas.document import Document
from app.modules.rag.exceptions import EncodingFailureError


class MarkdownLoader(BaseDocumentLoader):
    """Document loader for Markdown (.md) files, extracting frontmatter and headings metadata."""

    def load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> List[Document]:
        """Completely load the Markdown file and return a list containing a single Document."""
        return list(self.lazy_load(file_path, custom_metadata))

    def lazy_load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> Generator[Document, None, None]:
        """Lazily load the Markdown file."""
        encodings = ["utf-8", "latin-1"]
        text = None

        for enc in encodings:
            try:
                with open(file_path, "r", encoding=enc) as f:
                    text = f.read()
                break
            except UnicodeDecodeError:
                continue

        if text is None:
            try:
                with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                    text = f.read()
            except Exception as e:
                raise EncodingFailureError(f"Failed to read Markdown file: {str(e)}") from e

        meta = {
            "total_pages": 1,
        }

        # Check for YAML frontmatter at start of file
        content = text
        frontmatter_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
        if frontmatter_match:
            frontmatter_str = frontmatter_match.group(1)
            content = text[frontmatter_match.end():]
            try:
                fm_data = yaml.safe_load(frontmatter_str)
                if isinstance(fm_data, dict):
                    meta.update(fm_data)
            except Exception:
                # Malformed YAML is ignored and entire file is treated as content
                pass

        # Extract headings outline (e.g. lines starting with '#')
        headings = []
        for line in content.splitlines():
            h_match = re.match(r"^(#{1,6})\s+(.*)$", line)
            if h_match:
                headings.append(h_match.group(2).strip())
        
        if headings:
            meta["headings"] = headings

        if custom_metadata:
            meta.update(custom_metadata)

        yield Document(content=content, metadata=meta)
