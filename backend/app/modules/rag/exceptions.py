# app/modules/rag/exceptions.py

class RAGError(Exception):
    """Base exception for all RAG-related errors."""
    pass


class ChromaDBConnectionError(RAGError):
    """Raised when ChromaDB connection or initialization fails."""
    pass


class CollectionNotFoundError(RAGError):
    """Raised when the requested collection is not found."""
    pass


class InvalidCollectionNameError(RAGError):
    """Raised when the collection name is invalid or not allowed."""
    pass


class EmbeddingInitializationError(RAGError):
    """Raised when the embedding model initialization fails."""
    pass


class OllamaUnavailableError(RAGError):
    """Raised when the Ollama server is unavailable or returns an error."""
    pass


class RAGConfigError(RAGError):
    """Raised when RAG configuration is invalid."""
    pass


class InvalidDocumentError(RAGError):
    """Raised when the document structure is invalid or corrupt."""
    pass


class UnsupportedFormatError(InvalidDocumentError):
    """Raised when the document format or extension is not supported."""
    pass


class CorruptedFileError(InvalidDocumentError):
    """Raised when the file is corrupted or unreadable."""
    pass


class ParsingFailureError(RAGError):
    """Raised when the text extraction parser fails."""
    pass


class EncodingFailureError(ParsingFailureError):
    """Raised when text file decoding/encoding fails."""
    pass


class ValidationFailureError(InvalidDocumentError):
    """Raised when the document fails validator rules (size, type, empty, etc.)."""
    pass


class EmptyDocumentError(InvalidDocumentError):
    """Raised when the document contains no readable text content."""
    pass


class ChunkingError(RAGError):
    """Base exception for all chunking-related errors."""
    pass


class InvalidChunkSizeError(ChunkingError):
    """Raised when the chunk size or overlap is invalid."""
    pass


class UnsupportedChunkerError(ChunkingError):
    """Raised when an unsupported chunker strategy is selected."""
    pass


class MetadataGenerationError(ChunkingError):
    """Raised when metadata generation for a chunk fails."""
    pass


class ChunkValidationError(ChunkingError):
    """Raised when a generated chunk fails validation checks."""
    pass


class DuplicateDetectionError(RAGError):
    """Raised when duplicate detection checks fail or policy enforces error."""
    pass


class VectorStorageError(RAGError):
    """Raised when vector storage operation fails."""
    pass


class VectorDBWriteError(VectorStorageError):
    """Raised when vector database write operation fails."""
    pass


class RetrievalError(RAGError):
    """Base exception for all retrieval-related errors."""
    pass


class EmptyQueryError(RetrievalError):
    """Raised when the search query is empty."""
    pass


class InvalidTopKError(RetrievalError):
    """Raised when top_k parameter is invalid."""
    pass


class CollectionMissingError(RetrievalError):
    """Raised when collection is missing or not configured."""
    pass


class SearchFailureError(RetrievalError):
    """Raised when search execution fails."""
    pass


class EmbeddingFailureError(RetrievalError):
    """Raised when embedding generation fails during search query execution."""
    pass


class SimilarityThresholdError(RetrievalError):
    """Raised when similarity threshold parameter is invalid."""
    pass


class DisabledCollectionError(RAGError):
    """Raised when searching against a disabled collection."""
    pass


class EmptyKnowledgeBaseError(RAGError):
    """Raised when searching an empty collection or registry."""
    pass


class SearchTimeoutError(RAGError):
    """Raised when retrieval times out."""
    pass


class InvalidSearchStrategyError(RAGError):
    """Raised when the search strategy is invalid."""
    pass


class EmptyContextError(RAGError):
    """Raised when the retrieved context is empty and strict mode is active."""
    pass


class PromptGenerationError(RAGError):
    """Raised when prompt construction fails."""
    pass


class ContextOverflowError(RAGError):
    """Raised when context exceeds token limits and cannot be resolved."""
    pass


class InvalidTemplateError(RAGError):
    """Raised when an unknown template key is specified."""
    pass


class TokenLimitExceededError(RAGError):
    """Raised when prompt exceeds max token limits."""
    pass


class ResponseValidationError(RAGError):
    """Raised when generated response fails validation."""
    pass


class HallucinationGuardError(RAGError):
    """Raised when response fails hallucination checks."""
    pass



