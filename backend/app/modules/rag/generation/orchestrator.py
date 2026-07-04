# app/modules/rag/generation/orchestrator.py

import time
import uuid
from typing import List, Optional, Dict, Any
import structlog

from app.modules.rag.config import RAGConfig
from app.modules.rag.exceptions import (
    EmptyQueryError,
    InvalidCollectionNameError,
    EmptyContextError,
    ResponseValidationError,
    HallucinationGuardError,
    OllamaUnavailableError
)
from app.modules.rag.constants import ALLOWED_COLLECTIONS
from app.modules.rag.retrieval.service import RetrievalService
from app.modules.rag.knowledge.service import KnowledgeBaseService
from app.modules.rag.knowledge.models import KnowledgeSearchRequest
from app.modules.rag.generation.context_builder import ContextBuilder
from app.modules.rag.generation.prompt_builder import PromptBuilder
from app.modules.rag.generation.generator import RAGGenerator
from app.modules.rag.generation.validators import RAGResponseValidator
from app.modules.rag.generation.models import (
    RAGRequest,
    RAGResponse,
    RAGBatchRequest,
    RAGBatchResponse,
    PromptMetadata,
    GenerationMetadata,
    TokenUsage
)
from app.modules.rag.citations.service import CitationService
from app.modules.rag.services.cache_service import ResponseCacheService
from app.modules.rag.services.optimizer import PerformanceOptimizer
from app.modules.rag.services.metrics_service import RAGMetricsService

logger = structlog.get_logger()


class RAGOrchestrator:
    """Core RAG Generation pipeline entry point coordinating retrieval, context, prompts, LLM responses, and optimizations."""

    def __init__(
        self,
        retrieval_service: RetrievalService,
        knowledge_base_service: KnowledgeBaseService,
        context_builder: ContextBuilder,
        prompt_builder: PromptBuilder,
        generator: RAGGenerator,
        config: RAGConfig,
        citation_service: Optional[CitationService] = None,
        cache_service: Optional[ResponseCacheService] = None,
        optimizer: Optional[PerformanceOptimizer] = None,
        metrics_service: Optional[RAGMetricsService] = None
    ):
        self.retrieval_service = retrieval_service
        self.knowledge_base_service = knowledge_base_service
        self.context_builder = context_builder
        self.prompt_builder = prompt_builder
        self.generator = generator
        self.config = config
        self.citation_service = citation_service or CitationService()
        self.cache_service = cache_service or ResponseCacheService()
        self.optimizer = optimizer or PerformanceOptimizer(token_estimate_ratio=config.token_estimate_ratio)
        self.metrics_service = metrics_service or RAGMetricsService()
        self.validator = RAGResponseValidator(
            hallucination_guard=getattr(config, "hallucination_guard", True)
        )

    async def query(self, request: RAGRequest) -> RAGResponse:
        """Executes RAG pipeline: retrieval, optimization, generation, validation, citation, and caching."""
        start_time = time.perf_counter()
        request_id = str(uuid.uuid4())

        try:
            # 1. Validate request parameters
            if not request.question or not request.question.strip():
                raise EmptyQueryError("User question cannot be empty.")

            # Validate collections
            if request.collection:
                if request.collection not in ALLOWED_COLLECTIONS:
                    raise InvalidCollectionNameError(f"Collection '{request.collection}' is not allowed.")
            if request.collections:
                for c in request.collections:
                    if c not in ALLOWED_COLLECTIONS:
                        raise InvalidCollectionNameError(f"Collection '{c}' is not allowed.")

            # Log parameters strictly under privacy compliance (NO user questions, NO answers, NO prompts)
            logger.info(
                "initiating_rag_query_execution",
                request_id=request_id,
                collection=request.collection,
                collections_list=request.collections,
                strategy=request.strategy,
                template=request.prompt_template
            )

            # 2. Try Query Cache (Cache Hit)
            model_name = getattr(self.generator, "model", self.config.embedding_model or "qwen2.5:3b")
            if self.config.cache_ttl > 0:
                cached_res = self.cache_service.get_query(
                    query=request.question,
                    collection=request.collection,
                    collections=request.collections,
                    template=request.prompt_template,
                    top_k=request.top_k,
                    model=model_name
                )
                if cached_res:
                    self.metrics_service.record_cache(hit=True)
                    # Create a copy with the new request ID and cache hit status
                    hit_response = cached_res.model_copy(update={
                        "request_id": request_id,
                        "cache_status": "hit",
                        "latency_ms": (time.perf_counter() - start_time) * 1000.0
                    })
                    # Re-save citations to the lookup service for the new request ID
                    if cached_res.citations:
                        self.citation_service.save_citations(request_id, cached_res.citations)

                    self.metrics_service.record_query(hit_response.latency_ms, is_error=False)
                    return hit_response

                self.metrics_service.record_cache(hit=False)

            # 3. Execute semantic retrieval
            collections_to_search = None
            if request.collection:
                collections_to_search = [request.collection]
            elif request.collections:
                collections_to_search = request.collections
            else:
                collections_to_search = [self.config.default_knowledge_base]

            # Check Retrieval Cache
            chunks = None
            ret_top_k = request.top_k or self.config.default_top_k
            ret_threshold = request.similarity_threshold or self.config.similarity_threshold
            
            if self.config.cache_ttl > 0:
                chunks = self.cache_service.get_retrieved_chunks(
                    query=request.question,
                    collections=collections_to_search,
                    top_k=ret_top_k,
                    threshold=ret_threshold
                )

            if chunks is not None:
                self.metrics_service.record_cache(hit=True)
                self.metrics_service.record_retrieval(0.0, len(chunks))
            else:
                self.metrics_service.record_cache(hit=False)
                search_req = KnowledgeSearchRequest(
                    query=request.question,
                    strategy=request.strategy,
                    collections=collections_to_search,
                    top_k=ret_top_k,
                    similarity_threshold=ret_threshold
                )

                ret_start = time.perf_counter()
                search_response = await self.knowledge_base_service.search(search_req)
                chunks = search_response.chunks
                
                ret_latency = (time.perf_counter() - ret_start) * 1000.0
                self.metrics_service.record_retrieval(ret_latency, len(chunks))

                if self.config.cache_ttl > 0:
                    self.cache_service.set_retrieved_chunks(
                        query=request.question,
                        collections=collections_to_search,
                        top_k=ret_top_k,
                        threshold=ret_threshold,
                        chunks=chunks,
                        ttl=self.config.cache_ttl
                    )

            # Reject empty context in strict mode
            strict_mode = self.config.strict_context_mode
            if not chunks:
                if strict_mode:
                    logger.warning("rag_query_failed_empty_context", request_id=request_id)
                    raise EmptyContextError("No relevant context found in the knowledge base.")

            # 4. Run Performance Optimizer on retrieved chunks (trims and deduplicates)
            optimized_chunks = self.optimizer.optimize_chunks(chunks)
            optimized_chunks = self.optimizer.optimize_context(
                chunks=optimized_chunks,
                max_tokens=self.config.max_context_tokens
            )

            # 5. Build context
            context_result = self.context_builder.build_context(
                chunks=optimized_chunks,
                max_tokens=self.config.max_context_tokens
            )
            context_text = context_result["context_text"]

            # 6. Build and optimize prompt
            prompt_result = self.prompt_builder.build_prompt(
                context_text=context_text,
                question=request.question,
                template_name=request.prompt_template,
                history=request.history
            )
            prompt_body = prompt_result["prompt"]
            system_prompt = prompt_result["system_prompt"]
            resolved_template = prompt_result["template_name"]

            # Optimize the prompt text string (strips whitespaces, formatting)
            optimized_prompt = self.optimizer.optimize_prompt(prompt_body)

            # 7. Generate Response (with prompt generation caching)
            answer = None
            gen_latency = 0.0
            prompt_tokens = 0
            completion_tokens = 0
            total_tokens = 0
            provider = "ollama"

            if self.config.cache_ttl > 0:
                answer = self.cache_service.get_generation(optimized_prompt, system_prompt)

            if answer is not None:
                self.metrics_service.record_cache(hit=True)
                self.metrics_service.record_generation(0.0, len(optimized_prompt), len(context_text), 0, 0)
            else:
                self.metrics_service.record_cache(hit=False)
                gen_start = time.perf_counter()
                provider_res = await self.generator.generate_response(
                    prompt=optimized_prompt,
                    system_prompt=system_prompt,
                    temperature=request.temperature,
                    top_p=request.top_p,
                    max_output_tokens=request.max_output_tokens
                )
                
                gen_latency = (time.perf_counter() - gen_start) * 1000.0
                answer = provider_res.text
                model_name = provider_res.model
                provider = provider_res.provider
                
                usage = provider_res.usage or {}
                prompt_tokens = usage.get("prompt_tokens", 0)
                completion_tokens = usage.get("completion_tokens", 0)
                total_tokens = usage.get("total_tokens", 0)

                self.metrics_service.record_generation(
                    latency_ms=gen_latency,
                    prompt_size=len(optimized_prompt),
                    context_size=len(context_text),
                    prompt_t=prompt_tokens,
                    completion_t=completion_tokens
                )

                if self.config.cache_ttl > 0:
                    self.cache_service.set_generation(
                        prompt=optimized_prompt,
                        system_prompt=system_prompt,
                        response_text=answer,
                        ttl=self.config.cache_ttl
                    )

            # 8. Validate generated response
            validated_answer = self.validator.validate(
                response_text=answer,
                context_text=context_text,
                strict=strict_mode
            )

            # 9. Citation Engine Attribution
            citations = self.citation_service.build_citations(
                chunks=optimized_chunks,
                collection_override=request.collection
            )
            self.citation_service.save_citations(request_id, citations)

            total_latency = (time.perf_counter() - start_time) * 1000.0

            # Structure response metadata
            token_usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens
            )

            prompt_metadata = PromptMetadata(
                template_name=resolved_template,
                system_instructions=system_prompt,
                prompt_size=len(optimized_prompt),
                variables={
                    "question": "REDACTED",
                    "context_size": len(context_text),
                    "history_length": len(request.history) if request.history else 0
                }
            )

            generation_metadata = GenerationMetadata(
                model=model_name,
                provider=provider,
                latency_ms=gen_latency,
                temperature=request.temperature if request.temperature is not None else getattr(self.config, "temperature", 0.3),
                top_p=request.top_p if request.top_p is not None else getattr(self.config, "top_p", 0.9)
            )

            response = RAGResponse(
                answer=validated_answer,
                context_documents=context_result["context_documents"],
                prompt_metadata=prompt_metadata,
                generation_metadata=generation_metadata,
                token_usage=token_usage,
                retrieved_document_count=context_result["retrieved_document_count"],
                retrieved_chunk_count=context_result["retrieved_chunk_count"],
                context_size=context_result["context_size"],
                prompt_size=len(optimized_prompt),
                latency_ms=total_latency,
                model=model_name,
                citations=citations,
                request_id=request_id,
                cache_status="miss"
            )

            # 10. Cache final query response
            if self.config.cache_ttl > 0:
                self.cache_service.set_query(
                    query=request.question,
                    collection=request.collection,
                    collections=request.collections,
                    template=request.prompt_template,
                    top_k=request.top_k,
                    model=model_name,
                    response=response,
                    ttl=self.config.cache_ttl
                )

            # Record metrics query completed
            self.metrics_service.record_query(total_latency, is_error=False)

            # Log completion metrics strictly conforming to privacy standard (do not log answer, question, or text context)
            logger.info(
                "rag_query_execution_completed",
                request_id=request_id,
                model=model_name,
                provider=provider,
                latency_ms=total_latency,
                retrieved_document_count=context_result["retrieved_document_count"],
                retrieved_chunk_count=context_result["retrieved_chunk_count"],
                prompt_size=len(optimized_prompt),
                context_size=context_result["context_size"],
                prompt_tokens=token_usage.prompt_tokens,
                completion_tokens=token_usage.completion_tokens,
                total_tokens=token_usage.total_tokens
            )

            return response

        except Exception as e:
            total_latency = (time.perf_counter() - start_time) * 1000.0
            self.metrics_service.record_query(total_latency, is_error=True)
            raise e

    async def query_batch(self, batch_request: RAGBatchRequest) -> RAGBatchResponse:
        """Executes a list of RAG requests sequentially and compiles the responses."""
        responses = []
        for req in batch_request.requests:
            try:
                res = await self.query(req)
                responses.append(res)
            except Exception as e:
                # Wrap errors in a clean error format response so that individual failures don't crash the entire batch
                logger.error("batch_query_item_failed", error=str(e))
                # Create a mock response for failure
                responses.append(
                    RAGResponse(
                        answer=f"Error processing query: {str(e)}",
                        context_documents=[],
                        prompt_metadata=PromptMetadata(
                            template_name="unknown",
                            system_instructions=None,
                            prompt_size=0,
                            variables={}
                        ),
                        generation_metadata=GenerationMetadata(
                            model="unknown",
                            provider="unknown",
                            latency_ms=0.0,
                            temperature=0.0,
                            top_p=0.0
                        ),
                        token_usage=TokenUsage(prompt_tokens=0, completion_tokens=0, total_tokens=0),
                        retrieved_document_count=0,
                        retrieved_chunk_count=0,
                        context_size=0,
                        prompt_size=0,
                        latency_ms=0.0,
                        model="unknown",
                        citations=[],
                        request_id=str(uuid.uuid4()),
                        cache_status="miss"
                    )
                )
        return RAGBatchResponse(responses=responses)
