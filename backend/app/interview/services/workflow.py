from enum import Enum
from typing import List

class InterviewWorkflowState(str, Enum):
    CREATED = "Created"
    CONTEXT_READY = "Context Ready"
    WAITING_FOR_QUESTIONS = "Waiting For Questions"
    WAITING_FOR_ANSWERS = "Waiting For Answers"
    EVALUATION_PENDING = "Evaluation Pending"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class InterviewWorkflow:
    """Skeleton tracking and defining the states of an AI interview session workflow."""
    
    def __init__(self, state: InterviewWorkflowState = InterviewWorkflowState.CREATED):
        self._state = state

    @property
    def state(self) -> InterviewWorkflowState:
        return self._state

    def transition_to(self, new_state: InterviewWorkflowState) -> None:
        """Transitions workflow to a new state. Placeholder for validation rules in Phase 10 Part 2."""
        self._state = new_state

    @staticmethod
    def get_all_states() -> List[str]:
        return [state.value for state in InterviewWorkflowState]
