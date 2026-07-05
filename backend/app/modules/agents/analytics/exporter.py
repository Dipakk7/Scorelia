# app/modules/agents/analytics/exporter.py

import json
from typing import Dict, Any
from pydantic import BaseModel


class MetricsExporter:
    """Utility service to serialize metrics and outputs to standard formats."""

    @staticmethod
    def export_to_json(metrics: BaseModel) -> Dict[str, Any]:
        """Convert a pydantic model or container to a standard dictionary."""
        return metrics.model_dump()

    @staticmethod
    def export_to_raw_string(metrics: BaseModel) -> str:
        """Convert a pydantic model to a raw formatted JSON string."""
        return json.dumps(metrics.model_dump(), default=str, indent=2)
