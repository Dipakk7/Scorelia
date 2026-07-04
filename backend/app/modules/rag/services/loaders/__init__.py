# app/modules/rag/services/loaders/__init__.py

from typing import Dict, Type
from app.modules.rag.services.loaders.base import BaseDocumentLoader
from app.modules.rag.services.loaders.pdf import PDFLoader
from app.modules.rag.services.loaders.docx import DOCXLoader
from app.modules.rag.services.loaders.txt import TXTLoader
from app.modules.rag.services.loaders.markdown import MarkdownLoader
from app.modules.rag.services.loaders.html import HTMLLoader

LOADER_REGISTRY: Dict[str, Type[BaseDocumentLoader]] = {
    "pdf": PDFLoader,
    "docx": DOCXLoader,
    "txt": TXTLoader,
    "md": MarkdownLoader,
    "html": HTMLLoader,
}


def resolve_extension(filename: str) -> str:
    """Helper to resolve non-standard file extensions to normalized keys."""
    if not filename or "." not in filename:
        return ""
    ext = filename.split(".")[-1].lower()
    if ext == "markdown":
        return "md"
    if ext == "htm":
        return "html"
    if ext == "text":
        return "txt"
    return ext


__all__ = [
    "BaseDocumentLoader",
    "PDFLoader",
    "DOCXLoader",
    "TXTLoader",
    "MarkdownLoader",
    "HTMLLoader",
    "LOADER_REGISTRY",
    "resolve_extension",
]
