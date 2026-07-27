"""
Unified Deep Intelligence Service Aggregator
"""

from typing import Dict, Any, List
from app.services.github.intelligence.health_engine import HealthEngine
from app.services.github.intelligence.engineering_score import EngineeringScoreEngine
from app.services.github.intelligence.productivity_engine import ProductivityEngine
from app.services.github.intelligence.collaboration_engine import CollaborationEngine
from app.services.github.intelligence.technical_debt_engine import TechnicalDebtEngine
from app.services.github.intelligence.release_readiness import ReleaseReadinessEngine
from app.services.github.intelligence.risk_engine import RiskEngine
from app.services.github.intelligence.trend_engine import TrendEngine
from app.services.github.intelligence.confidence_engine import ConfidenceEngine

class IntelligenceService:
    """Aggregates all 9 intelligence calculation engines into a unified payload."""

    @staticmethod
    def get_unified_intelligence(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        mock_quality = {"testCoverage": 78, "securityScore": 92, "reliability": 94, "maintainability": "A", "technicalDebt": 23, "documentationScore": 82}
        mock_activity = {"monthlyCommits": 156}
        mock_review = {"reviewsCompleted": 14, "approvals": 11, "responseTime": "1.5 hrs"}

        health = HealthEngine.calculate_health(repos[0] if repos else {})
        engineering = EngineeringScoreEngine.calculate_score(mock_quality)
        productivity = ProductivityEngine.calculate_productivity(mock_activity)
        collaboration = CollaborationEngine.calculate_collaboration(mock_review)
        tech_debt = TechnicalDebtEngine.calculate_technical_debt(mock_quality)
        release = ReleaseReadinessEngine.calculate_readiness(mock_quality, repos[0] if repos else {})
        risks = RiskEngine.detect_risks(repos)
        trends = TrendEngine.calculate_trends(mock_activity)
        confidence = ConfidenceEngine.calculate_confidence(sample_size=len(repos))

        return {
            "health": health,
            "engineering": engineering,
            "productivity": productivity,
            "collaboration": collaboration,
            "technicalDebt": tech_debt,
            "releaseReadiness": release,
            "risks": risks,
            "trends": trends,
            "confidence": confidence,
        }
