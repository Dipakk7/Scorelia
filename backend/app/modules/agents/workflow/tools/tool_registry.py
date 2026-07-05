# app/modules/agents/workflow/tools/tool_registry.py

import uuid
from typing import Dict, Any, List, Optional, Callable
from app.modules.agents.workflow.tools.tool_models import ToolMetadata, ToolParameter
from app.core.db import SessionLocal

# Import agent services
from app.modules.agents.resume.service import ResumeAgentService
from app.modules.agents.ats.service import ATSAgentService
from app.modules.agents.job.service import JobMatchAgentService
from app.modules.agents.cover_letter.service import CoverLetterAgentService
from app.modules.agents.interview.service import InterviewAgentService
from app.modules.agents.career_coach.service import CareerCoachAgentService
from app.modules.agents.learning.service import LearningAgentService
from app.modules.rag.generation.models import RAGRequest
from app.analytics.service import AnalyticsService

class ToolRegistry:
    """Registry maintaining metadata and execution hooks for all available agent tools."""

    def __init__(self):
        self._tools: Dict[str, ToolMetadata] = {}
        self._executors: Dict[str, Callable] = {}
        self._register_default_tools()

    def register(self, metadata: ToolMetadata, executor: Callable) -> None:
        """Registers a new tool metadata and executor."""
        self._tools[metadata.name] = metadata
        self._executors[metadata.name] = executor

    def get_tool(self, name: str) -> Optional[ToolMetadata]:
        """Gets tool metadata by name."""
        return self._tools.get(name)

    def get_executor(self, name: str) -> Optional[Callable]:
        """Gets tool executor function by name."""
        return self._executors.get(name)

    def list_tools(self) -> List[ToolMetadata]:
        """Lists all registered tools."""
        return list(self._tools.values())

    def _register_default_tools(self) -> None:
        # 1. Resume Tool
        resume_meta = ToolMetadata(
            name="resume_tool",
            description="Performs operations on a resume: review, rewrite, and optimization.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action to perform: review, rewrite, optimize, summary, suggestions, score, parse, feedback, improvement_plan"),
                ToolParameter(name="resume_id", type="string", description="Target resume ID (UUID string)"),
                ToolParameter(name="job_description", type="string", description="Optional job description", required=False),
                ToolParameter(name="section_name", type="string", description="Target section to rewrite", required=False),
                ToolParameter(name="mode", type="string", description="Execution mode (STANDARD/TAILORED)", required=False, default="STANDARD"),
            ]
        )
        self.register(resume_meta, self._execute_resume_tool)

        # 2. ATS Tool
        ats_meta = ToolMetadata(
            name="ats_tool",
            description="Performs ATS compliance checks, scoring, and analysis.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action: ats_review, ats_score, ats_improve, ats_keyword_analysis, ats_missing_skills, ats_readiness, ats_recommendations"),
                ToolParameter(name="resume_id", type="string", description="Resume ID"),
                ToolParameter(name="job_description", type="string", description="Job Description (required for review/keyword analysis)", required=False),
            ]
        )
        self.register(ats_meta, self._execute_ats_tool)

        # 3. Job Match Tool
        job_match_meta = ToolMetadata(
            name="job_match_tool",
            description="Evaluates resume matching against job descriptions, identifying gaps.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action: job_match, job_matching, match_score, job_analyze, skill_gap, missing_keywords, missing_skills, education_match, experience_match, certification_match, job_recommend, job_recommendations, resume_vs_jd_analysis"),
                ToolParameter(name="resume_id", type="string", description="Resume ID"),
                ToolParameter(name="job_description", type="string", description="Job Description text", required=False),
            ]
        )
        self.register(job_match_meta, self._execute_job_match_tool)

        # 4. Career Tool
        career_meta = ToolMetadata(
            name="career_tool",
            description="Generates personalized career roadmaps and progress plans.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action: roadmap, weekly_plan, monthly_plan, analyze_progress, status"),
                ToolParameter(name="target_role", type="string", description="Target role name"),
                ToolParameter(name="experience_level", type="string", description="Experience level (e.g. Entry, Mid, Senior)"),
                ToolParameter(name="resume_id", type="string", description="Optional Resume ID", required=False),
            ]
        )
        self.register(career_meta, self._execute_career_tool)

        # 5. Learning Tool
        learning_meta = ToolMetadata(
            name="learning_tool",
            description="Recommends courses, certifications, and studies.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action: recommend, path, courses, certifications, study_plan"),
                ToolParameter(name="target_role", type="string", description="Target role name"),
                ToolParameter(name="resume_id", type="string", description="Optional Resume ID", required=False),
                ToolParameter(name="skills", type="array", description="Optional list of skills", required=False),
            ]
        )
        self.register(learning_meta, self._execute_learning_tool)

        # 6. Interview Tool
        interview_meta = ToolMetadata(
            name="interview_tool",
            description="Manages interview mock generation and evaluation.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action: questions, evaluate, setup_session"),
                ToolParameter(name="session_id", type="string", description="Interview Session ID", required=False),
                ToolParameter(name="count", type="integer", description="Number of questions", required=False, default=1),
            ]
        )
        self.register(interview_meta, self._execute_interview_tool)

        # 7. Cover Letter Tool
        cover_letter_meta = ToolMetadata(
            name="cover_letter_tool",
            description="Creates and evaluates tailored cover letters.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action: generate, review, optimize"),
                ToolParameter(name="resume_id", type="string", description="Resume ID"),
                ToolParameter(name="company_name", type="string", description="Company Name"),
                ToolParameter(name="job_title", type="string", description="Job Title"),
                ToolParameter(name="job_description", type="string", description="Job Description text", required=False),
            ]
        )
        self.register(cover_letter_meta, self._execute_cover_letter_tool)

        # 8. RAG Tool
        rag_meta = ToolMetadata(
            name="rag_tool",
            description="Searches and retrieves context from internal RAG Vector Store.",
            parameters=[
                ToolParameter(name="query", type="string", description="Search query string"),
                ToolParameter(name="limit", type="integer", description="Max results", required=False, default=5),
            ]
        )
        self.register(rag_meta, self._execute_rag_tool)

        # 9. Analytics Tool
        analytics_meta = ToolMetadata(
            name="analytics_tool",
            description="Manages analytics metric logging and reporting.",
            parameters=[
                ToolParameter(name="action", type="string", description="Action: get_metrics, log_event"),
                ToolParameter(name="metric_name", type="string", description="Metric to record or view", required=False),
            ]
        )
        self.register(analytics_meta, self._execute_analytics_tool)

    # Tool executors implementation

    async def _execute_resume_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = ResumeAgentService(
            db=db,
            ai_service=context.get("ai_service"),
            rag_orchestrator=context.get("rag_orchestrator")
        )
        action = arguments.get("action")
        resume_id = uuid.UUID(arguments.get("resume_id"))
        user_id = uuid.UUID(context.get("user_id"))

        if action in ["review", "feedback", "improvement_plan"]:
            return await service.review(
                resume_id=resume_id,
                user_id=user_id,
                mode=arguments.get("mode", "STANDARD")
            )
        elif action in ["rewrite"]:
            return await service.rewrite(
                resume_id=resume_id,
                user_id=user_id,
                section_name=arguments.get("section_name"),
                job_description=arguments.get("job_description")
            )
        elif action in ["optimize"]:
            return await service.optimize(
                resume_id=resume_id,
                user_id=user_id,
                job_description=arguments.get("job_description")
            )
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _execute_ats_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = ATSAgentService(
            db=db,
            ai_service=context.get("ai_service"),
            rag_orchestrator=context.get("rag_orchestrator")
        )
        action = arguments.get("action")
        resume_id = uuid.UUID(arguments.get("resume_id"))
        user_id = uuid.UUID(context.get("user_id"))

        if action in ["ats_review", "ats_keyword_analysis", "ats_missing_skills", "ats_readiness", "ats_recommendations"]:
            res = await service.review(
                resume_id=resume_id,
                user_id=user_id,
                job_description=arguments.get("job_description")
            )
            if action == "ats_review":
                return res
            elif action == "ats_keyword_analysis":
                return {"keyword_analysis": res.get("keyword_analysis", [])}
            elif action == "ats_missing_skills":
                return {"missing_skills": res.get("missing_skills", [])}
            elif action == "ats_readiness":
                return {"ats_readiness": res.get("ats_readiness", "")}
            else:
                return {"recommendations": res.get("recommendations", [])}
        elif action == "ats_score":
            return await service.score(resume_id=resume_id, user_id=user_id)
        elif action == "ats_improve":
            return await service.improve(
                resume_id=resume_id,
                user_id=user_id,
                job_description=arguments.get("job_description")
            )
        else:
            raise ValueError(f"Unknown ATS action: {action}")

    async def _execute_job_match_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = JobMatchAgentService(
            db=db,
            ai_service=context.get("ai_service"),
            rag_orchestrator=context.get("rag_orchestrator")
        )
        action = arguments.get("action")
        resume_id = uuid.UUID(arguments.get("resume_id"))
        user_id = uuid.UUID(context.get("user_id"))
        jd = arguments.get("job_description")

        if action in ["job_match", "job_matching", "match_score"]:
            return await service.match(resume_id=resume_id, user_id=user_id, job_description=jd)
        elif action in ["job_analyze", "resume_vs_jd_analysis"]:
            return await service.analyze(resume_id=resume_id, user_id=user_id, job_description=jd)
        elif action in ["skill_gap", "missing_skills", "missing_keywords"]:
            return await service.skill_gap(resume_id=resume_id, user_id=user_id, job_description=jd)
        elif action in ["job_recommend", "job_recommendations"]:
            return await service.recommend_jobs(resume_id=resume_id, user_id=user_id)
        else:
            raise ValueError(f"Unknown Job Match action: {action}")

    async def _execute_career_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = CareerCoachAgentService(
            db=db,
            ai_service=context.get("ai_service"),
            rag_orchestrator=context.get("rag_orchestrator")
        )
        action = arguments.get("action")
        user_id = uuid.UUID(context.get("user_id"))
        resume_id = uuid.UUID(arguments.get("resume_id")) if arguments.get("resume_id") else None

        if action == "roadmap":
            return await service.generate_roadmap(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                experience_level=arguments.get("experience_level"),
                resume_id=resume_id
            )
        elif action == "weekly_plan":
            # Just generate some weekly tasks mock/sub-call
            return await service.generate_weekly_plan(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                roadmap_id=uuid.UUID(arguments.get("roadmap_id")) if arguments.get("roadmap_id") else uuid.uuid4()
            )
        elif action == "monthly_plan":
            return await service.generate_monthly_plan(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                roadmap_id=uuid.UUID(arguments.get("roadmap_id")) if arguments.get("roadmap_id") else uuid.uuid4()
            )
        else:
            raise ValueError(f"Unknown Career action: {action}")

    async def _execute_learning_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = LearningAgentService(
            db=db,
            ai_service=context.get("ai_service"),
            rag_orchestrator=context.get("rag_orchestrator")
        )
        action = arguments.get("action")
        user_id = uuid.UUID(context.get("user_id"))
        resume_id = uuid.UUID(arguments.get("resume_id")) if arguments.get("resume_id") else None

        if action == "recommend":
            return await service.recommend(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                resume_id=resume_id,
                skills=arguments.get("skills")
            )
        elif action == "path":
            return await service.path(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                resume_id=resume_id,
                skills=arguments.get("skills")
            )
        elif action == "courses":
            return await service.courses(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                skills=arguments.get("skills")
            )
        elif action == "certifications":
            return await service.certifications(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                skills=arguments.get("skills")
            )
        elif action == "study_plan":
            return await service.study_plan(
                user_id=user_id,
                target_role=arguments.get("target_role"),
                skills=arguments.get("skills")
            )
        else:
            raise ValueError(f"Unknown Learning action: {action}")

    async def _execute_interview_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = InterviewAgentService(
            db=db,
            ai_service=context.get("ai_service"),
            rag_orchestrator=context.get("rag_orchestrator")
        )
        action = arguments.get("action")
        user_id = uuid.UUID(context.get("user_id"))

        if action == "questions":
            sess_id = uuid.UUID(arguments.get("session_id"))
            return await service.questions(
                session_id=sess_id,
                user_id=user_id,
                count=arguments.get("count", 1)
            )
        elif action == "evaluate":
            sess_id = uuid.UUID(arguments.get("session_id"))
            return await service.evaluate(
                session_id=sess_id,
                user_id=user_id,
                question_id=uuid.UUID(arguments.get("question_id")),
                user_response=arguments.get("user_response")
            )
        else:
            raise ValueError(f"Unknown Interview action: {action}")

    async def _execute_cover_letter_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = CoverLetterAgentService(
            db=db,
            ai_service=context.get("ai_service"),
            rag_orchestrator=context.get("rag_orchestrator")
        )
        action = arguments.get("action")
        user_id = uuid.UUID(context.get("user_id"))
        resume_id = uuid.UUID(arguments.get("resume_id"))

        if action == "generate":
            return await service.generate(
                resume_id=resume_id,
                user_id=user_id,
                company_name=arguments.get("company_name"),
                job_title=arguments.get("job_title"),
                job_description=arguments.get("job_description")
            )
        elif action == "review":
            return await service.review(
                resume_id=resume_id,
                user_id=user_id,
                cover_letter_id=uuid.UUID(arguments.get("cover_letter_id")) if arguments.get("cover_letter_id") else uuid.uuid4()
            )
        else:
            raise ValueError(f"Unknown Cover Letter action: {action}")

    async def _execute_rag_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        rag_orchestrator = context.get("rag_orchestrator")
        if not rag_orchestrator:
            return {"error": "RAG orchestrator not configured"}
        
        query = arguments.get("query")
        limit = arguments.get("limit", 5)
        # Construct RAG request and search
        req = RAGRequest(query=query, limit=limit)
        results = await rag_orchestrator.retrieve(req)
        return {"results": [res.model_dump() for res in results]}

    async def _execute_analytics_tool(self, arguments: Dict[str, Any], context: Dict[str, Any]) -> Any:
        db = context.get("db") or SessionLocal()
        service = AnalyticsService(db=db)
        action = arguments.get("action")
        user_id = uuid.UUID(context.get("user_id"))

        if action == "get_metrics":
            return await service.get_dashboard_analytics(user_id=user_id)
        else:
            return {"status": "event logged"}
