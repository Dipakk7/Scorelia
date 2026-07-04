# app/modules/rag/generation/models.py

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, field_validator
from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.citations.models import Citation



class ContextDocument(BaseModel):
    """Represents a source document with its merged chunks and metadata."""
    document_id: str = Field(..., description="ID of the document.")
    source: Optional[str] = Field(None, description="Source file name or URI.")
    combined_text: str = Field(..., description="Merged content of the chunks belonging to this document.")
    chunks: List[RetrievedChunk] = Field(default_factory=list, description="Original chunks matching this document.")


class PromptMetadata(BaseModel):
    """Metadata regarding prompt formulation."""
    template_name: str = Field(..., description="The name of the prompt template used.")
    system_instructions: Optional[str] = Field(None, description="System persona and instructions given to LLM.")
    prompt_size: int = Field(..., description="Size of the rendered prompt in characters.")
    variables: Dict[str, Any] = Field(default_factory=dict, description="Variables passed to the template.")


class GenerationMetadata(BaseModel):
    """Execution metadata from the LLM generator."""
    model: str = Field(..., description="Name of the model that executed generation.")
    provider: str = Field(..., description="The AI provider (e.g. 'ollama').")
    latency_ms: float = Field(..., description="Overall response generation latency in milliseconds.")
    temperature: float = Field(..., description="Temperature setting applied.")
    top_p: float = Field(..., description="Top-p setting applied.")


class TokenUsage(BaseModel):
    """Token tracking statistics."""
    prompt_tokens: int = Field(0, description="Tokens used in prompt.")
    completion_tokens: int = Field(0, description="Tokens generated in response.")
    total_tokens: int = Field(0, description="Total tokens consumed.")


class RAGRequest(BaseModel):
    """Request payload for semantic Q&A queries."""
    question: str = Field(..., description="User's query / question.")
    collection: Optional[str] = Field(None, description="Specific logical collection key to search (e.g. resume_kb).")
    collections: Optional[List[str]] = Field(None, description="List of logical collections to search.")
    strategy: Optional[str] = Field(None, description="Search strategy override.")
    top_k: Optional[int] = Field(None, description="Top-K retrieval limit.")
    similarity_threshold: Optional[float] = Field(None, description="Relevance cutoff threshold.")
    temperature: Optional[float] = Field(None, description="LLM sampling temperature.")
    top_p: Optional[float] = Field(None, description="LLM nucleus sampling.")
    max_output_tokens: Optional[int] = Field(None, description="Max tokens generated.")
    prompt_template: Optional[str] = Field(None, description="Prompt template override (e.g. resume_qa).")
    history: Optional[List[Dict[str, str]]] = Field(None, description="Conversation chat history.")

    @field_validator("question")
    @classmethod
    def validate_question(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Question string cannot be empty.")
        return v.strip()


class RAGResponse(BaseModel):
    """Unified response containing final answer, structured context, and execution metadata."""
    answer: str = Field(..., description="Generated answer from the model.")
    context_documents: List[ContextDocument] = Field(..., description="Context documents used to form answer.")
    prompt_metadata: PromptMetadata = Field(..., description="Prompt configuration and metadata.")
    generation_metadata: GenerationMetadata = Field(..., description="LLM execution configurations and times.")
    token_usage: TokenUsage = Field(..., description="Token usage details.")
    retrieved_document_count: int = Field(..., description="Number of distinct source documents retrieved.")
    retrieved_chunk_count: int = Field(..., description="Number of distinct chunks retrieved.")
    context_size: int = Field(..., description="Total size of merged context text in characters.")
    prompt_size: int = Field(..., description="Total rendered prompt size in characters.")
    latency_ms: float = Field(..., description="Total e2e latency of RAG generation in milliseconds.")
    model: str = Field(..., description="Model name that generated the response.")
    citations: List[Citation] = Field(default_factory=list, description="Citations mapping generated answer to sources.")
    request_id: Optional[str] = Field(None, description="Unique identifier for the execution request.")
    cache_status: Optional[str] = Field(None, description="Cache hit/miss status.")



class RAGBatchRequest(BaseModel):
    """Payload representing multiple query requests."""
    requests: List[RAGRequest] = Field(..., description="List of individual RAG requests.")


class RAGBatchResponse(BaseModel):
    """Response containing replies for all batch requests."""
    responses: List[RAGResponse] = Field(..., description="List of RAG response objects.")
