from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Any

class ChartPoint(BaseModel):
    label: str = Field(..., description="Label for the data point")
    value: float | int = Field(..., description="Value for the data point")

    model_config = ConfigDict(from_attributes=True)

class ChartDataset(BaseModel):
    chart_id: str = Field(..., description="Unique identifier for the chart")
    chart_type: str = Field(..., description="Chart type, e.g., 'bar' | 'line' | 'pie' | 'radar'")
    title: str = Field(..., description="Human-readable title of the chart")
    data: list[ChartPoint] = Field(..., description="List of chart data points")
    metadata: dict[str, Any] | None = Field(default=None, description="Optional metadata context for the chart")

    model_config = ConfigDict(from_attributes=True)

class ChartOverviewData(BaseModel):
    charts: list[ChartDataset] = Field(..., description="List of chart datasets")
    omitted_charts: dict[str, str] | None = Field(default=None, description="Mapping of chart_ids that were omitted due to errors, to their error messages")

    model_config = ConfigDict(from_attributes=True)

class ChartOverviewResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: ChartOverviewData = Field(..., description="Container for overview charts")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Chart overview generated successfully",
                "timestamp": "2026-07-01T09:50:00Z",
                "data": {
                    "charts": [
                        {
                            "chart_id": "ats-score-distribution",
                            "chart_type": "pie",
                            "title": "ATS Score Distribution",
                            "data": [
                                {"label": "Excellent", "value": 1},
                                {"label": "Good", "value": 3}
                            ],
                            "metadata": None
                        }
                    ],
                    "omitted_charts": None
                }
            }
        }
    )

class SingleChartResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: ChartDataset = Field(..., description="Chart dataset")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Chart generated successfully",
                "timestamp": "2026-07-01T09:50:00Z",
                "data": {
                    "chart_id": "ats-grade-distribution",
                    "chart_type": "pie",
                    "title": "ATS Grade Distribution",
                    "data": [
                        {"label": "Excellent", "value": 5},
                        {"label": "Good", "value": 10}
                    ],
                    "metadata": None
                }
            }
        }
    )
