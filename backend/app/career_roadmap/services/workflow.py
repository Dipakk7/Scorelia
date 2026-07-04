from enum import Enum
from typing import List

class RoadmapWorkflowState(str, Enum):
    CREATED = "Created"
    CONTEXT_READY = "Context Ready"
    SKILL_GAP_READY = "Skill Gap Ready"
    PROMPT_READY = "Prompt Ready"
    ROADMAP_PENDING = "Roadmap Pending"
    ROADMAP_GENERATED = "Roadmap Generated"
    TIMELINE_PENDING = "Timeline Pending"
    COMPLETED = "Completed"
    FAILED = "Failed"

class RoadmapWorkflow:
    """Skeleton tracking and defining the states of an AI Career Roadmap generation workflow."""

    def __init__(self, state: RoadmapWorkflowState = RoadmapWorkflowState.CREATED):
        self._state = state

    @property
    def state(self) -> RoadmapWorkflowState:
        return self._state

    def transition_to(self, new_state: RoadmapWorkflowState) -> None:
        """Transitions workflow to a new state. Placeholder for validation rules in Part 2."""
        self._state = new_state

    @staticmethod
    def get_all_states() -> List[str]:
        return [state.value for state in RoadmapWorkflowState]
