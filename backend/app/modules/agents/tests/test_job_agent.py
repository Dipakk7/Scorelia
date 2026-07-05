# app/modules/agents/tests/test_job_agent.py

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
from app.modules.agents.job.agent import JobMatchAgent
from app.modules.agents.job.service import JobMatchAgentService
from app.modules.agents.job.validator import JobMatchAgentValidator
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage

mock_user = User(
    id=uuid.uuid4(),
    email="job-agent-test@example.com",
    is_active=True,
)

mock_ai_analysis = {
    "match_summary": "Excellent fit for this role.",
    "education_match_explanation": "Education meets all requirements.",
    "experience_match_explanation": "Candidate has enough years of experience.",
    "skills_match_explanation": "All critical skills are matched.",
    "certification_match_explanation": "Certifications are a strong fit."
}

mock_ai_recs = {
    "recommendations": [
        {
            "category": "skills",
            "priority": "HIGH",
            "actionable_item": "Add Python to experience details.",
            "rationale": "Python is a core requirement.",
            "reference_source": "General Recruiter Advice"
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
        original_filename="job_test.pdf",
        stored_filename=f"stored_{uuid.uuid4()}_job_test.pdf",
        file_path="/fake/path/job_test.pdf",
        file_size=1024,
        file_type="pdf",
        mime_type="application/pdf",
        status=ResumeStatus.PARSED,
        parsed_data={
            "parser_version": "1.0.0",
            "data": {
                "personal_info": {"value": {"name": "Job Candidate"}},
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

def test_job_match_agent_instantiation():
    """Verifies that JobMatchAgent can be successfully instantiated."""
    agent = JobMatchAgent()
    assert agent.agent_id == "job_match_agent"
    assert agent.name == "Job Match Agent"
    assert "job_match" in agent.supported_tasks
    assert "job_analyze" in agent.supported_tasks
    assert "job_recommend" in agent.supported_tasks
    assert agent.enabled is True


@pytest.mark.anyio
async def test_job_match_agent_validation_logic(db_session, test_resume):
    """Verifies validator checks for existence, ownership, parsed status, and JD."""
    resume = JobMatchAgentValidator.validate_resume_exists_and_owned(db_session, test_resume.id, mock_user.id)
    assert resume.id == test_resume.id

    with pytest.raises(AgentValidationError):
        JobMatchAgentValidator.validate_job_description("")

    with pytest.raises(AgentValidationError):
        JobMatchAgentValidator.validate_job_description(None)


@pytest.mark.anyio
@patch("app.modules.agents.job.service.calculate_job_match")
async def test_job_agent_execute_match(mock_calc_match, db_session, test_resume):
    """Verifies job match execution."""
    mock_match_res = MagicMock()
    mock_match_res.resume_id = test_resume.id
    mock_match_res.match_score = 90
    mock_match_res.grade = "Excellent"
    mock_match_res.breakdown = {"skills": 25}
    mock_match_res.matched_skills = ["Python"]
    mock_match_res.missing_skills = []
    mock_match_res.extra_skills = []
    mock_match_res.recommendations = []
    mock_match_res.parser_version = "1.0.0"
    mock_match_res.ats_version = "1.0.0"
    mock_match_res.job_match_version = "1.0.0"
    mock_match_res.generated_at = "2026-07-05T09:51:59"

    mock_calc_match.return_value = mock_match_res

    agent = JobMatchAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="job_match",
        shared_variables={"resume_id": test_resume.id, "job_description": "Python Developer Role"}
    )

    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["match_score"] == 90
    mock_calc_match.assert_called_once()


@pytest.mark.anyio
@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
@patch("app.modules.agents.job.service.analyze_resume_gap")
async def test_job_agent_execute_analyze(mock_calc_gap, mock_ai_execute, db_session, test_resume):
    """Verifies job gap analysis execution."""
    mock_gap_res = MagicMock()
    mock_gap_res.overall_match = True
    mock_gap_res.skill_gap = {}
    mock_gap_res.experience_gap = {}
    mock_gap_res.education_gap = {}
    mock_gap_res.certification_gap = {}
    mock_gap_res.keyword_gap = {}
    mock_gap_res.priority_improvements = []
    mock_calc_gap.return_value = mock_gap_res

    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        prompt_version="1.0.0",
        raw_response={},
        parsed_response=mock_ai_analysis,
        latency_ms=10.0,
        created_at=datetime.utcnow(),
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    agent = JobMatchAgent()
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="job_analyze",
        shared_variables={"resume_id": test_resume.id, "job_description": "FastAPI developer position."}
    )

    response = await agent.execute(context)
    assert response.status == "success"
    assert "gap_analysis" in response.output
    assert response.output["ai_analysis"]["match_summary"] == "Excellent fit for this role."
    mock_calc_gap.assert_called_once()


@pytest.mark.anyio
@patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
@patch("app.modules.rag.generation.orchestrator.RAGOrchestrator.query", new_callable=AsyncMock)
async def test_job_agent_execute_recommend(mock_rag_query, mock_ai_execute, db_session, test_resume):
    """Verifies RAG-integrated job recommendation execution."""
    # Mock RAG query
    mock_rag_res = MagicMock()
    mock_rag_res.answer = "Reference jobs context."
    mock_rag_query.return_value = mock_rag_res

    mock_response = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        prompt_version="1.0.0",
        raw_response={},
        parsed_response=mock_ai_recs,
        latency_ms=10.0,
        created_at=datetime.utcnow(),
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )
    mock_ai_execute.return_value = mock_response

    agent = JobMatchAgent(rag_orchestrator=MagicMock())
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="job_recommend",
        shared_variables={"resume_id": test_resume.id}
    )

    response = await agent.execute(context)
    assert response.status == "success"
    assert len(response.output["recommendations"]) == 1
    assert response.output["recommendations"][0]["category"] == "skills"


# ---------------------------------------------------------
# API Tests
# ---------------------------------------------------------

def test_api_job_agent_status():
    """Verifies GET /api/v1/agents/job/status API."""
    client = TestClient(app)
    app.dependency_overrides[get_current_user] = lambda: mock_user

    response = client.get("/api/v1/agents/job/status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["agent_id"] == "job_match_agent"

    app.dependency_overrides.clear()


@patch("app.modules.agents.job.service.calculate_job_match")
def test_api_job_match_endpoint(mock_calc_match, test_resume):
    """Verifies POST /api/v1/agents/job/match API."""
    mock_match_res = MagicMock()
    mock_match_res.resume_id = test_resume.id
    mock_match_res.match_score = 95
    mock_match_res.grade = "Excellent"
    mock_match_res.breakdown = {"skills": 25}
    mock_match_res.matched_skills = ["Python"]
    mock_match_res.missing_skills = []
    mock_match_res.extra_skills = []
    mock_match_res.recommendations = []
    mock_match_res.parser_version = "1.0.0"
    mock_match_res.ats_version = "1.0.0"
    mock_match_res.job_match_version = "1.0.0"
    mock_match_res.generated_at = "2026-07-05T09:51:59"

    mock_calc_match.return_value = mock_match_res

    client = TestClient(app)
    app.dependency_overrides[get_current_user] = lambda: mock_user

    payload = {"resume_id": str(test_resume.id), "job_description": "We need a Python developer."}
    response = client.post("/api/v1/agents/job/match", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["match_score"] == 95

    app.dependency_overrides.clear()
