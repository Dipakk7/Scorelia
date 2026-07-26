import pytest
from app.career_roadmap.services.roadmap_v3_service import RoadmapV3Service
from app.career_roadmap.schemas.schemas_v3 import (
    CareerRoadmapOverviewResponse,
    TimelineResponse,
    SkillsGapResponse,
    MilestonesResponse,
    AssistantResponse,
    AssistantMessageRequest,
)

def test_overview_endpoint():
    data = RoadmapV3Service.get_overview_data()
    validated = CareerRoadmapOverviewResponse(**data)
    assert validated.title == "Your Career Roadmap"
    assert len(validated.kpis) == 5

def test_timeline_endpoint():
    data = RoadmapV3Service.get_timeline_data()
    validated = TimelineResponse(**data)
    assert len(validated.phases) == 4
    assert len(validated.recommendedNextSteps) == 4

def test_skills_gap_endpoint():
    data = RoadmapV3Service.get_skills_gap_data()
    validated = SkillsGapResponse(**data)
    assert validated.skillsOverview.overallReadiness == 78
    assert len(validated.skillCategories) == 9

def test_milestones_endpoint():
    data = RoadmapV3Service.get_milestones_data()
    validated = MilestonesResponse(**data)
    assert validated.overview.completedMilestones == 12
    assert len(validated.milestones) == 5

def test_assistant_endpoint():
    data = RoadmapV3Service.get_assistant_data()
    validated = AssistantResponse(**data)
    assert len(validated.messages) == 3
    assert len(validated.suggestedPrompts) == 8

def test_assistant_message_post():
    req = AssistantMessageRequest(message="Test message from user")
    res = RoadmapV3Service.process_assistant_message(req)
    validated = AssistantResponse(**res)
    assert len(validated.messages) == 5
    assert validated.messages[-2].text == "Test message from user"
