# app/modules/agents/tests/test_ats_agent.py

import os
import sys
import uuid
import pytest
from datetime import datetime
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider

from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.exceptions import AgentValidationError
from app.modules.agents.dependencies import get_agent_registry
from app.modules.agents.ats.agent import ATSAgent
from app.modules.agents.ats.service import ATSAgentService
from app.modules.agents.ats.validator import ATSAgentValidator
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage

mock_user = User(
    id=uuid.uuid4(),
    email="ats-agent-test@example.com",
    is_active=True,
)

mock_review_output = {
    "overall_review": "Strong resume with clear experience.",
    "ats_readiness": "High",
    "keyword_analysis": ["python", "fastapi", "postgresql"],
    "missing_skills": ["docker", "kubernetes"],
    "recommendations": ["Add docker to your experience section."]
}

mock_improve_output = {
    "improvement_suggestions": [
        {
            "section": "experience",
            "suggestion": "Add metrics to quantify your impact.",
            "priority": "HIGH"
        }
    ]
}


@pytest.fixture(scope="module")
def db_session():
    """Yields database session and performs teardown of test users and resumes."""
    db = SessionLocal()
    
    # Pre-test cleanup
    test_user = db.query(User).filter(User.email == mock_user.email).first()
    if test_user:
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
        original_filename="ats_test.pdf",
        stored_filename=f"stored_{uuid.uuid4()}_ats_test.pdf",
        file_path="/fake/path/ats_test.pdf",
        file_size=1024,
        file_type="pdf",
        mime_type="application/pdf",
        status=ResumeStatus.PARSED,
        parsed_data={
            "parser_version": "1.0.0",
            "data": {
                "personal_info": {"value": {"name": "ATS Candidate"}},
                "skills": {"value": ["Python", "FastAPI"]},
                "experience": {"value": []},
                "education": {"value": []},
                "certifications": {"value": []}
            }
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

def test_ats_agent_instantiation():
    """Verifies that ATSAgent can be successfully instantiated."""
    agent = ATSAgent()
    assert agent.agent_id == "ats_agent"
    assert agent.name == "ATS Agent"
    assert "ats_review" in agent.supported_tasks
    assert "ats_score" in agent.supported_tasks
    assert "ats_improve" in agent.supported_tasks
    assert agent.enabled is True


@pytest.mark.anyio
async def test_ats_agent_validation_logic(db_session, test_resume):
    """Verifies validator checks for existence, ownership, and parsing status."""
    resume = ATSAgentValidator.validate_resume_exists_and_owned(db_session, test_resume.id, mock_user.id)
    assert resume.id == test_resume.id

    with pytest.raises(AgentValidationError) as exc:
        ATSAgentValidator.validate_resume_exists_and_owned(db_session, uuid.uuid4(), mock_user.id)
    assert "not found" in str(exc.value)

    with pytest.raises(AgentValidationError) as exc:
        ATSAgentValidator.validate_resume_exists_and_owned(db_session, test_resume.id, uuid.uuid4())
    assert "Access denied" in str(exc.value)


@pytest.mark.anyio
@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
async def test_ats_agent_execute_review(mock_ai_execute, db_session, test_resume):
    """Verifies that ATSAgent review task execution succeeds without Ollama."""
    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        prompt_version="1.0.0",
        raw_response={},
        parsed_response=mock_review_output,
        latency_ms=10.0,
        created_at=datetime.utcnow(),
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    agent = ATSAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="ats_review",
        shared_variables={"resume_id": test_resume.id}
    )
    
    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["ats_readiness"] == "High"
    assert response.output["overall_review"] == "Strong resume with clear experience."
    mock_ai_execute.assert_called_once()


@pytest.mark.anyio
@patch("app.modules.agents.ats.service.calculate_ats_score")
async def test_ats_agent_execute_score(mock_calculate_score, db_session, test_resume):
    """Verifies that ATSAgent score task execution succeeds."""
    mock_score_res = MagicMock()
    mock_score_res.resume_id = test_resume.id
    mock_score_res.overall_score = 85
    mock_score_res.grade = "Excellent"
    mock_score_res.grade_summary = "Excellent score."
    mock_score_res.breakdown = {"skills": 20}
    mock_score_res.strengths = []
    mock_score_res.weaknesses = []
    mock_score_res.recommendations = []
    mock_score_res.parser_version = "1.0.0"
    mock_score_res.ats_version = "1.0.0"
    mock_score_res.scored_at = "2026-07-05T09:51:59"
    
    mock_calculate_score.return_value = mock_score_res

    agent = ATSAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="ats_score",
        shared_variables={"resume_id": test_resume.id}
    )

    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["overall_score"] == 85
    mock_calculate_score.assert_called_once()


@pytest.mark.anyio
@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
async def test_ats_agent_execute_subtask_keyword(mock_ai_execute, db_session, test_resume):
    """Verifies that ATSAgent can extract keyword analysis subtask content."""
    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        prompt_version="1.0.0",
        raw_response={},
        parsed_response=mock_review_output,
        latency_ms=10.0,
        created_at=datetime.utcnow(),
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    agent = ATSAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="ats_keyword_analysis",
        shared_variables={"resume_id": test_resume.id}
    )
    
    response = await agent.execute(context)
    assert response.status == "success"
    assert "keyword_analysis" in response.output
    assert "python" in response.output["keyword_analysis"]


# ---------------------------------------------------------
# API Tests
# ---------------------------------------------------------

def test_api_ats_agent_status():
    """Verifies the GET status endpoint for ATS Agent."""
    client = TestClient(app)
    # Override authentication
    app.dependency_overrides[get_current_user] = lambda: mock_user

    response = client.get("/api/v1/agents/ats/status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["agent_id"] == "ats_agent"
    
    app.dependency_overrides.clear()


@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
def test_api_ats_review_endpoint(mock_ai_execute, test_resume):
    """Verifies POST /api/v1/agents/ats/review api endpoint."""
    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        prompt_version="1.0.0",
        raw_response={},
        parsed_response=mock_review_output,
        latency_ms=10.0,
        created_at=datetime.utcnow(),
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    client = TestClient(app)
    app.dependency_overrides[get_current_user] = lambda: mock_user

    payload = {"resume_id": str(test_resume.id), "job_description": "We need a Python developer."}
    response = client.post("/api/v1/agents/ats/review", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["ats_readiness"] == "High"

    app.dependency_overrides.clear()
