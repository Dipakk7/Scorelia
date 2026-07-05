# app/modules/agents/tests/test_interview_agent.py

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
from app.interview.models.interview import InterviewSession, InterviewTurn
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
)
from app.modules.agents.exceptions import AgentNotFoundError, AgentExecutionError, AgentValidationError
from app.modules.agents.dependencies import (
    get_agent_config,
    get_agent_registry,
    get_agent_orchestrator,
)
from app.modules.agents.interview.agent import InterviewAgent
from app.modules.agents.interview.service import InterviewAgentService
from app.interview.services.ai_service import AnswerEvaluationResponse

# ---------------------------------------------------------
# Mocks & Test Setup
# ---------------------------------------------------------

mock_user = User(
    id=uuid.uuid4(),
    email="int-agent-test@example.com",
    is_active=True,
)

mock_evaluation_output = AnswerEvaluationResponse(
    overall_score=85,
    technical_score=80,
    communication_score=85,
    grammar_score=90,
    confidence_score=85,
    professionalism_score=90,
    star_score=80,
    strengths=["Clear logic"],
    weaknesses=["A bit fast"],
    missing_topics=[],
    improvements=["Speak slower"],
    followup_questions=["Explain X further"],
    summary="Good response."
)


@pytest.fixture(scope="module")
def db_session():
    """Yields database session and performs teardown of test users and interview sessions."""
    db = SessionLocal()
    
    # Pre-test cleanup
    test_user = db.query(User).filter(User.email == mock_user.email).first()
    if test_user:
        # Delete associated records
        db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
            db.query(InterviewSession.id).filter(InterviewSession.user_id == test_user.id)
        )).delete(synchronize_session=False)
        db.query(InterviewSession).filter(InterviewSession.user_id == test_user.id).delete()
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
def test_interview_session(db_session, test_resume):
    """Creates a mock interview session in the DB."""
    session = InterviewSession(
        user_id=mock_user.id,
        resume_id=test_resume.id,
        company_name="Google",
        target_role="Software Engineer",
        interview_type="BEHAVIORAL",
        difficulty="MEDIUM",
        status="READY",
        total_questions=5,
        current_question=1,
        provider="mock",
        model="mock-model",
        prompt_version="1.0.0",
        session_metadata={}
    )
    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)
    
    yield session


client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_api_dependency_overrides():
    """Overrides dependencies to inject our mock registry and orchestrator."""
    config = AgentConfig()
    registry = AgentRegistry()
    
    # Instantiate InterviewAgent with mocks to avoid calling real services or Ollama
    ai_service = MagicMock()
    ai_service.provider = MagicMock()
    ai_service.provider.provider_name = "mock"
    ai_service.provider.client = MagicMock()
    ai_service.registry = MagicMock()
    
    int_agent = InterviewAgent(ai_service=ai_service)
    registry.register(int_agent)
    
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
@patch("app.interview.services.manager.InterviewSessionManager.submit_answer")
async def test_agent_evaluate_task(mock_submit, db_session, test_interview_session):
    mock_submit.return_value = mock_evaluation_output

    ai_service = MagicMock()
    agent = InterviewAgent(ai_service=ai_service)
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(test_interview_session.id),
        request_id=str(uuid.uuid4()),
        current_task="evaluate",
        shared_variables={
            "session_id": test_interview_session.id,
            "answer": "My response answer text"
        }
    )
    
    valid = await agent.validate(context)
    assert valid is True
    
    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["overall_score"] == 85
    assert response.output["summary"] == "Good response."


# ---------------------------------------------------------
# API Router Tests
# ---------------------------------------------------------

def test_api_interview_status_endpoint():
    """Tests GET /api/v1/agents/interview/status."""
    response = client.get("/api/v1/agents/interview/status")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["agent_id"] == "interview_agent"
    assert data["status"] == "healthy"


@patch("app.interview.services.manager.InterviewSessionManager.submit_answer")
def test_api_interview_evaluate_endpoint(mock_submit, test_interview_session):
    """Tests POST /api/v1/agents/interview/evaluate."""
    mock_submit.return_value = mock_evaluation_output

    payload = {
        "session_id": str(test_interview_session.id),
        "answer": "This is my answer turn response"
    }
    response = client.post("/api/v1/agents/interview/evaluate", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["overall_score"] == 85
    assert data["summary"] == "Good response."


@patch("app.interview.services.service.InterviewService.generate_session_questions")
def test_api_interview_questions_endpoint(mock_gen, test_interview_session):
    """Tests POST /api/v1/agents/interview/questions."""
    mock_turn = MagicMock()
    mock_turn.id = uuid.uuid4()
    mock_turn.session_id = test_interview_session.id
    mock_turn.question_number = 1
    mock_turn.question_category = "TECHNICAL"
    mock_turn.question_text = "What is FastAPI?"
    mock_turn.answer_text = None
    mock_turn.feedback = None
    mock_turn.score = None
    mock_gen.return_value = [mock_turn]

    payload = {
        "session_id": str(test_interview_session.id),
        "count": 1
    }
    response = client.post("/api/v1/agents/interview/questions", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "questions" in data
    assert len(data["questions"]) == 1
    assert data["questions"][0]["question_text"] == "What is FastAPI?"


@patch("app.interview.services.manager.InterviewSessionManager.start_interview")
@patch("app.interview.services.service.InterviewService.create_session")
def test_api_interview_mock_endpoint(mock_create, mock_start, test_resume):
    """Tests POST /api/v1/agents/interview/mock."""
    mock_session = MagicMock()
    mock_session.id = uuid.uuid4()
    mock_session.user_id = mock_user.id
    mock_session.resume_id = test_resume.id
    mock_session.job_id = None
    mock_session.company_name = "Amazon"
    mock_session.target_role = "Developer"
    mock_session.interview_type = "TECHNICAL"
    mock_session.difficulty = "MEDIUM"
    mock_session.status = "WAITING_FOR_ANSWER"
    mock_session.total_questions = 5
    mock_session.current_question = 1
    mock_session.provider = "mock"
    mock_session.model = "mock-model"
    mock_session.prompt_version = "1.0.0"
    mock_session.session_metadata = {}
    mock_session.turns = []

    mock_create.return_value = mock_session
    mock_start.return_value = mock_session

    payload = {
        "resume_id": str(test_resume.id),
        "company_name": "Amazon",
        "target_role": "Developer",
        "interview_type": "TECHNICAL",
        "difficulty": "MEDIUM",
        "total_questions": 5
    }
    response = client.post("/api/v1/agents/interview/mock", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["session_id"] == str(mock_session.id)
    assert data["company_name"] == "Amazon"
    assert data["interview_type"] == "TECHNICAL"


@patch("app.interview.services.analytics.InterviewAnalyticsService.get_history_analytics")
def test_api_interview_readiness_endpoint(mock_history):
    """Tests POST /api/v1/agents/interview/readiness."""
    mock_history.return_value = {
        "average_overall_score": 75.0,
        "skill_gap_analysis": {
            "strong_skills": ["Python", "Docker"],
            "weak_skills": ["CSS"],
        },
        "recommendations": {
            "learning_recommendations": ["Study algorithms"],
        }
    }

    payload = {}
    response = client.post("/api/v1/agents/interview/readiness", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["readiness_score"] == 75.0
    assert data["readiness_level"] == "GOOD"
