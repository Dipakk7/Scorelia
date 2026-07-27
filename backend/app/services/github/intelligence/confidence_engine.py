"""
Confidence Rating Calculation Engine
"""

from typing import Dict, Any

class ConfidenceEngine:
    """Generates confidence score based on data freshness and sample size."""

    @staticmethod
    def calculate_confidence(sample_size: int = 8, freshness_hours: int = 1) -> Dict[str, Any]:
        score = 95
        if sample_size < 3:
            score -= 15
        if freshness_hours > 24:
            score -= 10

        level = "High" if score >= 90 else "Medium" if score >= 70 else "Low"

        return {
            "confidenceScore": score,
            "confidenceLevel": level,
            "reason": f"High data freshness ({freshness_hours}h) with {sample_size} repositories analyzed.",
        }
