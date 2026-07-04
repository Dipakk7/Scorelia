# app/modules/rag/tests/test_generation.py

import pytest
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.models.user import User
from app.modules.rag.config import RAGConfig
from app.modules.rag.exceptions import (
    EmptyQueryError,
    InvalidCollectionNameError,
    EmptyContextError,
    ResponseValidationError,
    HallucinationGuardError,
    OllamaUnavailableError,
    InvalidTemplateError,
    TokenLimitExceededError
)
from app.modules.rag.dependencies import (
    get_rag_config,
    get_context_builder,
    get_prompt_builder,
    get_rag_generator,
    get_rag_orchestrator
)
from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.generation.models import (
    RAGRequest,
    RAGResponse,
    RAGBatchRequest,
    ContextDocument,
    PromptMetadata,
    GenerationMetadata,
    TokenUsage
)
from app.modules.rag.generation.context_builder import ContextBuilder
from app.modules.rag.generation.prompt_builder import PromptBuilder
from app.modules.rag.generation.generator import RAGGenerator
from app.modules.rag.generation.validators import RAGResponseValidator
from app.modules.rag.generation.orchestrator import RAGOrchestrator

# ---------------------------------------------------------
# Mocks & Fixtures
# ---------------------------------------------------------

mock_user = User(
    id=1,
    email="test-rag-generation@example.com",
    is_active=True,
)


class MockEmbeddingService:
    async def health_check(self) -> Dict[str, Any]:
        return {"status": "healthy", "model": "nomic-embed-text"}


class MockAIProvider:
    def __init__(self, response_text: str = "This is a mock answer from Ollama.", fail: bool = False, fail_type: str = "general"):
        self.response_text = response_text
        self.fail = fail
        self.fail_type = fail_type
        self.provider_name = "ollama"
        
        class MockClient:
            def __init__(self):
                self.model = "qwen2.5:3b"
        self.client = MockClient()

    async def generate(self, request):
        if self.fail:
            if self.fail_type == "timeout":
                from app.ai.exceptions import AIRequestTimeout
                raise AIRequestTimeout("Ollama request timed out")
            elif self.fail_type == "unavailable":
                from app.ai.exceptions import AIProviderUnavailable
                raise AIProviderUnavailable("Ollama server is unreachable")
            elif self.fail_type == "not_found":
                from app.ai.exceptions import ModelNotFound
                raise ModelNotFound("Model not found")
            else:
                from app.ai.exceptions import AIError
                raise AIError("Ollama failed")
        
        from app.ai.schemas.ai import AIResponse
        return AIResponse(
            text=self.response_text,
            model="qwen2.5:3b",
            provider="ollama",
            usage={"prompt_tokens": 15, "completion_tokens": 25, "total_tokens": 40},
            raw_response={"eval_count": 25, "prompt_eval_count": 15},
            duration_ms=100.0
        )


class MockAIService:
    def __init__(self, provider: MockAIProvider):
        self.provider = provider


class MockKnowledgeBaseService:
    def __init__(self, chunks: List[RetrievedChunk]):
        self.chunks = chunks

    async def search(self, request):
        from app.modules.rag.knowledge.models import KnowledgeSearchResponse
        return KnowledgeSearchResponse(
            query=request.query,
            strategy=request.strategy or "global",
            collections_searched=["resume_kb"],
            chunks=self.chunks,
            latency_ms=15.0
        )


class MockRetrievalService:
    async def retrieve(self, *args, **kwargs):
        pass


@pytest.fixture
def test_config():
    config = RAGConfig()
    config.max_context_tokens = 200
    config.max_retrieved_chunks = 5
    config.max_prompt_size = 500
    config.default_prompt_template = "general"
    config.temperature = 0.3
    config.top_p = 0.9
    config.max_output_tokens = 50
    config.hallucination_guard = True
    config.strict_context_mode = True
    return config


# ---------------------------------------------------------
# Unit Tests: ContextBuilder & Token Estimation
# ---------------------------------------------------------

def test_context_builder_token_estimation(test_config):
    builder = ContextBuilder(config=test_config)
    text = "Hello world! Assessing skill."
    # len(text) is 30. ratio is 0.25 -> 30 * 0.25 = 7
    assert builder.estimate_tokens(text) == 7


def test_context_builder_build_context(test_config):
    builder = ContextBuilder(config=test_config)
    
    # 1. Prepare sample chunks
    chunk_1 = RetrievedChunk(
        chunk_id="c1",
        document_id="doc1",
        similarity_score=0.9,
        content="Candidate has 5 years of Python experience.",
        chunk_index=0,
        embedding_model="nomic-embed-text"
    )
    chunk_2 = RetrievedChunk(
        chunk_id="c2",
        document_id="doc1",
        similarity_score=0.85,
        content="Candidate worked at Google as a backend engineer.",
        chunk_index=1,  # Adjacent chunk
        embedding_model="nomic-embed-text"
    )
    chunk_3 = RetrievedChunk(
        chunk_id="c3",
        document_id="doc2",
        similarity_score=0.8,
        content="Salary requirement is 100k.",
        chunk_index=5,
        embedding_model="nomic-embed-text"
    )
    chunk_dup = RetrievedChunk(
        chunk_id="c1",  # Duplicate chunk
        document_id="doc1",
        similarity_score=0.9,
        content="Candidate has 5 years of Python experience.",
        chunk_index=0,
        embedding_model="nomic-embed-text"
    )

    chunks = [chunk_1, chunk_2, chunk_3, chunk_dup]
    
    # Build context
    res = builder.build_context(chunks)
    
    # Verify deduplication, ordering, grouping & merging
    assert res["retrieved_chunk_count"] == 4
    assert res["retrieved_document_count"] == 2
    assert "doc1" in [doc.document_id for doc in res["context_documents"]]
    assert "doc2" in [doc.document_id for doc in res["context_documents"]]

    # Verify merging: chunk_1 and chunk_2 should be merged because their chunk_indices are 0 and 1 (difference is 1)
    doc1_doc = next(doc for doc in res["context_documents"] if doc.document_id == "doc1")
    assert "Candidate has 5 years of Python experience.\nCandidate worked at Google" in doc1_doc.combined_text


def test_context_builder_token_truncation(test_config):
    test_config.max_context_tokens = 10  # Very small limit (about 40 chars)
    builder = ContextBuilder(config=test_config)
    
    chunk_1 = RetrievedChunk(
        chunk_id="c1",
        document_id="doc1",
        similarity_score=0.9,
        content="This is a very long chunk that will consume many tokens.",
        chunk_index=0,
        embedding_model="nomic-embed-text"
    )
    chunk_2 = RetrievedChunk(
        chunk_id="c2",
        document_id="doc2",
        similarity_score=0.8,
        content="Short chunk.",
        chunk_index=0,
        embedding_model="nomic-embed-text"
    )

    res = builder.build_context([chunk_1, chunk_2])
    # chunk_1 is ~56 chars -> ~14 tokens, which exceeds 10 tokens limit.
    # Therefore, chunk_1 is dropped, chunk_2 is evaluated (12 chars -> 3 tokens), fits, and is kept.
    assert len(res["context_documents"]) == 1
    assert res["context_documents"][0].document_id == "doc2"
    assert res["dropped_chunks_count"] == 1


# ---------------------------------------------------------
# Unit Tests: PromptBuilder & Templates
# ---------------------------------------------------------

def test_prompt_builder_general(test_config):
    builder = PromptBuilder(config=test_config)
    context = "Resume content: Python, AWS, Docker."
    question = "What are the skills?"
    
    res = builder.build_prompt(context_text=context, question=question)
    assert res["template_name"] == "general"
    assert "Resume content: Python" in res["prompt"]
    assert "What are the skills?" in res["prompt"]
    assert "You are Antigravity" in res["system_prompt"]


def test_prompt_builder_with_history_and_template(test_config):
    builder = PromptBuilder(config=test_config)
    context = "Resume content: Python."
    question = "Tell me more."
    history = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there!"}
    ]
    
    res = builder.build_prompt(
        context_text=context,
        question=question,
        template_name="resume_qa",
        history=history
    )
    
    assert res["template_name"] == "resume_qa"
    assert "Conversation Chat History:" in res["prompt"]
    assert "User: Hello" in res["prompt"]
    assert "Assistant: Hi there!" in res["prompt"]
    assert "You are a professional resume reviewer" in res["system_prompt"]


def test_prompt_builder_exceptions(test_config):
    builder = PromptBuilder(config=test_config)
    
    # 1. Invalid template
    with pytest.raises(InvalidTemplateError):
        builder.build_prompt("context", "question", template_name="nonexistent_template")

    # 2. Token size limit exceeded
    test_config.max_prompt_size = 20
    with pytest.raises(TokenLimitExceededError):
        builder.build_prompt("long context long context long context", "question")


# ---------------------------------------------------------
# Unit Tests: RAGGenerator
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_generator_success(test_config):
    provider = MockAIProvider(response_text="The candidate is skilled in FastAPI.")
    ai_service = MockAIService(provider=provider)
    generator = RAGGenerator(ai_service=ai_service, config=test_config)

    res = await generator.generate_response(prompt="Prompt", system_prompt="Sys")
    assert res.text == "The candidate is skilled in FastAPI."
    assert res.usage["total_tokens"] == 40
    assert res.duration_ms == 100.0


@pytest.mark.anyio
async def test_generator_provider_errors(test_config):
    # Test different Ollama client/connection error mappings
    for fail_type in ["timeout", "unavailable", "not_found", "general"]:
        provider = MockAIProvider(fail=True, fail_type=fail_type)
        ai_service = MockAIService(provider=provider)
        generator = RAGGenerator(ai_service=ai_service, config=test_config)

        with pytest.raises(OllamaUnavailableError):
            await generator.generate_response(prompt="Prompt")


# ---------------------------------------------------------
# Unit Tests: HallucinationGuard
# ---------------------------------------------------------

def test_hallucination_guard_validation(test_config):
    validator = RAGResponseValidator(hallucination_guard=True)
    
    # 1. Empty response
    with pytest.raises(ResponseValidationError):
        validator.validate("", "context")

    # 2. Normalize lack of context to fallback
    res = validator.validate("I don't know the answer because it is not mentioned.", "context")
    assert res == "Information not found in the knowledge base."

    # 3. Numeric hallucination: '120k' or '2026' not in context
    with pytest.raises(HallucinationGuardError):
        validator.validate("The candidate graduated in 2026.", "Candidate graduated in 2021.")

    # 4. Success case
    valid_res = validator.validate("Candidate has 5 years of Python.", "Candidate has 5 years of Python.")
    assert valid_res == "Candidate has 5 years of Python."


# ---------------------------------------------------------
# Unit Tests: RAGOrchestrator
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_orchestrator_query_success(test_config):
    chunk_1 = RetrievedChunk(
        chunk_id="c1",
        document_id="doc1",
        similarity_score=0.95,
        content="Candidate worked at Google in 2024.",
        chunk_index=0,
        embedding_model="nomic-embed-text"
    )
    
    kb_service = MockKnowledgeBaseService(chunks=[chunk_1])
    retrieval_service = MockRetrievalService()
    context_builder = ContextBuilder(config=test_config)
    prompt_builder = PromptBuilder(config=test_config)
    
    provider = MockAIProvider(response_text="Candidate worked at Google in 2024.")
    ai_service = MockAIService(provider=provider)
    generator = RAGGenerator(ai_service=ai_service, config=test_config)

    orchestrator = RAGOrchestrator(
        retrieval_service=retrieval_service,
        knowledge_base_service=kb_service,
        context_builder=context_builder,
        prompt_builder=prompt_builder,
        generator=generator,
        config=test_config
    )

    request = RAGRequest(question="Where did the candidate work in 2024?")
    response = await orchestrator.query(request)

    assert isinstance(response, RAGResponse)
    assert response.answer == "Candidate worked at Google in 2024."
    assert response.retrieved_chunk_count == 1
    assert response.retrieved_document_count == 1
    assert response.context_documents[0].document_id == "doc1"
    assert response.token_usage.total_tokens == 40


@pytest.mark.anyio
async def test_orchestrator_strict_context_error(test_config):
    # Empty chunks search result
    kb_service = MockKnowledgeBaseService(chunks=[])
    retrieval_service = MockRetrievalService()
    context_builder = ContextBuilder(config=test_config)
    prompt_builder = PromptBuilder(config=test_config)
    generator = RAGGenerator(ai_service=MockAIService(provider=MockAIProvider()), config=test_config)

    orchestrator = RAGOrchestrator(
        retrieval_service=retrieval_service,
        knowledge_base_service=kb_service,
        context_builder=context_builder,
        prompt_builder=prompt_builder,
        generator=generator,
        config=test_config
    )

    # In strict mode, empty context raises error
    request = RAGRequest(question="Tell me about python.")
    with pytest.raises(EmptyContextError):
        await orchestrator.query(request)


# ---------------------------------------------------------
# Integration / API Router Tests
# ---------------------------------------------------------

def test_api_config_endpoint():
    def mock_get_current_user():
        return mock_user

    app.dependency_overrides[get_current_user] = mock_get_current_user
    
    client = TestClient(app)
    response = client.get("/api/v1/rag/query/config")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "max_context_tokens" in data
    assert "strict_context_mode" in data
    assert "general" in data["available_templates"]
    
    app.dependency_overrides.clear()


def test_api_query_endpoints_mocked():
    def mock_get_current_user():
        return mock_user

    # Mock RAG orchestrator for direct API testing
    chunk_1 = RetrievedChunk(
        chunk_id="c1",
        document_id="doc1",
        similarity_score=0.95,
        content="Python is used for backend developments.",
        chunk_index=0,
        embedding_model="nomic-embed-text"
    )
    
    config = RAGConfig()
    kb_service = MockKnowledgeBaseService(chunks=[chunk_1])
    retrieval_service = MockRetrievalService()
    context_builder = ContextBuilder(config=config)
    prompt_builder = PromptBuilder(config=config)
    generator = RAGGenerator(ai_service=MockAIService(provider=MockAIProvider(response_text="Python is used for backend.")), config=config)

    mock_orchestrator = RAGOrchestrator(
        retrieval_service=retrieval_service,
        knowledge_base_service=kb_service,
        context_builder=context_builder,
        prompt_builder=prompt_builder,
        generator=generator,
        config=config
    )

    def mock_get_rag_orchestrator():
        return mock_orchestrator

    app.dependency_overrides[get_current_user] = mock_get_current_user
    app.dependency_overrides[get_rag_orchestrator] = mock_get_rag_orchestrator

    client = TestClient(app)

    # 1. Test POST /query
    payload = {
        "question": "What is python used for?",
        "prompt_template": "general"
    }
    response = client.post("/api/v1/rag/query", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["answer"] == "Python is used for backend."
    assert data["retrieved_chunk_count"] == 1
    assert data["context_documents"][0]["document_id"] == "doc1"

    # 2. Test POST /query/batch
    batch_payload = {
        "requests": [
            {"question": "What is python?", "prompt_template": "general"},
            {"question": "Tell me details.", "prompt_template": "general"}
        ]
    }
    batch_response = client.post("/api/v1/rag/query/batch", json=batch_payload)
    assert batch_response.status_code == status.HTTP_200_OK
    batch_data = batch_response.json()
    assert len(batch_data["responses"]) == 2
    assert batch_data["responses"][0]["answer"] == "Python is used for backend."

    app.dependency_overrides.clear()
