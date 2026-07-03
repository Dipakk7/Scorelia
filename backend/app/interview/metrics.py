import threading
import structlog
from typing import Dict, Any

logger = structlog.get_logger()

class InterviewMetricsCollector:
    """Thread-safe collector for Interview service metrics (excludes AI metrics)."""

    def __init__(self):
        self._lock = threading.Lock()
        self.sessions_created = 0
        self.sessions_loaded = 0
        self.sessions_deleted = 0
        self.contexts_loaded = 0
        self.prompts_selected = 0
        self.dependencies_initialized = 0

    def record_session_created(self, session_id: str) -> None:
        """Increment session created count."""
        with self._lock:
            self.sessions_created += 1
        logger.info("interview_metric_session_created", session_id=session_id)

    def record_session_loaded(self, session_id: str) -> None:
        """Increment session loaded count."""
        with self._lock:
            self.sessions_loaded += 1
        logger.info("interview_metric_session_loaded", session_id=session_id)

    def record_session_deleted(self, session_id: str) -> None:
        """Increment session deleted count."""
        with self._lock:
            self.sessions_deleted += 1
        logger.info("interview_metric_session_deleted", session_id=session_id)

    def record_context_loaded(self, user_id: str, resume_id: str) -> None:
        """Increment context loaded count."""
        with self._lock:
            self.contexts_loaded += 1
        # Privacy: do not log actual resume data, only IDs
        logger.info("interview_metric_context_loaded", user_id=user_id, resume_id=resume_id)

    def record_prompt_selected(self, prompt_name: str) -> None:
        """Increment prompt selected count."""
        with self._lock:
            self.prompts_selected += 1
        logger.info("interview_metric_prompt_selected", prompt_name=prompt_name)

    def record_dependency_initialized(self, dependency_name: str) -> None:
        """Increment dependency initialized count."""
        with self._lock:
            self.dependencies_initialized += 1
        logger.info("interview_metric_dependency_initialized", dependency_name=dependency_name)

    def get_metrics(self) -> Dict[str, Any]:
        """Compile and return overall metrics report."""
        with self._lock:
            return {
                "sessions_created": self.sessions_created,
                "sessions_loaded": self.sessions_loaded,
                "sessions_deleted": self.sessions_deleted,
                "contexts_loaded": self.contexts_loaded,
                "prompts_selected": self.prompts_selected,
                "dependencies_initialized": self.dependencies_initialized,
            }

    def reset(self) -> None:
        """Reset all counters to zero."""
        with self._lock:
            self.sessions_created = 0
            self.sessions_loaded = 0
            self.sessions_deleted = 0
            self.contexts_loaded = 0
            self.prompts_selected = 0
            self.dependencies_initialized = 0

# Global collector instance
interview_metrics = InterviewMetricsCollector()
