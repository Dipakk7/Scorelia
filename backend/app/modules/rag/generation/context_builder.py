# app/modules/rag/generation/context_builder.py

from typing import List, Dict, Any, Optional
import structlog
from app.modules.rag.config import RAGConfig
from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.generation.models import ContextDocument

logger = structlog.get_logger()


class ContextBuilder:
    """Constructs token-limited, deduplicated, and logically grouped prompt context strings from retrieved chunks."""

    def __init__(self, config: RAGConfig):
        self.config = config

    def estimate_tokens(self, text: str) -> int:
        """Estimate token usage for a given text segment."""
        ratio = getattr(self.config, "token_estimate_ratio", 0.25)
        return int(len(text) * ratio)

    def build_context(
        self,
        chunks: List[RetrievedChunk],
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """Processes retrieved chunks, deduplicates, sorts, merges adjacent blocks, and limits context size.

        Args:
            chunks: List of RetrievedChunk models retrieved from search.
            max_tokens: Max allowed context tokens override.

        Returns:
            Dict containing:
                - "context_text": The formatted prompt context block.
                - "context_documents": List of ContextDocument structures.
                - "token_usage": Estimated token count of context_text.
                - "retrieved_document_count": Unique document count.
                - "retrieved_chunk_count": Total chunks processed.
                - "context_size": Total character length of context_text.
                - "dropped_chunks_count": Number of chunks dropped to fit token budget.
        """
        retrieved_chunk_count = len(chunks)
        if not chunks:
            return {
                "context_text": "",
                "context_documents": [],
                "token_usage": 0,
                "retrieved_document_count": 0,
                "retrieved_chunk_count": 0,
                "context_size": 0,
                "dropped_chunks_count": 0
            }

        # 1. Deduplicate by chunk_id and sort by similarity score descending
        seen_ids = set()
        deduplicated_chunks: List[RetrievedChunk] = []
        for c in chunks:
            if c.chunk_id not in seen_ids:
                seen_ids.add(c.chunk_id)
                deduplicated_chunks.append(c)

        # Sort explicitly by relevance score descending
        deduplicated_chunks.sort(key=lambda x: x.similarity_score, reverse=True)

        # 2. Limit top-K chunks to max retrieved chunks from config
        max_chunks = getattr(self.config, "max_retrieved_chunks", 10)
        if len(deduplicated_chunks) > max_chunks:
            deduplicated_chunks = deduplicated_chunks[:max_chunks]

        # 3. Apply maximum token budget (budget constraint)
        budget = max_tokens if max_tokens is not None else getattr(self.config, "max_context_tokens", 4096)
        
        selected_chunks: List[RetrievedChunk] = []
        running_tokens = 0
        dropped_chunks_count = 0

        for chunk in deduplicated_chunks:
            chunk_tokens = self.estimate_tokens(chunk.content)
            # Check if adding this chunk exceeds budget
            if running_tokens + chunk_tokens > budget:
                dropped_chunks_count += 1
                continue
            selected_chunks.append(chunk)
            running_tokens += chunk_tokens

        # 4. Group selected chunks by document_id
        grouped_by_doc: Dict[str, List[RetrievedChunk]] = {}
        for chunk in selected_chunks:
            grouped_by_doc.setdefault(chunk.document_id, []).append(chunk)

        # 5. Process each document group: sort by index, merge adjacent chunks, preserve section hierarchy
        context_docs: List[ContextDocument] = []
        formatted_docs: List[str] = []

        for doc_id, doc_chunks in grouped_by_doc.items():
            # Sort by chunk_index to preserve original document ordering
            doc_chunks.sort(key=lambda x: x.chunk_index)
            
            # Resolve source name (fallback to document_id)
            source_name = doc_chunks[0].source or "unknown"
            
            # Merge adjacent chunks
            merged_segments: List[str] = []
            current_segment_text = ""
            prev_index = -2

            for c in doc_chunks:
                # If chunk is adjacent (index difference is 1), merge with newline
                if c.chunk_index == prev_index + 1:
                    current_segment_text += "\n" + c.content
                else:
                    if current_segment_text:
                        merged_segments.append(current_segment_text)
                    current_segment_text = c.content
                prev_index = c.chunk_index
            
            if current_segment_text:
                merged_segments.append(current_segment_text)

            combined_text = "\n\n".join(merged_segments)

            # Preserve section hierarchy in formatting
            sections = [c.section for c in doc_chunks if c.section]
            section_info = f" (Section: {sections[0]})" if sections else ""
            
            doc_header = f"Document Source: {source_name}{section_info}\n---"
            formatted_doc = f"{doc_header}\n{combined_text}"
            formatted_docs.append(formatted_doc)

            context_docs.append(ContextDocument(
                document_id=doc_id,
                source=source_name,
                combined_text=combined_text,
                chunks=doc_chunks
            ))

        # Join all document context blocks
        context_text = "\n\n".join(formatted_docs)
        total_tokens = self.estimate_tokens(context_text)

        return {
            "context_text": context_text,
            "context_documents": context_docs,
            "token_usage": total_tokens,
            "retrieved_document_count": len(context_docs),
            "retrieved_chunk_count": retrieved_chunk_count,
            "context_size": len(context_text),
            "dropped_chunks_count": dropped_chunks_count
        }
