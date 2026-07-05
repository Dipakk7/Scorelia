# app/modules/agents/tests/test_learning_agent.py

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
from app.modules.agents.context import AgentContext
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.models import AgentHealthStatus, AgentResponse
from app.modules.agents.dependencies import get_agent_registry
from app.modules.agents.learning.agent import LearningAgent
from app.modules.agents.learning.service import LearningAgentService
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage
from app.core.enums import ResumeStatus, StorageProvider

mock_user = User(
    id=uuid.uuid4(),
    email="learning-agent-test@example.com",
    is_active=True,
)

@pytest.fixture(scope="module")
def db_session():
    """Yields database session and performs cleanup."""
    db = SessionLocal()
    
    # Cleanup
    test_user = db.query(User).filter(User.email == mock_user.email).first()
    if test_user:
        db.query(Resume).filter(Resume.user_id == test_user.id).delete()
        db.delete(test_user)
        db.commit()
        
    db.add(mock_user)
    db.commit()
    db.refresh(mock_user)
    
    yield db
    
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
        original_filename="test_learning_resume.pdf",
        stored_filename=f"stored_{uuid.uuid4()}_test_learning_resume.pdf",
        file_path="storage/test_learning_resume.pdf",
        file_size=1024,
        file_type="pdf",
        mime_type="application/pdf",
        status=ResumeStatus.PARSED,
        parsed_data={"data": {"skills": {"value": ["Python", "Docker"]}}},
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

def test_learning_agent_instantiation():
    """Ensures LearningAgent registers with correct details and defaults."""
    agent = LearningAgent()
    assert agent.agent_id == "learning_agent"
    assert "recommend" in agent.supported_tasks
    assert "courses" in agent.supported_tasks
    assert "study_plan" in agent.supported_tasks

@pytest.mark.anyio
async def test_learning_agent_validation_logic():
    """Validates parameters checking behavior of LearningAgent."""
    agent = LearningAgent()
    
    # Valid recommend task
    ctx1 = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="recommend",
        shared_variables={"target_role": "Data Scientist"}
    )
    assert await agent.validate(ctx1) is True

    # Missing target role
    ctx2 = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="recommend",
        shared_variables={}
    )
    assert await agent.validate(ctx2) is False

    # Unsupported task
    ctx3 = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="invalid_learning_task",
        shared_variables={}
    )
    assert await agent.validate(ctx3) is False

@pytest.mark.anyio
async def test_learning_agent_health():
    """Tests diagnostics / health reporting of the Learning Agent."""
    ai_service_mock = MagicMock()
    ai_service_mock.provider = MagicMock()
    ai_service_mock.provider.provider_name = "mock_provider"
    
    agent = LearningAgent(ai_service=ai_service_mock)
    report = await agent.health()
    assert report.status == "healthy"
    assert "mock_provider" in report.details.get("provider", "")

def test_api_learning_agent_status(client):
    """Verifies retrieval of Learning Agent health status via GET endpoint."""
    response = client.get("/api/v1/agents/learning/status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["agent_id"] == "learning_agent"

@pytest.mark.anyio
@patch("app.modules.agents.learning.service.AIService.execute")
async def test_learning_agent_execute_recommend(mock_execute, db_session, mock_resume):
    """Tests the recommend task execution logic of the Learning Agent."""
    mock_execute.return_value = AIStructuredResponse(
        provider="mock",
        model="mock-model",
        latency_ms=10.0,
        prompt_version="1.0.0",
        created_at=datetime.utcnow(),
        raw_response={},
        parsed_response={
            "recommendations": [
                {
                    "title": "Machine Learning Foundations",
                    "description": "Learn linear algebra, calculus, and statistics.",
                    "priority": "HIGH",
                    "reason": "Required for Data Scientist target role."
                }
            ]
        },
        usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        token_fields={}
    )

    agent = get_agent_registry().get("learning_agent")
    context = AgentContext(
        user_id=str(mock_user.id),
        session_id=str(uuid.uuid4()),
        request_id=str(uuid.uuid4()),
        current_task="recommend",
        shared_variables={
            "resume_id": str(mock_resume.id),
            "target_role": "Data Scientist"
        }
    )
    
    response = await agent.execute(context)
    assert response.status == "success"
    assert len(response.output["recommendations"]) == 1
    assert response.output["recommendations"][0]["title"] == "Machine Learning Foundations"

@patch("app.modules.agents.learning.agent.LearningAgent.execute")
def test_api_learning_recommend(mock_execute, client):
    """Verifies learning recommendation POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="learning_agent",
        status="success",
        output={"recommendations": [{"title": "React", "description": "Frontend framework", "priority": "HIGH", "reason": "Reason"}]},
        execution_time_ms=10.0
    )
    payload = {
        "target_role": "Web Developer",
        "skills": ["HTML", "CSS"]
    }
    response = client.post("/api/v1/agents/learning/recommend", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["recommendations"][0]["title"] == "React"

@patch("app.modules.agents.learning.agent.LearningAgent.execute")
def test_api_learning_path(mock_execute, client):
    """Verifies learning path generation POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="learning_agent",
        status="success",
        output={"target_role": "AI Engineer", "phases": [{"phase_number": 1, "title": "Maths", "objective": "Learn math", "estimated_duration_weeks": 4, "topics": ["Calculus"]}]},
        execution_time_ms=10.0
    )
    payload = {
        "target_role": "AI Engineer",
        "preferences": {"mode": "self-paced"}
    }
    response = client.post("/api/v1/agents/learning/path", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["phases"][0]["title"] == "Maths"

@patch("app.modules.agents.learning.agent.LearningAgent.execute")
def test_api_learning_courses(mock_execute, client):
    """Verifies learning courses POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="learning_agent",
        status="success",
        output={"courses": [{"course_name": "Deep Learning Specialization", "platform": "Coursera", "estimated_hours": 40, "difficulty": "Hard", "description": "DL course", "reason": "Matches query"}]},
        execution_time_ms=10.0
    )
    payload = {
        "query": "neural networks",
        "skills": ["Python"]
    }
    response = client.post("/api/v1/agents/learning/courses", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["courses"][0]["course_name"] == "Deep Learning Specialization"

@patch("app.modules.agents.learning.agent.LearningAgent.execute")
def test_api_learning_certifications(mock_execute, client):
    """Verifies certification recommendation POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="learning_agent",
        status="success",
        output={"certifications": [{"certificate_name": "CKA", "issuing_organization": "CNCF", "difficulty": "Medium", "cost_range": "Medium", "preparation_time_months": 2, "reason": "Matches"}]},
        execution_time_ms=10.0
    )
    payload = {
        "target_role": "DevOps Engineer"
    }
    response = client.post("/api/v1/agents/learning/certifications", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["certifications"][0]["certificate_name"] == "CKA"

@patch("app.modules.agents.learning.agent.LearningAgent.execute")
def test_api_learning_study_plan(mock_execute, client):
    """Verifies study plan POST endpoint."""
    mock_execute.return_value = AgentResponse(
        agent_id="learning_agent",
        status="success",
        output={"study_plan": [{"week_number": 1, "weekly_focus": "Kubernetes basic", "topics": ["pods", "services"], "study_hours": 10, "weekly_goals": ["Goal 1"]}]},
        execution_time_ms=10.0
    )
    payload = {
        "target_role": "DevOps Engineer",
        "hours_per_week": 10,
        "duration_weeks": 4
    }
    response = client.post("/api/v1/agents/learning/study-plan", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["study_plan"][0]["week_number"] == 1
