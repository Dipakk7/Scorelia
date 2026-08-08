import os
import pytest
from fastapi.testclient import TestClient
from app.main import app

os.environ["ENVIRONMENT"] = "testing"

client = TestClient(app)

def test_system_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "application" in data
    assert data["status"] == "running"

def test_health_check():
    response = client.get("/health")
    assert response.status_code in [200, 503]

def test_api_v1_index():
    response = client.get("/api/v1")
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == "1.0"

def test_github_connection_endpoint():
    response = client.get("/api/v1/github/connection")
    assert response.status_code == 200
    data = response.json()
    assert "isConnected" in data
    assert "rateLimit" in data

def test_github_hero_endpoint():
    response = client.get("/api/v1/github/hero")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data

def test_github_analytics_endpoint():
    response = client.get("/api/v1/github/analytics")
    assert response.status_code == 200

def test_github_repositories_endpoint():
    response = client.get("/api/v1/github/repositories")
    assert response.status_code == 200

def test_career_roadmap_v3_overview():
    response = client.get("/api/v1/ai/roadmap/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data

def test_career_roadmap_v3_timeline():
    response = client.get("/api/v1/ai/roadmap/timeline")
    assert response.status_code == 200
    data = response.json()
    assert "phases" in data

def test_career_roadmap_v3_skills_gap():
    response = client.get("/api/v1/ai/roadmap/skills-gap")
    assert response.status_code == 200
    data = response.json()
    assert "skillsOverview" in data

def test_career_roadmap_v3_milestones():
    response = client.get("/api/v1/ai/roadmap/milestones")
    assert response.status_code == 200
    data = response.json()
    assert "milestones" in data

def test_career_roadmap_v3_assistant():
    response = client.get("/api/v1/ai/roadmap/assistant")
    assert response.status_code == 200
    data = response.json()
    assert "messages" in data
