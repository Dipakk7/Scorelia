import uuid
import structlog
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.enums import InterviewStatus
from app.interview.crud.crud import InterviewCRUD
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.schemas import InterviewSessionCreate
from app.interview.services.context import InterviewContext
from app.interview.services.ai_service import InterviewAIService, AnswerEvaluationResponse
from app.interview.metrics import interview_metrics

logger = structlog.get_logger()

class InterviewService:
    """Service layer coordinating interview session lifecycles, context loading, and AI integrations."""

    def __init__(self, db: Session, interview_ai_service: InterviewAIService):
        self.db = db
        self.interview_ai_service = interview_ai_service

    async def create_session(
        self,
        user_id: uuid.UUID,
        request: InterviewSessionCreate
    ) -> InterviewSession:
        """Create a new interview session record in the database."""
        # Use default provider configuration settings
        provider_name = settings.AI_PROVIDER
        model_name = settings.OLLAMA_MODEL
        prompt_version = settings.INTERVIEW_PROMPT_VERSION

        db_session = InterviewCRUD.create_session(
            db=self.db,
            user_id=user_id,
            schema=request,
            status=InterviewStatus.PENDING.value,
            provider=provider_name,
            model=model_name,
            prompt_version=prompt_version
        )

        # Track metrics
        interview_metrics.record_session_created(str(db_session.id))

        # Privacy-focused auditing (No personal info or resume contents logged)
        logger.info(
            "interview_session_created",
            session_id=str(db_session.id),
            user_id=str(user_id),
            interview_type=db_session.interview_type,
            difficulty=db_session.difficulty,
            provider=provider_name,
            model=model_name,
            prompt_version=prompt_version
        )
        return db_session

    async def get_session(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID
    ) -> Optional[InterviewSession]:
        """Fetch a specific interview session and check ownership."""
        session = InterviewCRUD.get_session(self.db, session_id, user_id)
        if not session:
            logger.warning(
                "interview_session_not_found",
                session_id=str(session_id),
                user_id=str(user_id)
            )
            return None
        
        # Track metrics
        interview_metrics.record_session_loaded(str(session_id))

        logger.info(
            "interview_session_retrieved",
            session_id=str(session_id),
            user_id=str(user_id)
        )
        return session

    async def list_sessions(self, user_id: uuid.UUID) -> List[InterviewSession]:
        """Retrieve interview session history for a user."""
        sessions = InterviewCRUD.list_sessions(self.db, user_id)
        logger.info(
            "interview_sessions_listed",
            user_id=str(user_id),
            count=len(sessions)
        )
        return sessions

    async def delete_session(self, session_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete an interview session record."""
        session = InterviewCRUD.get_session(self.db, session_id, user_id)
        if not session:
            logger.warning(
                "interview_session_not_found_for_deletion",
                session_id=str(session_id),
                user_id=str(user_id)
            )
            return False

        success = InterviewCRUD.delete_session(self.db, session)
        
        # Track metrics
        interview_metrics.record_session_deleted(str(session_id))

        logger.info(
            "interview_session_deleted",
            session_id=str(session_id),
            user_id=str(user_id)
        )
        return success

    async def build_context(
        self,
        user_id: uuid.UUID,
        resume_id: Optional[uuid.UUID] = None,
        job_id: Optional[uuid.UUID] = None
    ) -> InterviewContext:
        """Assemble relevant historical data to prepare for the interview session."""
        context = await InterviewContext.build(
            db=self.db,
            user_id=user_id,
            resume_id=resume_id,
            job_id=job_id
        )

        # Track metrics
        interview_metrics.record_context_loaded(str(user_id), str(resume_id) if resume_id else "None")

        # Privacy constraints: NO raw resume contents, prompt text, or user personal details are logged
        logger.info(
            "interview_context_built",
            user_id=str(user_id),
            resume_id=str(resume_id) if resume_id else None,
            job_id=str(job_id) if job_id else None,
            has_review=bool(context.resume_review),
            has_rewrite=bool(context.resume_rewrite),
            has_optimization=bool(context.resume_optimization)
        )
        return context

    async def generate_session_questions(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID,
        mode: str = "entire",
        count: Optional[int] = None
    ) -> List[InterviewTurn]:
        """Generate interview questions for a session and save them to the database."""
        session = await self.get_session(session_id, user_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found.")

        # Avoid duplicate generations (Task 11)
        if session.turns and (session.session_metadata or {}).get("questions"):
            logger.info("session_questions_already_generated_skipping", session_id=str(session_id))
            return session.turns

        # Check for empty resume (Task 10 & 6)
        if session.interview_type == "RESUME_BASED" and not session.resume_id:
            raise ValueError("Resume ID is required for RESUME_BASED interview type.")

        if session.resume_id:
            from app.models.resume import Resume
            resume = self.db.query(Resume).filter(Resume.id == session.resume_id).first()
            if not resume:
                raise ValueError("Associated resume not found.")
            pdata = resume.parsed_data or {}
            skills = pdata.get("skills", [])
            experience = pdata.get("experience", [])
            if not skills and not experience:
                raise ValueError("Resume content is empty or lacks parsed details.")

        # Build context
        context = await self.build_context(user_id, session.resume_id, session.job_id)

        # Determine generation count
        gen_count = count
        if not gen_count:
            if mode == "first":
                gen_count = 1
            elif mode == "entire":
                gen_count = session.total_questions
            elif mode == "batch":
                gen_count = session.total_questions
            else:
                gen_count = 1

        # Call InterviewAIService.generate_questions
        questions, ai_response = await self.interview_ai_service.generate_questions(
            session=session,
            context=context,
            count=gen_count
        )

        # Update Session with AI metadata
        session.provider = ai_response.provider
        session.model = ai_response.model
        session.prompt_version = ai_response.prompt_version
        session.status = InterviewStatus.IN_PROGRESS.value

        # Persist generated questions in session_metadata
        if not session.session_metadata:
            session.session_metadata = {}
        
        serialized_questions = []
        for q in questions:
            serialized_questions.append({
                "question_id": q.question_id,
                "category": q.category,
                "difficulty": q.difficulty,
                "question": q.question,
                "expected_topics": q.expected_topics,
                "recommended_answer_framework": q.recommended_answer_framework,
                "estimated_time_seconds": q.estimated_time_seconds,
                "evaluation_weight": q.evaluation_weight,
                "followup_possible": q.followup_possible
            })
        
        session.session_metadata["questions"] = serialized_questions
        
        session.session_metadata["generation_metadata"] = {
            "prompt_version": ai_response.prompt_version,
            "provider": ai_response.provider,
            "model": ai_response.model,
            "latency_ms": ai_response.latency_ms,
            "generation_mode": mode,
            "question_count": len(questions)
        }

        created_turns = []
        for q in questions:
            cat = q.category.upper().strip()
            from app.core.enums import QuestionCategory
            supported_categories = [e.value for e in QuestionCategory]
            if cat not in supported_categories:
                if "TECH" in cat:
                    cat = "TECHNICAL"
                elif "BEHAV" in cat:
                    cat = "BEHAVIORAL"
                elif "SIT" in cat:
                    cat = "SITUATIONAL"
                elif "BACK" in cat:
                    cat = "BACKGROUND"
                else:
                    cat = "ROLE_SPECIFIC"

            db_turn = InterviewCRUD.create_turn(
                db=self.db,
                session_id=session.id,
                question_number=q.question_id,
                question_text=q.question,
                question_category=cat
            )
            created_turns.append(db_turn)

        self.db.commit()
        
        logger.info(
            "interview_questions_generated",
            session_id=str(session.id),
            user_id=str(user_id),
            latency_ms=ai_response.latency_ms,
            provider=ai_response.provider,
            model=ai_response.model,
            prompt_version=ai_response.prompt_version,
            generation_mode=mode,
            question_count=len(questions)
        )

        return created_turns

    async def clear_session_questions(self, session_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Clear all generated questions/turns for a session, resetting it to PENDING."""
        session = await self.get_session(session_id, user_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found.")

        # Delete turns
        self.db.query(InterviewTurn).filter(InterviewTurn.session_id == session.id).delete()
        
        # Reset session properties
        session.status = InterviewStatus.PENDING.value
        session.current_question = 1
        if session.session_metadata:
            session.session_metadata.pop("questions", None)
            session.session_metadata.pop("generation_metadata", None)
        
        self.db.commit()
        
        logger.info(
            "interview_session_questions_cleared",
            session_id=str(session_id),
            user_id=str(user_id)
        )
        return True

    async def evaluate_turn_answer(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID,
        answer_text: str
    ) -> AnswerEvaluationResponse:
        """Submit and evaluate a candidate's answer for the current question in the session."""
        session = await self.get_session(session_id, user_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found.")

        # Reject empty answer
        if not answer_text or not answer_text.strip():
            raise ValueError("Answer cannot be empty.")

        # Find the active turn matching session.current_question
        active_turn = None
        for turn in session.turns:
            if turn.question_number == session.current_question:
                active_turn = turn
                break

        # Reject missing question
        if not active_turn:
            raise ValueError(f"No active question found for question number {session.current_question}.")

        # Avoid duplicate evaluations (Task 12)
        if active_turn.score is not None and active_turn.scores:
            logger.info(
                "turn_answer_already_evaluated_returning_cached",
                session_id=str(session_id),
                question_number=active_turn.question_number
            )
            # Reconstruct response from database columns
            return AnswerEvaluationResponse(
                overall_score=active_turn.score,
                technical_score=(active_turn.scores or {}).get("technical_score", 0),
                communication_score=(active_turn.scores or {}).get("communication_score", 0),
                grammar_score=(active_turn.scores or {}).get("grammar_score", 0),
                confidence_score=(active_turn.scores or {}).get("confidence_score", 0),
                professionalism_score=(active_turn.scores or {}).get("professionalism_score", 0),
                star_score=(active_turn.scores or {}).get("star_score", 0),
                strengths=(active_turn.evaluation_metadata or {}).get("strengths", []),
                weaknesses=(active_turn.evaluation_metadata or {}).get("weaknesses", []),
                missing_topics=(active_turn.evaluation_metadata or {}).get("missing_topics", []),
                improvements=(active_turn.evaluation_metadata or {}).get("improvements", []),
                followup_questions=(active_turn.evaluation_metadata or {}).get("followup_questions", []),
                summary=active_turn.feedback or ""
            )

        # Build context
        context = await self.build_context(user_id, session.resume_id, session.job_id)

        # Execute evaluation
        evaluation, ai_response = await self.interview_ai_service.evaluate_answer(
            session=session,
            turn=active_turn,
            context=context,
            answer_text=answer_text
        )

        # Update database fields
        active_turn.answer_text = answer_text
        active_turn.feedback = evaluation.summary
        active_turn.score = evaluation.overall_score

        # Save Task 8 metrics and metadata
        active_turn.prompt_version = ai_response.prompt_version
        active_turn.provider = ai_response.provider
        active_turn.model = ai_response.model
        active_turn.latency = ai_response.latency_ms

        active_turn.scores = {
            "overall_score": evaluation.overall_score,
            "technical_score": evaluation.technical_score,
            "communication_score": evaluation.communication_score,
            "grammar_score": evaluation.grammar_score,
            "confidence_score": evaluation.confidence_score,
            "professionalism_score": evaluation.professionalism_score,
            "star_score": evaluation.star_score
        }

        active_turn.evaluation_metadata = {
            "strengths": evaluation.strengths,
            "weaknesses": evaluation.weaknesses,
            "missing_topics": evaluation.missing_topics,
            "improvements": evaluation.improvements,
            "followup_questions": evaluation.followup_questions,
            "summary": evaluation.summary,
            "rubric_scores": evaluation.rubric_scores,
            "star_analysis": evaluation.star_analysis,
            "quality_analysis": evaluation.quality_analysis,
            "followup_metadata": evaluation.followup_metadata
        }

        # Advance session question progression
        session.current_question += 1
        if session.current_question > session.total_questions:
            session.status = InterviewStatus.COMPLETED.value
        else:
            session.status = InterviewStatus.IN_PROGRESS.value

        self.db.commit()

        # Auditing & logging (Privacy-focused: no answer text or personal info)
        logger.info(
            "interview_answer_evaluated",
            session_id=str(session.id),
            turn_id=str(active_turn.id),
            question_number=active_turn.question_number,
            overall_score=evaluation.overall_score,
            provider=ai_response.provider,
            model=ai_response.model,
            prompt_version=ai_response.prompt_version,
            latency_ms=ai_response.latency_ms
        )

        return AnswerEvaluationResponse(
            overall_score=evaluation.overall_score,
            technical_score=evaluation.technical_score,
            communication_score=evaluation.communication_score,
            grammar_score=evaluation.grammar_score,
            confidence_score=evaluation.confidence_score,
            professionalism_score=evaluation.professionalism_score,
            star_score=evaluation.star_score,
            strengths=evaluation.strengths,
            weaknesses=evaluation.weaknesses,
            missing_topics=evaluation.missing_topics,
            improvements=evaluation.improvements,
            followup_questions=evaluation.followup_questions,
            summary=evaluation.summary
        )

    async def get_session_evaluation(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID
    ) -> dict:
        """Fetch evaluation summaries for all answered turns in the session."""
        session = await self.get_session(session_id, user_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found.")

        evaluations = []
        total_score = 0
        evaluated_count = 0

        # Sort turns by question number
        turns = sorted(session.turns, key=lambda t: t.question_number)

        for turn in turns:
            if turn.score is not None and turn.scores:
                evaluated_count += 1
                total_score += turn.score
                evaluations.append({
                    "question_number": turn.question_number,
                    "question_text": turn.question_text,
                    "answer_text": turn.answer_text,
                    "overall_score": turn.score,
                    "technical_score": (turn.scores or {}).get("technical_score", 0),
                    "communication_score": (turn.scores or {}).get("communication_score", 0),
                    "grammar_score": (turn.scores or {}).get("grammar_score", 0),
                    "confidence_score": (turn.scores or {}).get("confidence_score", 0),
                    "professionalism_score": (turn.scores or {}).get("professionalism_score", 0),
                    "star_score": (turn.scores or {}).get("star_score", 0),
                    "strengths": (turn.evaluation_metadata or {}).get("strengths", []),
                    "weaknesses": (turn.evaluation_metadata or {}).get("weaknesses", []),
                    "missing_topics": (turn.evaluation_metadata or {}).get("missing_topics", []),
                    "improvements": (turn.evaluation_metadata or {}).get("improvements", []),
                    "followup_questions": (turn.evaluation_metadata or {}).get("followup_questions", []),
                    "summary": turn.feedback or ""
                })

        avg_score = int(total_score / evaluated_count) if evaluated_count > 0 else 0

        return {
            "session_id": str(session.id),
            "overall_score": avg_score,
            "evaluations": evaluations
        }

    async def clear_session_evaluation(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID
    ) -> bool:
        """Reset/delete all evaluations and answers in the session, resetting progress."""
        session = await self.get_session(session_id, user_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found.")

        for turn in session.turns:
            turn.answer_text = None
            turn.feedback = None
            turn.score = None
            turn.prompt_version = None
            turn.provider = None
            turn.model = None
            turn.latency = None
            turn.scores = None
            turn.evaluation_metadata = None

        session.current_question = 1
        session.status = InterviewStatus.IN_PROGRESS.value if session.turns else InterviewStatus.PENDING.value
        self.db.commit()

        logger.info(
            "interview_session_evaluations_cleared",
            session_id=str(session_id),
            user_id=str(user_id)
        )
        return True
