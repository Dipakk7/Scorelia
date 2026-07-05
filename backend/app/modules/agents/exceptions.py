# app/modules/agents/exceptions.py

class AgentError(Exception):
    """Base exception class for all agent-related errors."""
    pass


class AgentNotFoundError(AgentError):
    """Raised when a requested agent is not registered in the AgentRegistry."""
    pass


class AgentExecutionError(AgentError):
    """Raised when an agent execution fails due to tool errors, LLM errors, or other runtime problems."""
    pass


class AgentValidationError(AgentError):
    """Raised when the inputs, context, or parameters required by an agent fail validation."""
    pass


class OrchestrationError(AgentError):
    """Raised when the AgentOrchestrator encounters a routing or workflow execution failure."""
    pass


class MemoryExpiredError(AgentError):
    """Raised when trying to access memory that has expired (TTL)."""
    pass
