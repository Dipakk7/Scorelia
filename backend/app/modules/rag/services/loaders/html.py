# app/modules/rag/services/loaders/html.py

import os
from html.parser import HTMLParser
from typing import List, Generator, Dict, Any
from app.modules.rag.services.loaders.base import BaseDocumentLoader
from app.modules.rag.schemas.document import Document
from app.modules.rag.exceptions import EncodingFailureError, ParsingFailureError


class ReadableHTMLParser(HTMLParser):
    """HTML parser that ignores scripts, styles, navigation, headers, and footers."""

    def __init__(self):
        super().__init__()
        self.text_parts = []
        # Elements that do not contain readable content
        self.ignore_tags = {
            "script", "style", "nav", "header", "footer", "aside", 
            "noscript", "iframe", "svg", "head", "select", "button"
        }
        self.current_ignore_depth = 0
        self.current_ignore_tag = None
        self.title = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        tag_lower = tag.lower()
        if tag_lower == "title":
            self.in_title = True
        
        if tag_lower in self.ignore_tags:
            self.current_ignore_depth += 1
            if not self.current_ignore_tag:
                self.current_ignore_tag = tag_lower
                
        # Append spacing for layout preservation
        if tag_lower in {"p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "li", "tr", "br"}:
            self.text_parts.append("\n")
        elif tag_lower in {"td", "th"}:
            self.text_parts.append(" ")

    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if tag_lower == "title":
            self.in_title = False
            
        if self.current_ignore_tag and tag_lower == self.current_ignore_tag:
            self.current_ignore_depth -= 1
            if self.current_ignore_depth == 0:
                self.current_ignore_tag = None
        
        if tag_lower in {"p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "li", "tr"}:
            self.text_parts.append("\n")

    def handle_data(self, data):
        if self.in_title:
            self.title = (self.title + data).strip()
            
        if self.current_ignore_depth == 0:
            self.text_parts.append(data)

    def get_text(self) -> str:
        return "".join(self.text_parts)


class HTMLLoader(BaseDocumentLoader):
    """Document loader for HTML (.html) files, extracting semantic readable contents only."""

    def load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> List[Document]:
        """Completely load the HTML file and return a list containing a single Document."""
        return list(self.lazy_load(file_path, custom_metadata))

    def lazy_load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> Generator[Document, None, None]:
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
                raise EncodingFailureError(f"Failed to read HTML file: {str(e)}") from e

        try:
            parser = ReadableHTMLParser()
            parser.feed(text)
            cleaned_text = parser.get_text()
        except Exception as e:
            raise ParsingFailureError(f"Failed to parse HTML structure: {str(e)}") from e

        meta = {
            "total_pages": 1,
        }
        if parser.title:
            meta["title"] = parser.title

        if custom_metadata:
            meta.update(custom_metadata)

        yield Document(content=cleaned_text, metadata=meta)
