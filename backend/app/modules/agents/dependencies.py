# app/modules/agents/dependencies.py

from typing import Any, Optional, Dict, List
from fastapi import Depends
from fastapi.params import Depends as DependsClass


from app.modules.agents.models import AgentConfig
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.memory import SharedMemory
from app.modules.agents.events import AgentEventBus
from app.modules.agents.orchestrator import AgentOrchestrator
from app.modules.agents.factory import AgentFactory

from app.ai.dependencies import get_ai_service
from app.ai.services.ai_service import AIService
from app.modules.rag.dependencies import get_rag_orchestrator
from app.modules.rag.generation.orchestrator import RAGOrchestrator

# Caching module level instances to prevent object duplication and ensure thread-safe singletons
_agent_config = None
_agent_registry = None
_shared_memory = None
_agent_event_bus = None
_agent_orchestrator = None
_agent_factory = None
_memory_manager = None
_tool_registry = None
_tool_executor = None
_workflow_engine = None
_analytics_service = None



def get_agent_config() -> AgentConfig:
    """Dependency injector to retrieve the AgentConfig instance."""
    global _agent_config
    if _agent_config is None:
        _agent_config = AgentConfig()
    return _agent_config


def get_agent_registry() -> AgentRegistry:
    """Dependency injector to retrieve the AgentRegistry instance."""
    global _agent_registry
    if _agent_registry is None:
        _agent_registry = AgentRegistry()
        try:
            from app.modules.agents.resume.agent import ResumeAgent
            from app.modules.agents.ats.agent import ATSAgent
            from app.modules.agents.job.agent import JobMatchAgent
            from app.modules.agents.cover_letter.agent import CoverLetterAgent
            from app.modules.agents.interview.agent import InterviewAgent
            from app.modules.agents.career_coach.agent import CareerCoachAgent
            from app.modules.agents.learning.agent import LearningAgent
            from app.modules.agents.dependencies import get_agent_factory
            factory = get_agent_factory()
            
            # Register Resume Agent
            resume_agent = factory.create_agent(
                agent_class=ResumeAgent,
                agent_id="resume_agent",
                name="Resume Agent",
                description="Dedicated AI Agent for resume review, rewrite, optimization, and parsing integration.",
                supported_tasks=["review", "rewrite", "optimize", "summary", "suggestions", "score", "parse", "feedback", "improvement_plan"],
                required_tools=["ai_service", "resume_review_service", "resume_rewrite_service", "resume_optimization_service", "resume_parser_service", "rag_orchestrator"]
            )
            _agent_registry.register(resume_agent)

            # Register ATS Agent
            ats_agent = factory.create_agent(
                agent_class=ATSAgent,
                agent_id="ats_agent",
                name="ATS Agent",
                description="Dedicated AI Agent for ATS compliance, scoring, resume optimization, and recommendations.",
                supported_tasks=[
                    "ats_review", "ats_score", "ats_improve",
                    "ats_keyword_analysis", "ats_missing_skills",
                    "ats_readiness", "ats_recommendations"
                ],
                required_tools=["ai_service", "ats_service", "rag_orchestrator"]
            )
            _agent_registry.register(ats_agent)

            # Register Job Match Agent
            job_agent = factory.create_agent(
                agent_class=JobMatchAgent,
                agent_id="job_match_agent",
                name="Job Match Agent",
                description="Dedicated AI Agent for Job matching, skill gap analysis, and tailored recommendations.",
                supported_tasks=[
                    "job_match", "job_matching", "match_score",
                    "job_analyze", "skill_gap", "missing_keywords", "missing_skills",
                    "education_match", "experience_match", "certification_match",
                    "job_recommend", "job_recommendations", "resume_vs_jd_analysis"
                ],
                required_tools=["ai_service", "job_match_service", "rag_orchestrator"]
            )
            _agent_registry.register(job_agent)

            # Register Cover Letter Agent
            cover_letter_agent = factory.create_agent(
                agent_class=CoverLetterAgent,
                agent_id="cover_letter_agent",
                name="Cover Letter Agent",
                description="Dedicated AI Agent for generating, reviewing, rewriting, and optimizing cover letters.",
                supported_tasks=[
                    "generate", "review", "rewrite", "optimize", "suggestions",
                    "generate_company_specific", "generate_internship", "generate_fresher", "generate_experienced"
                ],
                required_tools=["ai_service", "cover_letter_service", "cover_letter_optimization_service", "rag_orchestrator"]
            )
            _agent_registry.register(cover_letter_agent)

            # Register Interview Agent
            interview_agent = factory.create_agent(
                agent_class=InterviewAgent,
                agent_id="interview_agent",
                name="Interview Agent",
                description="Dedicated AI Agent for HR, technical, behavioral, and mock interviews, answer evaluation, and readiness assessment.",
                supported_tasks=[
                    "questions", "generate_questions",
                    "evaluate", "evaluate_answer",
                    "mock", "mock_interview",
                    "readiness", "readiness_report",
                    "feedback"
                ],
                required_tools=["ai_service", "interview_service", "interview_session_manager", "interview_analytics_service", "rag_orchestrator"]
            )
            _agent_registry.register(interview_agent)

            # Register Career Coach Agent
            career_coach_agent = factory.create_agent(
                agent_class=CareerCoachAgent,
                agent_id="career_coach_agent",
                name="Career Coach Agent",
                description="Dedicated AI Agent for personalized career guidance, roadmap generation, risk assessment, and progress tracking.",
                supported_tasks=[
                    "roadmap", "analyze", "progress", "weekly_plan", "weekly-plan", "monthly_plan", "monthly-plan"
                ],
                required_tools=["ai_service", "roadmap_service", "career_analytics_service", "rag_orchestrator"]
            )
            _agent_registry.register(career_coach_agent)

            # Register Learning Agent
            learning_agent = factory.create_agent(
                agent_class=LearningAgent,
                agent_id="learning_agent",
                name="Learning Agent",
                description="Dedicated AI Agent for learning recommendations, personalized study paths, course discovery, and certifications.",
                supported_tasks=[
                    "recommend", "path", "courses", "certifications", "study_plan", "study-plan"
                ],
                required_tools=["ai_service", "learning_recommendation_engine", "rag_orchestrator"]
            )
            _agent_registry.register(learning_agent)

        except Exception as e:
            import structlog
            structlog.get_logger().error("failed_to_register_agents_on_startup", error=str(e))
    return _agent_registry



def get_shared_memory() -> SharedMemory:
    """Dependency injector to retrieve the SharedMemory instance."""
    global _shared_memory
    if _shared_memory is None:
        _shared_memory = SharedMemory()
    return _shared_memory


def get_agent_event_bus() -> AgentEventBus:
    """Dependency injector to retrieve the AgentEventBus instance."""
    global _agent_event_bus
    if _agent_event_bus is None:
        _agent_event_bus = AgentEventBus()
    return _agent_event_bus


def get_memory_manager() -> Any:
    """Dependency injector to retrieve the MemoryManager instance."""
    global _memory_manager
    if _memory_manager is None:
        from app.modules.agents.workflow.memory.memory_manager import MemoryManager
        _memory_manager = MemoryManager()
    return _memory_manager


def get_tool_registry() -> Any:
    """Dependency injector to retrieve the ToolRegistry instance."""
    global _tool_registry
    if _tool_registry is None:
        from app.modules.agents.workflow.tools.tool_registry import ToolRegistry
        _tool_registry = ToolRegistry()
    return _tool_registry


def get_tool_executor(
    registry: Any = Depends(get_tool_registry)
) -> Any:
    """Dependency injector to retrieve the ToolExecutor instance."""
    global _tool_executor
    if isinstance(registry, DependsClass):
        registry = get_tool_registry()
    if _tool_executor is None:
        from app.modules.agents.workflow.tools.tool_executor import ToolExecutor
        _tool_executor = ToolExecutor(registry=registry)
    return _tool_executor


def get_workflow_engine(
    agent_registry: AgentRegistry = Depends(get_agent_registry),
    tool_registry: Any = Depends(get_tool_registry),
    tool_executor: Any = Depends(get_tool_executor),
    memory_manager: Any = Depends(get_memory_manager)
) -> Any:
    """Dependency injector to retrieve the WorkflowEngine instance."""
    global _workflow_engine
    if isinstance(agent_registry, DependsClass):
        agent_registry = get_agent_registry()
    if isinstance(tool_registry, DependsClass):
        tool_registry = get_tool_registry()
    if isinstance(tool_executor, DependsClass):
        tool_executor = get_tool_executor()
    if isinstance(memory_manager, DependsClass):
        memory_manager = get_memory_manager()

    if _workflow_engine is None:
        from app.modules.agents.workflow.workflow_engine import WorkflowEngine
        _workflow_engine = WorkflowEngine(
            agent_registry=agent_registry,
            tool_registry=tool_registry,
            tool_executor=tool_executor,
            memory_manager=memory_manager
        )
    return _workflow_engine


def get_agent_factory(
    ai_service: AIService = Depends(get_ai_service),
    rag_orchestrator: RAGOrchestrator = Depends(get_rag_orchestrator),
    config: AgentConfig = Depends(get_agent_config)
) -> AgentFactory:
    """Dependency injector to retrieve the AgentFactory instance."""
    global _agent_factory
    if isinstance(ai_service, DependsClass):
        ai_service = get_ai_service()
    if isinstance(rag_orchestrator, DependsClass):
        rag_orchestrator = get_rag_orchestrator()
    if isinstance(config, DependsClass):
        config = get_agent_config()

    if _agent_factory is None:
        mem = get_memory_manager()
        exec_t = get_tool_executor()
        _agent_factory = AgentFactory(
            ai_service=ai_service,
            rag_orchestrator=rag_orchestrator,
            config=config,
            memory_manager=mem,
            agent_registry=_agent_registry,
            tool_executor=exec_t
        )
    return _agent_factory


def get_agent_orchestrator(
    registry: AgentRegistry = Depends(get_agent_registry),
    memory: SharedMemory = Depends(get_shared_memory),
    event_bus: AgentEventBus = Depends(get_agent_event_bus),
    config: AgentConfig = Depends(get_agent_config),
    memory_manager: Any = Depends(get_memory_manager),
    tool_registry: Any = Depends(get_tool_registry),
    tool_executor: Any = Depends(get_tool_executor),
    workflow_engine: Any = Depends(get_workflow_engine)
) -> AgentOrchestrator:
    """Dependency injector to retrieve the AgentOrchestrator instance."""
    global _agent_orchestrator
    if isinstance(registry, DependsClass):
        registry = get_agent_registry()
    if isinstance(memory, DependsClass):
        memory = get_shared_memory()
    if isinstance(event_bus, DependsClass):
        event_bus = get_agent_event_bus()
    if isinstance(config, DependsClass):
        config = get_agent_config()
    if isinstance(memory_manager, DependsClass):
        memory_manager = get_memory_manager()
    if isinstance(tool_registry, DependsClass):
        tool_registry = get_tool_registry()
    if isinstance(tool_executor, DependsClass):
        tool_executor = get_tool_executor()
    if isinstance(workflow_engine, DependsClass):
        workflow_engine = get_workflow_engine()

    if _agent_orchestrator is None:
        # Trigger initialization and wrapping of all platform services
        get_analytics_service()
        _agent_orchestrator = AgentOrchestrator(
            registry=registry,
            memory=memory,
            event_bus=event_bus,
            config=config,
            memory_manager=memory_manager,
            tool_registry=tool_registry,
            tool_executor=tool_executor,
            workflow_engine=workflow_engine
        )
    return _agent_orchestrator


def get_analytics_service(
    agent_registry: AgentRegistry = Depends(get_agent_registry),
    memory_manager: Any = Depends(get_memory_manager)
) -> Any:
    """Dependency injector to retrieve the AgentAnalyticsService instance."""
    global _analytics_service
    if isinstance(agent_registry, DependsClass):
        agent_registry = get_agent_registry()
    if isinstance(memory_manager, DependsClass):
        memory_manager = get_memory_manager()

    if _analytics_service is None:
        import time
        from app.modules.agents.analytics.service import AgentAnalyticsService, register_ai_token_tracker
        _analytics_service = AgentAnalyticsService(
            agent_registry=agent_registry,
            memory_manager=memory_manager
        )
        register_ai_token_tracker()

        # Wrap ToolExecutor class execution
        from app.modules.agents.workflow.tools.tool_executor import ToolExecutor
        if not hasattr(ToolExecutor, "_analytics_patched"):
            original_execute_tool = ToolExecutor.execute_tool
            async def wrapped_execute_tool(self, request, context):
                async def bound_exec(req, ctx):
                    return await original_execute_tool(self, req, ctx)
                return await _analytics_service.execute_tool_with_telemetry(request, context, bound_exec)
            ToolExecutor.original_execute_tool = original_execute_tool
            ToolExecutor.execute_tool = wrapped_execute_tool
            ToolExecutor._analytics_patched = True

        # Wrap WorkflowExecutor class execution
        from app.modules.agents.workflow.workflow_executor import WorkflowExecutor
        if not hasattr(WorkflowExecutor, "_analytics_patched"):
            original_execute_wf = WorkflowExecutor.execute
            async def wrapped_execute_wf(self, workflow, context):
                from app.modules.agents.analytics.service import _workflow_step_durations
                token = _workflow_step_durations.set({})
                async def bound_exec(wf, ctx):
                    return await original_execute_wf(self, wf, ctx)
                try:
                    return await _analytics_service.execute_workflow_with_telemetry(workflow, context, bound_exec)
                finally:
                    _workflow_step_durations.reset(token)
            WorkflowExecutor.original_execute = original_execute_wf
            WorkflowExecutor.execute = wrapped_execute_wf

            original_execute_step = WorkflowExecutor._execute_step
            async def wrapped_execute_step(self, step, workflow, session_id, user_id):
                step_start = time.perf_counter()
                try:
                    await original_execute_step(self, step, workflow, session_id, user_id)
                finally:
                    duration = (time.perf_counter() - step_start) * 1000
                    from app.modules.agents.analytics.service import _workflow_step_durations
                    durations = _workflow_step_durations.get()
                    if durations is not None:
                        durations[step.step_id] = duration
            WorkflowExecutor._execute_step = wrapped_execute_step
            
            WorkflowExecutor._analytics_patched = True

    return _analytics_service

