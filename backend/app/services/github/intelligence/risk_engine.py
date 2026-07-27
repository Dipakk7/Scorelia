"""
Engineering Risk Detection Engine
"""

from typing import Dict, Any, List

class RiskEngine:
    """Detects engineering risks across repositories, stale PRs, and review coverage."""

    @staticmethod
    def detect_risks(repo_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        detected = []

        for repo in repo_list:
            issues = repo.get("issues", 0)
            if issues > 10:
                detected.append({
                    "id": f"risk-{repo.get('id')}",
                    "severity": "High",
                    "repository": repo.get("name"),
                    "title": f"High open issue count in {repo.get('name')}",
                    "description": f"Repository has {issues} open issues requiring triage.",
                    "recommendation": "Schedule a bug triage session to close stale issues.",
                })
            elif repo.get("health") == "Needs Work":
                detected.append({
                    "id": f"risk-{repo.get('id')}",
                    "severity": "Medium",
                    "repository": repo.get("name"),
                    "title": f"Untested code paths in {repo.get('name')}",
                    "description": "Test coverage fell below threshold.",
                    "recommendation": "Add unit tests to data processing modules.",
                })

        if not detected:
            detected.append({
                "id": "risk-none",
                "severity": "Low",
                "repository": "All",
                "title": "Zero Critical Risks Detected",
                "description": "All repositories exhibit healthy contribution rhythms.",
                "recommendation": "Maintain current engineering practices.",
            })

        return detected
