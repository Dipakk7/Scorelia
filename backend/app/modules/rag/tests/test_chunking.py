# app/modules/rag/tests/test_chunking.py

import pytest
import logging
from datetime import datetime
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.models.user import User
from app.modules.rag.config import RAGConfig
from app.modules.rag.schemas.document import LoadedDocument, Document, DocumentMetadata
from app.modules.rag.chunking.recursive import RecursiveChunker
from app.modules.rag.chunking.markdown import MarkdownChunker
from app.modules.rag.chunking.semantic import SemanticChunker
from app.modules.rag.chunking.factory import ChunkFactory
from app.modules.rag.chunking.service import ChunkingService
from app.modules.rag.exceptions import (
    InvalidChunkSizeError,
    UnsupportedChunkerError,
    ChunkValidationError,
    EmptyDocumentError,
)

# Mock authenticated user for API tests
mock_user = User(
    id=1,
    email="test@example.com",
    is_active=True,
)

@pytest.fixture(autouse=True)
def setup_auth_override():
    app.dependency_overrides[get_current_user] = lambda: mock_user
    yield
    if get_current_user in app.dependency_overrides:
        del app.dependency_overrides[get_current_user]

client = TestClient(app)



@pytest.fixture
def sample_doc_metadata() -> DocumentMetadata:
    return DocumentMetadata(
        file_name="sample_resume.pdf",
        extension="pdf",
        mime_type="application/pdf",
        file_size=1024,
        upload_timestamp=datetime.utcnow(),
        last_modified=datetime.utcnow(),
        num_pages=2,
        num_characters=200,
        num_words=30,
        estimated_reading_time=1.0,
        language="en",
        custom_metadata={},
    )


@pytest.fixture
def sample_pdf_doc(sample_doc_metadata) -> LoadedDocument:
    return LoadedDocument(
        content="Page 1 content about Python and FastAPI.\n\nPage 2 content about ChromaDB and LangChain.",
        metadata=sample_doc_metadata,
        pages=[
            Document(content="Page 1 content about Python and FastAPI.", metadata={"page_number": 1}),
            Document(content="Page 2 content about ChromaDB and LangChain.", metadata={"page_number": 2}),
        ],
    )


@pytest.fixture
def sample_md_doc() -> LoadedDocument:
    md_metadata = DocumentMetadata(
        file_name="guide.md",
        extension="md",
        mime_type="text/markdown",
        file_size=500,
        upload_timestamp=datetime.utcnow(),
        last_modified=datetime.utcnow(),
        num_pages=1,
        num_characters=250,
        num_words=40,
        estimated_reading_time=1.0,
        language="en",
        custom_metadata={},
    )
    return LoadedDocument(
        content="# Main Title\n\n## Section 1\nHere is a table:\n| A | B |\n|---|---|\n| 1 | 2 |\n\n## Section 2\nHere is a list:\n* Item A\n* Item B\n\n```python\nprint('hello')\n```",
        metadata=md_metadata,
        pages=[
            Document(
                content="# Main Title\n\n## Section 1\nHere is a table:\n| A | B |\n|---|---|\n| 1 | 2 |\n\n## Section 2\nHere is a list:\n* Item A\n* Item B\n\n```python\nprint('hello')\n```",
                metadata={"page_number": 1},
            )
        ],
    )


# --- 1. Configuration Tests ---
def test_rag_config_chunking_resolution():
    config = RAGConfig()
    assert config.default_chunk_size == 500
    assert config.default_chunk_overlap == 50
    assert config.max_chunk_size == 2000
    assert config.min_chunk_size == 50
    assert isinstance(config.recursive_separators, list)
    assert isinstance(config.markdown_headers, list)


# --- 2. Recursive Chunker Tests ---
def test_recursive_chunker_basic(sample_pdf_doc):
    chunker = RecursiveChunker(
        chunk_size=50,
        chunk_overlap=5,
        max_chunk_size=2000,
        min_chunk_size=10,
    )
    chunks = chunker.chunk(sample_pdf_doc)
    assert len(chunks) > 0
    # Validate each page is chunked separately (page number preserved)
    for c in chunks:
        assert c.metadata.page_number in [1, 2]
        assert c.metadata.source_file == "sample_resume.pdf"


# --- 3. Markdown Chunker Tests ---
def test_markdown_chunker_structure(sample_md_doc):
    chunker = MarkdownChunker(
        chunk_size=100,
        chunk_overlap=10,
        max_chunk_size=2000,
        min_chunk_size=5,
    )
    chunks = chunker.chunk(sample_md_doc)
    assert len(chunks) > 0
    
    # Check that metadata section extraction works
    has_section = False
    has_heading = False
    for c in chunks:
        if c.metadata.section == "Main Title":
            has_section = True
        if c.metadata.heading in ["Section 1", "Section 2"]:
            has_heading = True
            
    assert has_section
    assert has_heading


# --- 4. Semantic Chunker Tests ---
def test_semantic_chunker_fallback(sample_pdf_doc):
    chunker = SemanticChunker(
        chunk_size=100,
        chunk_overlap=10,
        max_chunk_size=2000,
        min_chunk_size=5,
    )
    chunks = chunker.chunk(sample_pdf_doc)
    # Falls back to Recursive Chunker but initializes properly
    assert len(chunks) > 0


# --- 5. Chunk Factory Tests ---
def test_chunk_factory_resolution():
    config = RAGConfig()
    chunker_md = ChunkFactory.get_chunker(
        strategy="md",
        chunk_size=500,
        chunk_overlap=50,
        max_chunk_size=2000,
        min_chunk_size=10,
    )
    assert isinstance(chunker_md, MarkdownChunker)

    chunker_pdf = ChunkFactory.get_chunker(
        strategy="pdf",
        chunk_size=500,
        chunk_overlap=50,
        max_chunk_size=2000,
        min_chunk_size=10,
    )
    assert isinstance(chunker_pdf, RecursiveChunker)

    chunker_semantic = ChunkFactory.get_chunker(
        strategy="semantic",
        chunk_size=500,
        chunk_overlap=50,
        max_chunk_size=2000,
        min_chunk_size=10,
    )
    assert isinstance(chunker_semantic, SemanticChunker)


# --- 6. Chunk Metadata and Offset Validation ---
def test_chunking_service_metadata_resolution(sample_pdf_doc):
    config = RAGConfig()
    service = ChunkingService(config)
    
    response = service.chunk_document(document=sample_pdf_doc, chunk_size=100, chunk_overlap=10)
    assert response.total_chunks > 0
    assert response.strategy_used == "recursive"
    
    # Check all fields in ChunkMetadata
    for idx, c in enumerate(response.chunks):
        meta = c.metadata
        assert meta.chunk_id is not None
        assert meta.document_id == response.document_id
        assert meta.chunk_index == idx
        assert meta.total_chunks == response.total_chunks
        assert meta.source_file == "sample_resume.pdf"
        assert meta.source_type == "pdf"
        assert meta.word_count > 0
        assert meta.token_estimate > 0
        
        # Verify char boundary offsets are valid substrings
        substring = sample_pdf_doc.content[meta.character_start:meta.character_end]
        assert substring.strip() == c.content.strip()


# --- 7. Error Handling Tests ---
def test_chunking_error_cases(sample_pdf_doc):
    config = RAGConfig()
    service = ChunkingService(config)

    # Empty document
    empty_doc = LoadedDocument(
        content="",
        metadata=sample_pdf_doc.metadata,
        pages=[]
    )
    with pytest.raises(EmptyDocumentError):
        service.chunk_document(empty_doc)

    # Invalid overlap
    with pytest.raises(InvalidChunkSizeError):
        service.chunk_document(sample_pdf_doc, chunk_size=100, chunk_overlap=150)

    # Unsupported strategy
    with pytest.raises(UnsupportedChunkerError):
        service.chunk_document(sample_pdf_doc, strategy="unsupported_str")


# --- 8. Privacy Logging Verification ---
def test_privacy_logging(sample_pdf_doc, capsys):
    config = RAGConfig()
    service = ChunkingService(config)
    
    service.chunk_document(sample_pdf_doc, chunk_size=100)
    
    # Check stdout output does not contain any of document text/PII
    captured = capsys.readouterr()
    log_text = captured.out
    assert "document_segmentation_completed" in log_text
    assert "Python" not in log_text
    assert "FastAPI" not in log_text
    assert "ChromaDB" not in log_text



# --- 9. API Endpoints Tests ---
def test_api_chunk_config():
    response = client.get("/api/v1/rag/chunks/config")
    assert response.status_code == 200
    data = response.json()
    assert "default_chunk_size" in data
    assert "default_chunk_overlap" in data


def test_api_chunk_preview_and_create(sample_pdf_doc):
    import json
    payload = {
        "document": json.loads(sample_pdf_doc.model_dump_json()),
        "chunk_size": 80,
        "chunk_overlap": 10,
        "chunking_strategy": "recursive"
    }

    # Test Preview
    response = client.post("/api/v1/rag/chunks/preview", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_chunks"] > 0
    assert len(data["chunks"]) == data["total_chunks"]
    assert data["strategy_used"] == "recursive"

    # Test Create
    response = client.post("/api/v1/rag/chunks/create", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_chunks"] > 0


# --- 10. Performance and Large Document Tests ---
def test_performance_large_document():
    config = RAGConfig()
    service = ChunkingService(config)
    
    # Build a large document ~100KB
    large_content = "This is a performance testing section repeated many times.\n\n" * 1000
    large_metadata = DocumentMetadata(
        file_name="large_file.txt",
        extension="txt",
        mime_type="text/plain",
        file_size=len(large_content),
        upload_timestamp=datetime.utcnow(),
        last_modified=datetime.utcnow(),
        num_pages=1,
        num_characters=len(large_content),
        num_words=len(large_content.split()),
        estimated_reading_time=10.0,
        language="en",
        custom_metadata={},
    )
    large_doc = LoadedDocument(
        content=large_content,
        metadata=large_metadata,
        pages=[Document(content=large_content, metadata={"page_number": 1})]
    )

    response = service.chunk_document(large_doc, chunk_size=1000, chunk_overlap=100)
    assert response.total_chunks > 0
    assert response.processing_time_ms < 500  # Large document processed under 500ms
