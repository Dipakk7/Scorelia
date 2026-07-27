"""
Repository Health Calculation Engine
"""

from typing import Dict, Any, List

class HealthEngine:
    """Deterministic calculation engine for repository health ratings."""

    @staticmethod
    def calculate_health(repo_data: Dict[str, Any]) -> Dict[str, Any]:
        stars = repo_data.get("stars", 0)
        forks = repo_data.get("forks", 0)
        issues = repo_data.get("issues", 0)
        is_archived = repo_data.get("health") == "Archived"

        base_score = 85
        if is_archived:
            return {
                "healthScore": 40,
                "healthGrade": "Archived",
                "summary": "Repository is archived.",
                "recommendations": ["Unarchive if active maintenance is required."],
                "confidence": 98,
            }

        # Issue penalty
        if issues > 15:
            base_score -= 20
        elif issues > 5:
            base_score -= 10

        # Star / fork bonus
        if stars > 30:
            base_score += 10
        if forks > 5:
            base_score += 5

        final_score = max(30, min(100, base_score))

        grade = "Good"
        if final_score >= 90:
            grade = "Excellent"
        elif final_score >= 75:
            grade = "Good"
        elif final_score >= 60:
            grade = "Average"
        elif final_score >= 45:
            grade = "Needs Work"
        else:
            grade = "Poor"

        return {
            "healthScore": final_score,
            "healthGrade": grade,
            "summary": f"Repository maintains a {grade.lower()} health rating with {issues} open issues.",
            "recommendations": [
                "Address open issues to maintain high health score.",
                "Keep dependencies updated to prevent security vulnerabilities.",
            ],
            "confidence": 94,
        }
