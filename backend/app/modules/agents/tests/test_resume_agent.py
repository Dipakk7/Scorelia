# app/modules/agents/tests/test_resume_agent.py

import os
import sys
import uuid
import time
import pytest
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.ai_resume_review import AIResumeReview
from app.models.ai_resume_rewrite import AIResumeRewrite
from app.models.ai_resume_optimization import AIResumeOptimization
from app.core.enums import ResumeStatus, StorageProvider

from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.memory import SharedMemory
from app.modules.agents.events import AgentEvent, AgentEventBus
from app.modules.agents.factory import AgentFactory
from app.modules.agents.orchestrator import AgentOrchestrator
from app.modules.agents.models import (
    AgentConfig,
    AgentResponse,
    AgentHealthStatus,
    ExecutionRequest,
)
from app.modules.agents.exceptions import AgentNotFoundError, AgentExecutionError, AgentValidationError
from app.modules.agents.dependencies import (
    get_agent_config,
    get_agent_registry,
    get_agent_orchestrator,
    get_shared_memory,
    get_agent_event_bus,
)
from app.modules.agents.resume.agent import ResumeAgent
from app.modules.agents.resume.service import ResumeAgentService
from app.modules.agents.resume.validator import ResumeAgentValidator
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage

# ---------------------------------------------------------
# Mocks & Test Setup
# ---------------------------------------------------------

mock_user = User(
    id=uuid.uuid4(),
    email="resume-agent-test@example.com",
    is_active=True,
)

# Mocked AI Response Payload
mock_summary_response = {
    "professional_summary": "Extremely experienced backend engineer specializing in FastAPI and AI agents.",
    "years_of_experience": 8.5,
    "key_expertise": ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL"],
    "education_summary": "Master of Computer Science, MIT",
    "recent_job_title": "Senior AI Backend Engineer",
    "industry": "Software Engineering",
    "confidence_score": 0.98
}

mock_review_output = {
    "overall_score": 90,
    "overall_summary": "Great resume.",
    "strengths": ["Clean formatting"],
    "weaknesses": ["None"],
    "recommendations": []
}

mock_optimize_output = {
    "quality_score": {"overall_score": 92},
    "recommendations": [{"section": "experience", "type": "improvement", "reason": "Quantify bullet points"}]
}

mock_rewrite_output = {
    "rewrite_id": str(uuid.uuid4()),
    "rewritten_content": {"summary": "Rewritten summary text"},
    "original_content": {"summary": "Original summary text"},
    "rewrite_metadata": {}
}


@pytest.fixture(scope="module")
def db_session():
    """Yields database session and performs teardown of test users and resumes."""
    db = SessionLocal()
    
    # Pre-test cleanup
    test_user = db.query(User).filter(User.email == mock_user.email).first()
    if test_user:
        # Delete associated records
        db.query(AIResumeReview).filter(AIResumeReview.user_id == test_user.id).delete()
        db.query(AIResumeRewrite).filter(AIResumeRewrite.user_id == test_user.id).delete()
        db.query(AIResumeOptimization).filter(AIResumeOptimization.user_id == test_user.id).delete()
        db.query(Resume).filter(Resume.user_id == test_user.id).delete()
        db.delete(test_user)
        db.commit()

    # Re-insert mock user with exact mock ID
    db_user = User(
        id=mock_user.id,
        email=mock_user.email,
        hashed_password="fakehashedpassword",
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    yield db

    # Post-test cleanup
    db.query(AIResumeReview).filter(AIResumeReview.user_id == mock_user.id).delete()
    db.query(AIResumeRewrite).filter(AIResumeRewrite.user_id == mock_user.id).delete()
    db.query(AIResumeOptimization).filter(AIResumeOptimization.user_id == mock_user.id).delete()
    db.query(Resume).filter(Resume.user_id == mock_user.id).delete()
    db.delete(db_user)
    db.commit()
    db.close()


@pytest.fixture
def test_resume(db_session) -> Resume:
    """Creates a temporary parsed resume in the database for test executions."""
    resume = Resume(
        id=uuid.uuid4(),
        user_id=mock_user.id,
        original_filename="resume_test.pdf",
        stored_filename=f"stored_{uuid.uuid4()}_resume_test.pdf",
        file_path="/fake/path/resume_test.pdf",
        file_size=1024,
        file_type="pdf",
        mime_type="application/pdf",
        status=ResumeStatus.PARSED,
        parsed_data={
            "parser_version": "1.0.0",
            "personal_info": {"name": "Test Candidate"},
            "skills": ["Python", "FastAPI"],
            "experience": []
        },
        storage_provider=StorageProvider.LOCAL
    )
    db_session.add(resume)
    db_session.commit()
    db_session.refresh(resume)
    
    yield resume

    # Cleanup
    db_session.delete(resume)
    db_session.commit()


# ---------------------------------------------------------
# Unit Tests
# ---------------------------------------------------------

def test_resume_agent_instantiation():
    """Verifies that ResumeAgent can be successfully instantiated."""
    agent = ResumeAgent()
    assert agent.agent_id == "resume_agent"
    assert agent.name == "Resume Agent"
    assert "review" in agent.supported_tasks
    assert "rewrite" in agent.supported_tasks
    assert "optimize" in agent.supported_tasks
    assert "summary" in agent.supported_tasks
    assert agent.enabled is True


@pytest.mark.anyio
async def test_resume_agent_validation_logic(db_session, test_resume):
    """Verifies validator checks for existence, ownership, and parsing status."""
    # 1. Test valid resume
    resume = ResumeAgentValidator.validate_resume_exists_and_owned(db_session, test_resume.id, mock_user.id)
    assert resume.id == test_resume.id

    # 2. Test non-existent resume ID
    with pytest.raises(AgentValidationError) as exc:
        ResumeAgentValidator.validate_resume_exists_and_owned(db_session, uuid.uuid4(), mock_user.id)
    assert "not found" in str(exc.value)

    # 3. Test wrong owner
    with pytest.raises(AgentValidationError) as exc:
        ResumeAgentValidator.validate_resume_exists_and_owned(db_session, test_resume.id, uuid.uuid4())
    assert "Access denied" in str(exc.value)

    # 4. Test unparsed resume validation
    unparsed_resume = Resume(
        id=uuid.uuid4(),
        user_id=mock_user.id,
        original_filename="unparsed.pdf",
        stored_filename="unparsed.pdf",
        file_path="/fake/path",
        file_size=100,
        file_type="pdf",
        mime_type="application/pdf",
        status=ResumeStatus.UPLOADED,
        parsed_data=None,
        storage_provider=StorageProvider.LOCAL
    )
    db_session.add(unparsed_resume)
    db_session.commit()

    with pytest.raises(AgentValidationError) as exc:
        ResumeAgentValidator.validate_parsed_data(unparsed_resume)
    assert "must be parsed" in str(exc.value)

    db_session.delete(unparsed_resume)
    db_session.commit()


@pytest.mark.anyio
@patch("app.services.review_service.ResumeReviewService.review_resume")
async def test_resume_agent_execute_review(mock_review_resume, db_session, test_resume):
    """Verifies that ResumeAgent review task execution succeeds and bypasses Ollama call."""
    mock_review_record = MagicMock()
    mock_review_record.review = mock_review_output
    mock_review_resume.return_value = mock_review_record

    agent = ResumeAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="review",
        shared_variables={"resume_id": test_resume.id, "mode": "STANDARD", "language": "en"}
    )
    
    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["overall_score"] == 90
    assert response.output["overall_summary"] == "Great resume."
    mock_review_resume.assert_called_once()


@pytest.mark.anyio
@patch("app.services.rewrite_service.ResumeRewriteService.rewrite_resume")
async def test_resume_agent_execute_rewrite(mock_rewrite_resume, db_session, test_resume):
    """Verifies that ResumeAgent rewrite task execution succeeds."""
    mock_rewrite_record = MagicMock()
    mock_rewrite_record.id = uuid.uuid4()
    mock_rewrite_record.rewritten_content = mock_rewrite_output["rewritten_content"]
    mock_rewrite_record.original_content = mock_rewrite_output["original_content"]
    mock_rewrite_record.rewrite_metadata = mock_rewrite_output["rewrite_metadata"]
    mock_rewrite_resume.return_value = mock_rewrite_record

    agent = ResumeAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="rewrite",
        shared_variables={"resume_id": test_resume.id, "mode": "STANDARD", "section_name": "summary"}
    )

    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["rewritten_content"]["summary"] == "Rewritten summary text"
    mock_rewrite_resume.assert_called_once()


@pytest.mark.anyio
@patch("app.services.optimization_service.ResumeOptimizationService.optimize_resume")
async def test_resume_agent_execute_optimize(mock_optimize_resume, db_session, test_resume):
    """Verifies that ResumeAgent optimization task execution succeeds."""
    mock_opt_record = MagicMock()
    mock_opt_record.optimization_result = mock_optimize_output
    mock_optimize_resume.return_value = mock_opt_record

    agent = ResumeAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="optimize",
        shared_variables={"resume_id": test_resume.id, "mode": "STANDARD"}
    )

    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["quality_score"]["overall_score"] == 92
    mock_optimize_resume.assert_called_once()


@pytest.mark.anyio
@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
async def test_resume_agent_execute_summary(mock_ai_execute, db_session, test_resume):
    """Verifies that ResumeAgent summary task execution succeeds without Ollama."""
    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        latency_ms=10.0,
        prompt_version="1.0.0",
        created_at=datetime.utcnow(),
        raw_response={},
        parsed_response=mock_summary_response,
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    agent = ResumeAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="summary",
        shared_variables={"resume_id": test_resume.id}
    )

    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["professional_summary"] == mock_summary_response["professional_summary"]
    assert response.output["years_of_experience"] == 8.5
    mock_ai_execute.assert_called_once()


@pytest.mark.anyio
async def test_resume_agent_health(db_session):
    """Verifies that health check correctly returns status."""
    ai_service = MagicMock()
    ai_service.provider = MagicMock()
    ai_service.provider.provider_name = "mock"
    ai_service.provider.client = MagicMock()
    agent = ResumeAgent(ai_service=ai_service)
    health_status = await agent.health()
    assert health_status.agent_id == "resume_agent"
    assert health_status.status == "healthy"


# ---------------------------------------------------------
# API Router Tests
# ---------------------------------------------------------

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_api_overrides():
    """Sets up FastAPI dependency overrides for current authenticated user and registry."""
    config = AgentConfig()
    registry = AgentRegistry()
    
    # Instantiate ResumeAgent with mocks to avoid calling real services or Ollama
    ai_service = MagicMock()
    ai_service.provider = MagicMock()
    ai_service.provider.provider_name = "mock"
    ai_service.provider.client = MagicMock()
    ai_service.registry = MagicMock()
    
    resume_agent = ResumeAgent(ai_service=ai_service)
    registry.register(resume_agent)
    
    memory = SharedMemory()
    event_bus = AgentEventBus()
    orchestrator = AgentOrchestrator(
        registry=registry,
        memory=memory,
        event_bus=event_bus,
        config=config
    )
    
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_agent_registry] = lambda: registry
    app.dependency_overrides[get_agent_orchestrator] = lambda: orchestrator
    
    yield
    
    # Safely clear only our overrides to preserve other tests' setups
    for dep in [get_current_user, get_agent_registry, get_agent_orchestrator]:
        if dep in app.dependency_overrides:
            del app.dependency_overrides[dep]


def test_api_resume_status_endpoint():
    """Tests GET /api/v1/agents/resume/status."""
    response = client.get("/api/v1/agents/resume/status")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["agent_id"] == "resume_agent"
    assert data["status"] == "healthy"


@patch("app.services.review_service.ResumeReviewService.review_resume")
def test_api_resume_review_endpoint(mock_review_resume, test_resume):
    """Tests POST /api/v1/agents/resume/review."""
    mock_review_record = MagicMock()
    mock_review_record.review = mock_review_output
    mock_review_resume.return_value = mock_review_record

    payload = {
        "resume_id": str(test_resume.id),
        "mode": "STANDARD",
        "language": "en"
    }
    response = client.post("/api/v1/agents/resume/review", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["overall_score"] == 90
    assert data["overall_summary"] == "Great resume."


@patch("app.services.rewrite_service.ResumeRewriteService.rewrite_resume")
def test_api_resume_rewrite_endpoint(mock_rewrite_resume, test_resume):
    """Tests POST /api/v1/agents/resume/rewrite."""
    mock_rewrite_record = MagicMock()
    mock_rewrite_record.id = uuid.uuid4()
    mock_rewrite_record.rewritten_content = mock_rewrite_output["rewritten_content"]
    mock_rewrite_record.original_content = mock_rewrite_output["original_content"]
    mock_rewrite_record.rewrite_metadata = mock_rewrite_output["rewrite_metadata"]
    mock_rewrite_resume.return_value = mock_rewrite_record

    payload = {
        "resume_id": str(test_resume.id),
        "mode": "STANDARD",
        "section_name": "summary"
    }
    response = client.post("/api/v1/agents/resume/rewrite", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["rewritten_content"]["summary"] == "Rewritten summary text"


@patch("app.services.optimization_service.ResumeOptimizationService.optimize_resume")
def test_api_resume_optimize_endpoint(mock_optimize_resume, test_resume):
    """Tests POST /api/v1/agents/resume/optimize."""
    mock_opt_record = MagicMock()
    mock_opt_record.optimization_result = mock_optimize_output
    mock_optimize_resume.return_value = mock_opt_record

    payload = {
        "resume_id": str(test_resume.id),
        "mode": "STANDARD"
    }
    response = client.post("/api/v1/agents/resume/optimize", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["quality_score"]["overall_score"] == 92


@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
def test_api_resume_summary_endpoint(mock_ai_execute, test_resume):
    """Tests POST /api/v1/agents/resume/summary."""
    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        latency_ms=10.0,
        prompt_version="1.0.0",
        created_at=datetime.utcnow(),
        raw_response={},
        parsed_response=mock_summary_response,
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    payload = {
        "resume_id": str(test_resume.id)
    }
    response = client.post("/api/v1/agents/resume/summary", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["professional_summary"] == mock_summary_response["professional_summary"]
    assert data["years_of_experience"] == 8.5
