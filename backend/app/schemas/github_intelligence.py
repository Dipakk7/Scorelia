"""
GitHub Intelligence Pydantic Schemas
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class HealthSchema(BaseModel):
    healthScore: int
    healthGrade: str
    summary: str
    recommendations: List[str]
    confidence: int

class EngineeringScoreSchema(BaseModel):
    overallScore: int
    categoryScores: Dict[str, int]
    trend: str
    confidence: int

class RiskItemSchema(BaseModel):
    id: str
    severity: str
    repository: str
    title: str
    description: str
    recommendation: str

class DeepIntelligenceSchema(BaseModel):
    health: HealthSchema
    engineering: EngineeringScoreSchema
    productivity: Dict[str, Any]
    collaboration: Dict[str, Any]
    technicalDebt: Dict[str, Any]
    releaseReadiness: Dict[str, Any]
    risks: List[RiskItemSchema]
    trends: Dict[str, Any]
    confidence: Dict[str, Any]
