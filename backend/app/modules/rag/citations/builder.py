# app/modules/rag/citations/builder.py

from typing import List, Optional
from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.citations.models import Citation


def build_citations_from_chunks(
    chunks: List[RetrievedChunk],
    collection_override: Optional[str] = None
) -> List[Citation]:
    """Converts a list of RetrievedChunk objects into Citation objects.

    Preserves metadata and maps fields appropriately.
    """
    citations = []
    for chunk in chunks:
        citations.append(
            Citation(
                document_id=chunk.document_id,
                chunk_id=chunk.chunk_id,
                source_file=chunk.source,
                page_number=chunk.page,
                section=chunk.section,
                heading=chunk.heading,
                collection=collection_override or chunk.collection,
                similarity_score=chunk.similarity_score
            )
        )
    return citations
