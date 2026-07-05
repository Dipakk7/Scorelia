# app/modules/agents/tests/test_cover_letter_agent.py

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
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.models.ai_cover_letter_optimization import AICoverLetterOptimization
from app.core.enums import ResumeStatus, StorageProvider

from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.memory import SharedMemory
from app.modules.agents.events import AgentEventBus
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
)
from app.modules.agents.cover_letter.agent import CoverLetterAgent
from app.modules.agents.cover_letter.service import CoverLetterAgentService
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage

# ---------------------------------------------------------
# Mocks & Test Setup
# ---------------------------------------------------------

mock_user = User(
    id=uuid.uuid4(),
    email="cl-agent-test@example.com",
    is_active=True,
)

mock_review_output = {
    "overall_score": 88,
    "strengths": ["Excellent greeting", "Structured layout"],
    "weaknesses": ["A bit long"],
    "recommendations": ["Make it shorter"]
}

mock_rewrite_output = {
    "rewritten_content": "Dear Hiring Manager, this is a rewritten cover letter."
}


@pytest.fixture(scope="module")
def db_session():
    """Yields database session and performs teardown of test users and cover letters."""
    db = SessionLocal()
    
    # Pre-test cleanup
    test_user = db.query(User).filter(User.email == mock_user.email).first()
    if test_user:
        # Delete associated records
        db.query(AICoverLetterOptimization).filter(AICoverLetterOptimization.user_id == test_user.id).delete()
        db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
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


@pytest.fixture(scope="module")
def test_resume(db_session):
    """Creates a mock parsed resume in the DB for the test user."""
    resume = Resume(
        user_id=mock_user.id,
        original_filename="resume.pdf",
        stored_filename=str(uuid.uuid4()) + ".pdf",
        file_path="storage/resumes/resume.pdf",
        storage_provider=StorageProvider.LOCAL,
        file_size=1024,
        file_type="pdf",
        mime_type="application/pdf",
        status=ResumeStatus.PARSED,
        parsed_data={
            "personal_info": {"name": "Test User"},
            "skills": ["Python", "FastAPI"],
            "experience": [{"role": "Developer", "company": "Acme", "duration": "1 year"}],
            "education": [],
            "projects": [],
            "parser_version": "1.0.0"
        }
    )
    db_session.add(resume)
    db_session.commit()
    db_session.refresh(resume)
    
    yield resume


@pytest.fixture(scope="module")
def test_cover_letter(db_session, test_resume):
    """Creates a mock cover letter in the DB."""
    cl = AICoverLetter(
        user_id=mock_user.id,
        resume_id=test_resume.id,
        company_name="Google",
        job_title="Software Engineer",
        job_description="FastAPI developer",
        writing_style="PROFESSIONAL",
        generation_mode="STANDARD",
        generated_content="Dear Google, please hire me. I like Python.",
        provider="mock",
        model="mock-model",
        cover_letter_metadata={}
    )
    db_session.add(cl)
    db_session.commit()
    db_session.refresh(cl)
    
    yield cl


client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_api_dependency_overrides():
    """Overrides dependencies to inject our mock registry and orchestrator."""
    config = AgentConfig()
    registry = AgentRegistry()
    
    # Instantiate CoverLetterAgent with mocks to avoid calling real services or Ollama
    ai_service = MagicMock()
    ai_service.provider = MagicMock()
    ai_service.provider.provider_name = "mock"
    ai_service.provider.client = MagicMock()
    ai_service.registry = MagicMock()
    
    cl_agent = CoverLetterAgent(ai_service=ai_service)
    registry.register(cl_agent)
    
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


# ---------------------------------------------------------
# Agent Tasks Unit Tests
# ---------------------------------------------------------

@pytest.mark.anyio
@patch("app.cover_letter.services.service.CoverLetterService.generate_cover_letter")
async def test_agent_generate_task(mock_generate, db_session, test_resume):
    mock_cl = MagicMock()
    mock_cl.id = uuid.uuid4()
    mock_cl.generated_content = "Generated content"
    mock_cl.company_name = "Google"
    mock_cl.job_title = "SWE"
    mock_cl.writing_style = "PROFESSIONAL"
    mock_cl.generation_mode = "STANDARD"
    mock_cl.cover_letter_metadata = {}
    mock_generate.return_value = mock_cl

    ai_service = MagicMock()
    agent = CoverLetterAgent(ai_service=ai_service)
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="generate",
        shared_variables={
            "resume_id": test_resume.id,
            "company_name": "Google",
            "job_title": "SWE"
        }
    )
    
    valid = await agent.validate(context)
    assert valid is True
    
    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["company_name"] == "Google"
    assert response.output["generated_content"] == "Generated content"


# ---------------------------------------------------------
# API Router Tests
# ---------------------------------------------------------

def test_api_cover_letter_status_endpoint():
    """Tests GET /api/v1/agents/cover-letter/status."""
    response = client.get("/api/v1/agents/cover-letter/status")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["agent_id"] == "cover_letter_agent"
    assert data["status"] == "healthy"


@patch("app.cover_letter.services.service.CoverLetterService.generate_cover_letter")
def test_api_cover_letter_generate_endpoint(mock_generate, test_resume):
    """Tests POST /api/v1/agents/cover-letter/generate."""
    mock_cl = MagicMock()
    mock_cl.id = uuid.uuid4()
    mock_cl.generated_content = "Generated cover letter text"
    mock_cl.company_name = "Microsoft"
    mock_cl.job_title = "Developer"
    mock_cl.writing_style = "PROFESSIONAL"
    mock_cl.generation_mode = "STANDARD"
    mock_cl.cover_letter_metadata = {}
    mock_generate.return_value = mock_cl

    payload = {
        "resume_id": str(test_resume.id),
        "company_name": "Microsoft",
        "job_title": "Developer"
    }
    response = client.post("/api/v1/agents/cover-letter/generate", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["company_name"] == "Microsoft"
    assert data["generated_content"] == "Generated cover letter text"


@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
def test_api_cover_letter_review_endpoint(mock_ai_execute, test_cover_letter):
    """Tests POST /api/v1/agents/cover-letter/review."""
    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        latency_ms=10.0,
        prompt_version="1.0.0",
        created_at=datetime.utcnow(),
        raw_response={},
        parsed_response=mock_review_output,
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    payload = {
        "cover_letter_id": str(test_cover_letter.id)
    }
    response = client.post("/api/v1/agents/cover-letter/review", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["overall_score"] == 88
    assert "strengths" in data


@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
def test_api_cover_letter_rewrite_endpoint(mock_ai_execute, test_cover_letter):
    """Tests POST /api/v1/agents/cover-letter/rewrite."""
    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        latency_ms=10.0,
        prompt_version="1.0.0",
        created_at=datetime.utcnow(),
        raw_response={},
        parsed_response=mock_rewrite_output,
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    payload = {
        "cover_letter_id": str(test_cover_letter.id),
        "instructions": "Make it sound more enthusiastic"
    }
    response = client.post("/api/v1/agents/cover-letter/rewrite", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["rewritten_content"] == mock_rewrite_output["rewritten_content"]
