import os
import sys
import uuid
import unittest
from datetime import datetime, timezone
from unittest.mock import patch, MagicMock

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.config import settings
from app.core.db import SessionLocal
from app.ai.services.ai_service import AIService
from app.career_roadmap.services.ai_service import RoadmapAIService
from app.career_roadmap.services.workflow import RoadmapWorkflow, RoadmapWorkflowState
from app.career_roadmap.services.context import RoadmapContext
from app.career_roadmap.services.service import RoadmapService
from app.career_roadmap.dependencies import get_roadmap_service, get_roadmap_ai_service
from app.career_roadmap.metrics import roadmap_metrics
from app.career_roadmap.models.roadmap import CareerRoadmap

from fastapi.testclient import TestClient

class TestCareerRoadmapIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def setUp(self):
        roadmap_metrics.reset()

    def test_configuration(self):
        """Test that the new configuration parameters load correctly."""
        self.assertTrue(hasattr(settings, "ROADMAP_PROMPT_VERSION"))
        self.assertTrue(hasattr(settings, "ROADMAP_CONTEXT_CACHE"))
        self.assertTrue(hasattr(settings, "ROADMAP_WORKFLOW_VERSION"))
        self.assertEqual(settings.ROADMAP_PROMPT_VERSION, "1.0.0")
        self.assertEqual(settings.ROADMAP_CONTEXT_CACHE, True)
        self.assertEqual(settings.ROADMAP_WORKFLOW_VERSION, "1.0.0")

    def test_workflow_skeleton(self):
        """Test workflow states and transitions."""
        all_states = RoadmapWorkflow.get_all_states()
        self.assertEqual(len(all_states), 9)
        self.assertIn("Created", all_states)
        self.assertIn("Context Ready", all_states)
        self.assertIn("Skill Gap Ready", all_states)
        self.assertIn("Prompt Ready", all_states)
        self.assertIn("Roadmap Pending", all_states)
        self.assertIn("Roadmap Generated", all_states)
        self.assertIn("Timeline Pending", all_states)
        self.assertIn("Completed", all_states)
        self.assertIn("Failed", all_states)

        wf = RoadmapWorkflow()
        self.assertEqual(wf.state, RoadmapWorkflowState.CREATED)
        wf.transition_to(RoadmapWorkflowState.CONTEXT_READY)
        self.assertEqual(wf.state, RoadmapWorkflowState.CONTEXT_READY)

    def test_prompt_registry_registration(self):
        """Test that RoadmapAIService correctly registers its templates under the 'career_roadmap' category."""
        from app.ai.dependencies import get_ai_service
        ai_service = get_ai_service()
        
        # Initialize RoadmapAIService which should automatically trigger template registration
        roadmap_ai = RoadmapAIService(ai_service=ai_service)
        
        # Verify prompts are registered
        templates = ["system_prompt", "career_roadmap", "learning_path", "projects", "certifications", "timeline", "skill_gap"]
        for t in templates:
            prompt = ai_service.registry.get_prompt(category="career_roadmap", name=t)
            self.assertEqual(prompt.metadata.name, t)
            self.assertEqual(prompt.metadata.version, "1.0.0")

    def test_roadmap_ai_service_methods(self):
        """Test RoadmapAIService prompt selection and payload assembly."""
        from app.ai.dependencies import get_ai_service
        ai_service = get_ai_service()
        roadmap_ai = RoadmapAIService(ai_service=ai_service)

        # 1. Select Prompt
        self.assertEqual(roadmap_ai.select_prompt("system_prompt"), "system_prompt")
        self.assertEqual(roadmap_ai.select_prompt("timeline"), "timeline")
        self.assertEqual(roadmap_ai.select_prompt("invalid_step"), "career_roadmap")
        self.assertEqual(roadmap_metrics.get_metrics()["prompts_selected"], 3)

        # 2. Prepare Variables & Request
        roadmap = CareerRoadmap(
            id=uuid.uuid4(),
            target_role="Cloud Architect",
            current_role="System Administrator",
            experience_level="MID",
            target_industry="Tech",
            estimated_duration_months=6,
            provider="ollama",
            model="qwen2.5:3b"
        )
        context = RoadmapContext(
            current_role="System Administrator",
            experience_level="MID",
            preferred_industry="Tech"
        )
        
        variables = roadmap_ai.prepare_variables(roadmap, context, {"extra_var": 42})
        self.assertEqual(variables["target_role"], "Cloud Architect")
        self.assertEqual(variables["current_role"], "System Administrator")
        self.assertEqual(variables["experience_level"], "MID")
        self.assertEqual(variables["target_industry"], "Tech")
        self.assertEqual(variables["extra_var"], 42)

        request_payload = roadmap_ai.prepare_request(roadmap, variables, "career_roadmap")
        self.assertEqual(request_payload["category"], "career_roadmap")
        self.assertEqual(request_payload["name"], "career_roadmap")
        self.assertEqual(request_payload["temperature"], 0.3)
        self.assertEqual(request_payload["model"], "qwen2.5:3b")

        # 3. Hook execution (no AI call)
        response = self.client.get("/health") # Keep event loop alive if needed, but placeholder hook is sync/async safe
        import asyncio
        hook_res = asyncio.run(roadmap_ai.execute_placeholder_hook(request_payload))
        self.assertEqual(hook_res["status"], "placeholder_success")

    def test_context_builder_extended(self):
        """Test that RoadmapContext extends correct fields and serializes them."""
        context = RoadmapContext(
            target_role="Solutions Architect",
            current_role="Staff Developer",
            experience_level="SENIOR",
            preferred_industry="HealthTech",
            context_version="2.0.0"
        )
        self.assertEqual(context.target_role, "Solutions Architect")
        self.assertEqual(context.current_role, "Staff Developer")
        self.assertEqual(context.experience_level, "SENIOR")
        self.assertEqual(context.preferred_industry, "HealthTech")
        self.assertEqual(context.context_version, "2.0.0")
        self.assertTrue(context.generated_at.endswith("Z"))

        serialized = context.to_dict()
        self.assertEqual(serialized["target_role"], "Solutions Architect")
        self.assertEqual(serialized["current_role"], "Staff Developer")
        self.assertEqual(serialized["experience_level"], "SENIOR")
        self.assertEqual(serialized["preferred_industry"], "HealthTech")
        self.assertEqual(serialized["context_version"], "2.0.0")
        self.assertTrue("generated_at" in serialized)

    def test_dependency_injection(self):
        """Test DI retrieval and registration of dependencies."""
        db = SessionLocal()
        try:
            # Resolve AI service dependency injector
            roadmap_ai_service = get_roadmap_ai_service()
            self.assertIsInstance(roadmap_ai_service, RoadmapAIService)
            self.assertEqual(roadmap_metrics.get_metrics()["dependencies_initialized"], 1)

            # Resolve main roadmap service dependency injector
            roadmap_service = get_roadmap_service(db=db)
            self.assertIsInstance(roadmap_service, RoadmapService)
            self.assertEqual(roadmap_metrics.get_metrics()["dependencies_initialized"], 3) # resolves get_roadmap_ai_service and get_roadmap_service
        finally:
            db.close()

    def test_health_check_endpoint(self):
        # Test that the extended health check endpoint returns career roadmap service details.
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("roadmap", data)
        roadmap_health = data["roadmap"]
        self.assertEqual(roadmap_health["status"], "healthy")
        self.assertEqual(roadmap_health["career_roadmap_module"], "healthy")
        self.assertEqual(roadmap_health["prompt_registry"], "healthy")
        self.assertEqual(roadmap_health["dependency_injection"], "healthy")
        self.assertEqual(roadmap_health["workflow_skeleton"], "healthy")
        self.assertEqual(roadmap_health["context_builder"], "healthy")
