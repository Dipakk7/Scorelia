"""
Tests for Deep GitHub Intelligence Engines
"""

import pytest
from app.services.github.intelligence.health_engine import HealthEngine
from app.services.github.intelligence.engineering_score import EngineeringScoreEngine
from app.services.github.intelligence.productivity_engine import ProductivityEngine
from app.services.github.intelligence.risk_engine import RiskEngine
from app.services.github.intelligence.release_readiness import ReleaseReadinessEngine
from app.services.github.intelligence.confidence_engine import ConfidenceEngine
from app.services.github.intelligence.intelligence_service import IntelligenceService

def test_health_engine():
    repo = {"stars": 50, "forks": 10, "issues": 2}
    health = HealthEngine.calculate_health(repo)
    assert health["healthScore"] >= 80
    assert health["healthGrade"] == "Excellent"

def test_engineering_score_engine():
    quality = {"testCoverage": 80, "securityScore": 90, "reliability": 90, "maintainability": "A"}
    score = EngineeringScoreEngine.calculate_score(quality)
    assert score["overallScore"] > 80
    assert "testing" in score["categoryScores"]

def test_risk_engine():
    repos = [{"id": 1, "name": "test-repo", "issues": 20}]
    risks = RiskEngine.detect_risks(repos)
    assert len(risks) > 0
    assert risks[0]["severity"] == "High"

def test_release_readiness_engine():
    quality = {"testCoverage": 85, "securityScore": 95}
    repo = {"issues": 1}
    readiness = ReleaseReadinessEngine.calculate_readiness(quality, repo)
    assert readiness["releaseReadinessScore"] >= 80
    assert readiness["readinessGrade"] == "Production Ready"

def test_confidence_engine():
    conf = ConfidenceEngine.calculate_confidence(sample_size=10, freshness_hours=2)
    assert conf["confidenceScore"] >= 90
    assert conf["confidenceLevel"] == "High"

def test_unified_intelligence_service():
    repos = [{"id": "1", "name": "scorelia", "stars": 56, "forks": 12, "issues": 8, "health": "Excellent"}]
    intel = IntelligenceService.get_unified_intelligence(repos)
    assert "health" in intel
    assert "engineering" in intel
    assert "productivity" in intel
    assert "risks" in intel
