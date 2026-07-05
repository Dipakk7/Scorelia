# app/modules/agents/tests/test_career_coach_agent.py

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
from app.career_roadmap.models.roadmap import CareerRoadmap, RoadmapMilestone, LearningRecommendation
from app.modules.agents.context import AgentContext
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.models import AgentHealthStatus, AgentResponse
from app.modules.agents.dependencies import get_agent_registry
from app.modules.agents.career_coach.agent import CareerCoachAgent
from app.modules.agents.career_coach.service import CareerCoachAgentService
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage
from app.core.enums import ResumeStatus, StorageProvider

mock_user = User(
    id=uuid.uuid4(),
    email="career-coach-test@example.com",
    is_active=True,
)

@pytest.fixture(scope="module")
def db_session():
    """Yields database session and performs cleanup."""
    db = SessionLocal()
    
    # Cleanup
    test_user = db.query(User).filter(User.email == mock_user.email).first()
    if test_user:
        db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id.in_(
            db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == test_user.id)
        )).delete(synchronize_session=False)
        db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id.in_(
            db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == test_user.id)
        )).delete(synchronize_session=False)
        db.query(CareerRoadmap).filter(CareerRoadmap.user_id == test_user.id).delete()
        db.query(Resume).filter(Resume.user_id == test_user.id).delete()
        db.delete(test_user)
        db.commit()
        
    db.add(mock_user)
    db.commit()
    db.refresh(mock_user)
    
    yield db
    
    db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id.in_(
        db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == mock_user.id)
    )).delete(synchronize_session=False)
    db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id.in_(
        db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == mock_user.id)
    )).delete(synchronize_session=False)
    db.query(CareerRoadmap).filter(CareerRoadmap.user_id == mock_user.id).delete()
    db.query(Resume).filter(Resume.user_id == mock_user.id).delete()
    db.delete(mock_user)
    db.commit()
    db.close()

@pytest.fixture(scope="module")
def mock_resume(db_session):
    """Creates a mock resume for ownership validation."""
    resume = Resume(
        id=uuid.uuid4(),
        user_id=mock_user.id,
        original_filename="test_coach_resume.pdf",
        stored_filename=f"stored_{uuid.uuid4()}_test_coach_resume.pdf",
        file_path="storage/test_coach_resume.pdf",
        file_size=1024,
        file_type="pdf",
        mime_type="application/pdf",
        status=ResumeStatus.PARSED,
        parsed_data={"data": {"skills": {"value": ["Python", "FastAPI"]}}},
        storage_provider=StorageProvider.LOCAL
    )
    db_session.add(resume)
    db_session.commit()
    db_session.refresh(resume)
    return resume

@pytest.fixture(scope="module")
def client():
    """FastAPI TestClient overrides get_current_user to return mock_user."""
    app.dependency_overrides[get_current_user] = lambda: mock_user
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_career_coach_agent_instantiation():
    """Ensures CareerCoachAgent registers with correct details and defaults."""
    agent = CareerCoachAgent()
    assert agent.agent_id == "career_coach_agent"
    assert "roadmap" in agent.supported_tasks
    assert "analyze" in agent.supported_tasks
    assert "progress" in agent.supported_tasks

@pytest.mark.anyio
async def test_career_coach_agent_validation_logic():
    """Validates parameters checking behavior of CareerCoachAgent."""
    agent = CareerCoachAgent()
    
    # Valid roadmap task
    ctx1 = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="roadmap",
        shared_variables={"target_role": "AI Engineer", "experience_level": "ENTRY"}
    )
    assert await agent.validate(ctx1) is True

    # Missing experience level
    ctx2 = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="roadmap",
        shared_variables={"target_role": "AI Engineer"}
    )
    assert await agent.validate(ctx2) is False

    # Unsupported task
    ctx3 = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="invalid_task",
        shared_variables={}
    )
    assert await agent.validate(ctx3) is False

@pytest.mark.anyio
async def test_career_coach_agent_health():
    """Tests diagnostics / health reporting of the Career Coach Agent."""
    ai_service_mock = MagicMock()
    ai_service_mock.provider = MagicMock()
    ai_service_mock.provider.provider_name = "mock_provider"
    
    agent = CareerCoachAgent(ai_service=ai_service_mock)
    report = await agent.health()
    assert report.status == "healthy"
    assert "mock_provider" in report.details.get("provider", "")

def test_api_career_coach_agent_status(client):
    """Verifies retrieval of Career Coach Agent health status via GET endpoint."""
    response = client.get("/api/v1/agents/career-coach/status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["agent_id"] == "career_coach_agent"

@pytest.mark.anyio
@patch("app.modules.agents.career_coach.service.AIService.execute")
async def test_career_coach_agent_execute_analyze(mock_execute, db_session, mock_resume):
    """Tests the analyze task execution logic of the Career Coach Agent."""
    mock_execute.return_value = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        latency_ms=10.0,
        prompt_version="1.0.0",
        created_at=datetime.utcnow(),
        raw_response={},
        parsed_response={
            "readiness_score": 80,
            "technical_skills_analysis": {"matched": ["Python"], "missing": ["SQLAlchemy"]},
            "soft_skills_analysis": {"matched": ["Teamwork"], "missing": ["Communication"]},
            "career_risks": ["No database experience"],
            "actionable_insights": ["Learn SQLAlchemy"],
            "guidance_summary": "Good progress."
        },
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )

    agent = get_agent_registry().get("career_coach_agent")
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="analyze",
        shared_variables={
            "resume_id": str(mock_resume.id),
            "target_role": "AI Developer"
        }
    )
    
    response = await agent.execute(context)
    assert response.status == "success"
    assert response.output["readiness_score"] == 80
    assert "SQLAlchemy" in response.output["technical_skills_analysis"]["missing"]

@patch("app.modules.agents.career_coach.agent.CareerCoachAgent.execute")
def test_api_career_coach_roadmap(mock_execute, client):
    """Verifies roadmap generation POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="career_coach_agent",
        status="success",
        output={
            "roadmap_id": str(uuid.uuid4()),
            "target_role": "AI Engineer",
            "milestones": [],
            "recommendations": []
        },
        execution_time_ms=10.0
    )
    payload = {
        "target_role": "AI Engineer",
        "experience_level": "ENTRY",
        "estimated_duration_months": 12
    }
    response = client.post("/api/v1/agents/career-coach/roadmap", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["target_role"] == "AI Engineer"

@patch("app.modules.agents.career_coach.agent.CareerCoachAgent.execute")
def test_api_career_coach_analyze(mock_execute, client):
    """Verifies profile analysis POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="career_coach_agent",
        status="success",
        output={
            "readiness_score": 85,
            "technical_skills_analysis": {"matched": ["Python"], "missing": []},
            "soft_skills_analysis": {"matched": ["Leadership"], "missing": []},
            "career_risks": [],
            "actionable_insights": [],
            "guidance_summary": "Ready."
        },
        execution_time_ms=10.0
    )
    payload = {
        "target_role": "AI Engineer"
    }
    response = client.post("/api/v1/agents/career-coach/analyze", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["readiness_score"] == 85

@patch("app.modules.agents.career_coach.agent.CareerCoachAgent.execute")
def test_api_career_coach_progress(mock_execute, client):
    """Verifies progress goal tracking POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="career_coach_agent",
        status="success",
        output={
            "completion_percentage": 50.0,
            "completed_milestones": [1],
            "current_milestone": 2,
            "next_steps": ["Step A"],
            "recommendations": []
        },
        execution_time_ms=10.0
    )
    payload = {
        "roadmap_id": str(uuid.uuid4()),
        "completed_milestones": [1],
        "current_milestone": 2
    }
    response = client.post("/api/v1/agents/career-coach/progress", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["completion_percentage"] == 50.0

@patch("app.modules.agents.career_coach.agent.CareerCoachAgent.execute")
def test_api_career_coach_weekly_plan(mock_execute, client):
    """Verifies weekly plan POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="career_coach_agent",
        status="success",
        output={
            "week_number": 1,
            "focus_areas": ["Math"],
            "tasks": ["Study Calculus"],
            "estimated_hours": 10,
            "success_criteria": ["Solve all problems"]
        },
        execution_time_ms=10.0
    )
    payload = {
        "roadmap_id": str(uuid.uuid4()),
        "week_number": 1
    }
    response = client.post("/api/v1/agents/career-coach/weekly-plan", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["week_number"] == 1

@patch("app.modules.agents.career_coach.agent.CareerCoachAgent.execute")
def test_api_career_coach_monthly_plan(mock_execute, client):
    """Verifies monthly plan POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="career_coach_agent",
        status="success",
        output={
            "month_number": 1,
            "milestones": ["Milestone 1"],
            "key_focus": "Databases",
            "weekly_breakdown": {},
            "monthly_goals": ["Goal A"]
        },
        execution_time_ms=10.0
    )
    payload = {
        "roadmap_id": str(uuid.uuid4()),
        "month_number": 1
    }
    response = client.post("/api/v1/agents/career-coach/monthly-plan", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["month_number"] == 1
