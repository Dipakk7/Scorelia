# app/modules/rag/chunking/factory.py

import structlog
from app.modules.rag.chunking.base import BaseChunker
from app.modules.rag.chunking.recursive import RecursiveChunker
from app.modules.rag.chunking.markdown import MarkdownChunker
from app.modules.rag.chunking.semantic import SemanticChunker
from app.modules.rag.exceptions import UnsupportedChunkerError

logger = structlog.get_logger()


class ChunkFactory:
    """Factory class to select and instantiate appropriate chunker strategies."""

    @staticmethod
    def get_chunker(
        strategy: str,
        chunk_size: int,
        chunk_overlap: int,
        max_chunk_size: int,
        min_chunk_size: int,
        **kwargs
    ) -> BaseChunker:
        """Returns a configured chunker instance based on strategy or source type.

        Args:
            strategy: Strategy name (e.g. 'recursive', 'markdown', 'semantic') or file extension.
            chunk_size: Character size of each chunk.
            chunk_overlap: Overlap between adjacent chunks.
            max_chunk_size: Max allowed chunk character size.
            min_chunk_size: Min allowed chunk character size.

        Returns:
            An instance of BaseChunker.

        Raises:
            UnsupportedChunkerError: If strategy is unknown.
        """
        # Normalize strategy name
        norm_strategy = strategy.lower().strip().replace(".", "")

        if norm_strategy in ["markdown", "md"]:
            logger.info("chunk_factory_selected_markdown_chunker")
            return MarkdownChunker(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                max_chunk_size=max_chunk_size,
                min_chunk_size=min_chunk_size,
                **kwargs
            )
        elif norm_strategy in ["recursive", "txt", "pdf", "docx", "doc", "html"]:
            logger.info("chunk_factory_selected_recursive_chunker", strategy=norm_strategy)
            return RecursiveChunker(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                max_chunk_size=max_chunk_size,
                min_chunk_size=min_chunk_size,
                **kwargs
            )
        elif norm_strategy == "semantic":
            logger.info("chunk_factory_selected_semantic_chunker")
            return SemanticChunker(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                max_chunk_size=max_chunk_size,
                min_chunk_size=min_chunk_size,
                **kwargs
            )
        else:
            logger.error("chunk_factory_unsupported_strategy", strategy=strategy)
            raise UnsupportedChunkerError(
                f"Unsupported chunking strategy or document type: '{strategy}'."
            )
