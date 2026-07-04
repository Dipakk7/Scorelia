# app/modules/rag/tests/test_citations.py

import pytest
from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.citations.models import Citation, CitationStyle
from app.modules.rag.citations.builder import build_citations_from_chunks
from app.modules.rag.citations.formatter import format_citation, format_citations
from app.modules.rag.citations.service import CitationService


def test_build_citations_from_chunks():
    chunks = [
        RetrievedChunk(
            chunk_id="chunk_1",
            document_id="doc_a",
            similarity_score=0.85,
            content="Some text about resume.",
            page=3,
            section="Experience",
            heading="Software Engineer",
            source="resume_dipak.pdf",
            chunk_index=0,
            embedding_model="nomic-embed-text",
            collection="resume_kb"
        )
    ]
    citations = build_citations_from_chunks(chunks)
    assert len(citations) == 1
    c = citations[0]
    assert c.chunk_id == "chunk_1"
    assert c.document_id == "doc_a"
    assert c.source_file == "resume_dipak.pdf"
    assert c.page_number == 3
    assert c.section == "Experience"
    assert c.heading == "Software Engineer"
    assert c.collection == "resume_kb"
    assert c.similarity_score == 0.85


def test_citation_formatting():
    citation = Citation(
        document_id="doc_a",
        chunk_id="chunk_1",
        source_file="resume_dipak.pdf",
        page_number=3,
        section="Experience",
        heading="Software Engineer",
        collection="resume_kb",
        similarity_score=0.85
    )

    # Test standard style
    std = format_citation(citation, 1, CitationStyle.STANDARD)
    assert std == "[1] resume_dipak.pdf (p. 3, Section: Experience)"

    # Test APA style
    apa = format_citation(citation, 1, CitationStyle.APA)
    assert apa == "(resume_dipak.pdf, p. 3)"

    # Test IEEE style
    ieee = format_citation(citation, 1, CitationStyle.IEEE)
    assert ieee == "[1]"

    # Test Inline style
    inl = format_citation(citation, 1, CitationStyle.INLINE)
    assert inl == "[resume_dipak.pdf:3]"

    # Test None style
    non = format_citation(citation, 1, CitationStyle.NONE)
    assert non == "resume_dipak.pdf (chunk: chunk_1)"


def test_citation_service_deduplicate_and_sort():
    chunks = [
        RetrievedChunk(
            chunk_id="chunk_1",
            document_id="doc_a",
            similarity_score=0.80,
            content="Lower score copy.",
            page=3,
            section="Experience",
            heading="Software Engineer",
            source="resume_dipak.pdf",
            chunk_index=0,
            embedding_model="nomic-embed-text",
            collection="resume_kb"
        ),
        RetrievedChunk(
            chunk_id="chunk_1",
            document_id="doc_a",
            similarity_score=0.95,
            content="Higher score copy.",
            page=3,
            section="Experience",
            heading="Software Engineer",
            source="resume_dipak.pdf",
            chunk_index=0,
            embedding_model="nomic-embed-text",
            collection="resume_kb"
        ),
        RetrievedChunk(
            chunk_id="chunk_2",
            document_id="doc_b",
            similarity_score=0.90,
            content="Another doc chunk.",
            page=1,
            section="Summary",
            heading=None,
            source="resume_other.pdf",
            chunk_index=1,
            embedding_model="nomic-embed-text",
            collection="resume_kb"
        )
    ]

    service = CitationService()
    citations = service.build_citations(chunks)

    # Should deduplicate chunk_1 and keep the higher score (0.95)
    assert len(citations) == 2
    
    # Chunks should be sorted by score descending: chunk_1 (0.95) first, chunk_2 (0.90) second
    assert citations[0].chunk_id == "chunk_1"
    assert citations[0].similarity_score == 0.95
    assert citations[1].chunk_id == "chunk_2"
    assert citations[1].similarity_score == 0.90


def test_citation_service_in_memory_cache():
    service = CitationService(max_cached_requests=3)
    c1 = [Citation(document_id="d1", chunk_id="c1", similarity_score=0.9)]
    c2 = [Citation(document_id="d2", chunk_id="c2", similarity_score=0.8)]
    c3 = [Citation(document_id="d3", chunk_id="c3", similarity_score=0.7)]
    c4 = [Citation(document_id="d4", chunk_id="c4", similarity_score=0.6)]

    service.save_citations("req_1", c1)
    service.save_citations("req_2", c2)
    service.save_citations("req_3", c3)

    assert service.get_citations("req_1") == c1
    assert service.get_citations("req_2") == c2
    assert service.get_citations("req_3") == c3

    # Adding req_4 should trigger eviction of the oldest (req_1)
    service.save_citations("req_4", c4)
    assert service.get_citations("req_1") is None
    assert service.get_citations("req_4") == c4

    service.clear()
    assert service.get_citations("req_2") is None
