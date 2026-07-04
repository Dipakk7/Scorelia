import threading
import structlog
from typing import Dict, Any

logger = structlog.get_logger()

class RoadmapMetricsCollector:
    """Thread-safe collector for Career Roadmap service metrics (excludes AI latency metrics)."""

    def __init__(self):
        self._lock = threading.Lock()
        self.roadmaps_created = 0
        self.contexts_built = 0
        self.prompts_selected = 0
        self.workflows_initialized = 0
        self.dependencies_initialized = 0

    def record_roadmap_created(self, roadmap_id: str) -> None:
        """Increment roadmap created count."""
        with self._lock:
            self.roadmaps_created += 1
        logger.info("roadmap_metric_created", roadmap_id=roadmap_id)

    def record_context_built(self, user_id: str) -> None:
        """Increment context built count."""
        with self._lock:
            self.contexts_built += 1
        logger.info("roadmap_metric_context_built", user_id=user_id)

    def record_prompt_selected(self, prompt_name: str) -> None:
        """Increment prompt selected count."""
        with self._lock:
            self.prompts_selected += 1
        logger.info("roadmap_metric_prompt_selected", prompt_name=prompt_name)

    def record_workflow_initialized(self, workflow_state: str) -> None:
        """Increment workflow initialized count."""
        with self._lock:
            self.workflows_initialized += 1
        logger.info("roadmap_metric_workflow_initialized", workflow_state=workflow_state)

    def record_dependency_initialized(self, dependency_name: str) -> None:
        """Increment dependency initialized count."""
        with self._lock:
            self.dependencies_initialized += 1
        logger.info("roadmap_metric_dependency_initialized", dependency_name=dependency_name)

    def get_metrics(self) -> Dict[str, Any]:
        """Compile and return overall metrics report."""
        with self._lock:
            return {
                "roadmaps_created": self.roadmaps_created,
                "contexts_built": self.contexts_built,
                "prompts_selected": self.prompts_selected,
                "workflows_initialized": self.workflows_initialized,
                "dependencies_initialized": self.dependencies_initialized,
            }

    def reset(self) -> None:
        """Reset all counters to zero."""
        with self._lock:
            self.roadmaps_created = 0
            self.contexts_built = 0
            self.prompts_selected = 0
            self.workflows_initialized = 0
            self.dependencies_initialized = 0

# Global collector instance
roadmap_metrics = RoadmapMetricsCollector()
