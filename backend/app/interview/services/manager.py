import uuid
import random
from datetime import datetime, timezone
import structlog
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.enums import InterviewDifficulty
from app.interview.crud.crud import InterviewCRUD
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.services.service import InterviewService
from app.interview.services.ai_service import AnswerEvaluationResponse, AIEvaluationOutput
from app.interview.services.context import InterviewContext
from app.interview.metrics import interview_metrics

logger = structlog.get_logger()

VALID_TRANSITIONS = {
    "CREATED": ["READY", "CANCELLED", "FAILED"],
    "READY": ["QUESTION_GENERATED", "CANCELLED", "FAILED"],
    "QUESTION_GENERATED": ["WAITING_FOR_ANSWER", "CANCELLED", "FAILED"],
    "WAITING_FOR_ANSWER": ["ANSWER_RECEIVED", "CANCELLED", "FAILED"],
    "ANSWER_RECEIVED": ["EVALUATED", "CANCELLED", "FAILED"],
    "EVALUATED": ["NEXT_QUESTION", "COMPLETED", "CANCELLED", "FAILED"],
    "NEXT_QUESTION": ["QUESTION_GENERATED", "COMPLETED", "CANCELLED", "FAILED"],
    "COMPLETED": ["CREATED", "READY"],
    "CANCELLED": ["CREATED", "READY"],
    "FAILED": ["CREATED", "READY"]
}

CATEGORY_TO_PROMPT = {
    "BACKGROUND": "resume_based",
    "TECHNICAL": "technical",
    "BEHAVIORAL": "behavioral",
    "SITUATIONAL": "behavioral",
    "ROLE_SPECIFIC": "technical",
    "HR": "hr"
}

class InterviewSessionManager:
    """Manages the interview session state machine, timers, adaptive flow, sequencing, and follow-ups."""

    def __init__(self, db: Session, interview_service: InterviewService):
        self.db = db
        self.service = interview_service

    def _get_session_or_raise(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        session = InterviewCRUD.get_session(self.db, session_id, user_id)
        if not session:
            logger.warning("interview_session_not_found", session_id=str(session_id), user_id=str(user_id))
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Interview session with ID '{session_id}' not found."
            )
        return session

    def _transition_state(self, session: InterviewSession, target_state: str) -> None:
        current = session.status.upper().strip() if session.status else "CREATED"
        if current == "PENDING":
            current = "CREATED"
        elif current == "IN_PROGRESS":
            # Map IN_PROGRESS back to WAITING_FOR_ANSWER or EVALUATED based on active turns
            active_turn = next((t for t in session.turns if t.question_number == session.current_question), None)
            if active_turn:
                if active_turn.answer_text is not None and active_turn.score is not None:
                    current = "EVALUATED"
                elif active_turn.answer_text is not None:
                    current = "ANSWER_RECEIVED"
                else:
                    current = "WAITING_FOR_ANSWER"
            else:
                current = "READY"

        if current == target_state:
            return

        # Restarts bypass standard restrictions
        is_restart = target_state in ("CREATED", "READY") and current in ("COMPLETED", "CANCELLED", "FAILED")
        
        # Force completions or cancels from any active state bypass standard restrictions
        is_force_action = target_state in ("COMPLETED", "CANCELLED") and current not in ("COMPLETED", "CANCELLED", "FAILED")

        allowed = VALID_TRANSITIONS.get(current, [])
        if target_state not in allowed and not is_restart and not is_force_action:
            logger.warning(
                "invalid_state_transition_attempted",
                session_id=str(session.id),
                from_state=current,
                to_state=target_state
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid state transition from {current} to {target_state}."
            )

        session.status = target_state
        logger.info(
            "interview_session_state_changed",
            session_id=str(session.id),
            old_state=current,
            new_state=target_state
        )

    def _determine_question_sequence(self, total_questions: int, interview_type: str) -> list[str]:
        itype = interview_type.upper().strip()
        if itype == "BEHAVIORAL":
            return ["BEHAVIORAL"] * total_questions
        elif itype == "TECHNICAL":
            return ["TECHNICAL"] * total_questions
        elif itype in ("HR", "FIT"):
            return ["HR"] * total_questions
        elif itype == "RESUME_BASED":
            return ["BACKGROUND"] * total_questions
        else:  # MIXED
            base_sequence = ["BACKGROUND", "BEHAVIORAL", "TECHNICAL", "SITUATIONAL", "HR"]
            return [base_sequence[i % len(base_sequence)] for i in range(total_questions)]

    async def start_interview(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        """Initialize session timers, sequence questions, and generate the first question."""
        session = self._get_session_or_raise(session_id, user_id)
        
        # Verify not already completed
        if session.status in ("COMPLETED", "CANCELLED", "FAILED"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot start a closed or modified session."
            )

        self._transition_state(session, "READY")

        # Pre-sequence questions (Task 4 & 8)
        sequence = self._determine_question_sequence(session.total_questions, session.interview_type)
        if session.session_metadata and session.session_metadata.get("randomize_sections"):
            random.shuffle(sequence)

        # Generate first question
        self._transition_state(session, "QUESTION_GENERATED")
        
        # Resolve difficulty
        difficulty = session.difficulty
        if difficulty == "ADAPTIVE":
            difficulty = "MEDIUM"

        context = await self.service.build_context(user_id, session.resume_id, session.job_id)
        prompt_name = CATEGORY_TO_PROMPT.get(sequence[0], "behavioral")
        
        questions, ai_response = await self.service.interview_ai_service.generate_questions(
            session=session,
            context=context,
            count=1,
            prompt_name=prompt_name
        )

        if not questions:
            self._transition_state(session, "FAILED")
            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate the first question."
            )

        q = questions[0]
        db_turn = InterviewCRUD.create_turn(
            db=self.db,
            session_id=session.id,
            question_number=1,
            question_text=q.question,
            question_category=q.category.upper().strip()
        )
        
        # Initialize timing and question metadata using new dictionaries to trigger SQLAlchemy change detection
        now_str = datetime.now(timezone.utc).isoformat()
        session.session_metadata = {
            "original_total_questions": session.total_questions,
            "start_time": now_str,
            "is_paused": False,
            "total_paused_seconds": 0.0,
            "question_timers": {
                "1": {
                    "start_time": now_str
                }
            },
            "question_sequence": sequence,
            "questions": [{
                "question_id": 1,
                "category": q.category,
                "difficulty": difficulty,
                "question": q.question,
                "expected_topics": q.expected_topics,
                "recommended_answer_framework": q.recommended_answer_framework,
                "estimated_time_seconds": q.estimated_time_seconds,
                "evaluation_weight": q.evaluation_weight,
                "followup_possible": q.followup_possible
            }]
        }

        self._transition_state(session, "WAITING_FOR_ANSWER")
        self.db.commit()

        # Clean logging
        logger.info(
            "interview_session_started",
            session_id=str(session.id),
            provider=ai_response.provider,
            model=ai_response.model,
            difficulty=difficulty,
            latency_ms=ai_response.latency_ms
        )

        return session

    async def submit_answer(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID,
        answer_text: str
    ) -> AnswerEvaluationResponse:
        """Submit answer, validate transition, calculate scores, and update timers."""
        session = self._get_session_or_raise(session_id, user_id)

        # Basic validations (Task 10)
        if session.status in ("COMPLETED", "CANCELLED", "FAILED"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot modify a completed, cancelled, or failed session."
            )
        
        meta = dict(session.session_metadata or {})
        if meta.get("is_paused"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Session is paused. Resume before submitting answer."
            )

        active_turn = next((t for t in session.turns if t.question_number == session.current_question), None)
        if not active_turn:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Answer submitted before question was generated."
            )

        if active_turn.answer_text is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate answer submission for the current question."
            )

        self._transition_state(session, "ANSWER_RECEIVED")
        
        # Stop question timer and calculate response duration
        now_str = datetime.now(timezone.utc).isoformat()
        q_timers = dict(meta.get("question_timers", {}))
        q_timer = dict(q_timers.get(str(session.current_question), {}))
        if q_timer:
            q_timer["answer_time"] = now_str
            start_dt = datetime.fromisoformat(q_timer["start_time"])
            end_dt = datetime.fromisoformat(now_str)
            duration = (end_dt - start_dt).total_seconds()
            duration -= q_timer.get("total_paused_during_question", 0.0)
            q_timer["duration_seconds"] = max(0.0, duration)
            q_timers[str(session.current_question)] = q_timer

        # Re-assign session_metadata to trigger SQLAlchemy mutation detection
        meta["question_timers"] = q_timers
        session.session_metadata = meta
        
        # Call evaluation service
        context = await self.service.build_context(user_id, session.resume_id, session.job_id)
        
        # Prevent duplicate evaluations (Task 11)
        if active_turn.score is not None:
            self._transition_state(session, "EVALUATED")
            self.db.commit()
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

        evaluation, ai_response = await self.service.interview_ai_service.evaluate_answer(
            session=session,
            turn=active_turn,
            context=context,
            answer_text=answer_text
        )

        # Update database fields
        active_turn.answer_text = answer_text
        active_turn.feedback = evaluation.summary
        active_turn.score = evaluation.overall_score
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

        self._transition_state(session, "EVALUATED")
        self.db.commit()

        # Privacy-conscious logging
        logger.info(
            "interview_answer_evaluated",
            session_id=str(session.id),
            question_number=active_turn.question_number,
            latency=ai_response.latency_ms,
            provider=ai_response.provider,
            model=ai_response.model,
            difficulty=session.difficulty
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

    async def get_next_question(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewTurn:
        """Transitions state, resolves difficulty, decides follow-up, and generates next question."""
        session = self._get_session_or_raise(session_id, user_id)

        # Validate transition (Task 10)
        current = session.status.upper().strip() if session.status else "CREATED"
        if current == "PENDING":
            current = "CREATED"
        elif current == "IN_PROGRESS":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Next question requested before evaluation."
            )

        if current != "EVALUATED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot trigger next question from state '{current}'."
            )

        self._transition_state(session, "NEXT_QUESTION")

        # Find latest evaluated turn
        turns_sorted = sorted(session.turns, key=lambda t: t.question_number)
        latest_eval_turn = turns_sorted[-1] if turns_sorted else None
        if not latest_eval_turn or latest_eval_turn.score is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current question has not been evaluated."
            )

        # Determine if follow-up question is warranted (Task 7)
        ask_followup = False
        eval_meta = latest_eval_turn.evaluation_metadata or {}
        scores = latest_eval_turn.scores or {}

        # 1. AI Recommends follow-up
        ai_rec = bool(eval_meta.get("followup_questions")) or eval_meta.get("followup_metadata", {}).get("should_followup") is True
        
        # 2. STAR incomplete (for behavioral questions)
        star_incomplete = latest_eval_turn.question_category == "BEHAVIORAL" and (scores.get("star_score", 100) < 75 or eval_meta.get("star_analysis", {}).get("complete") is False)
        
        # 3. Technical incomplete
        tech_incomplete = latest_eval_turn.question_category == "TECHNICAL" and (scores.get("overall_score", 100) < 70 or len(eval_meta.get("missing_topics", [])) > 0)
        
        # 4. Clarification required
        clarification_req = eval_meta.get("quality_analysis", {}).get("requires_clarification") is True

        if ai_rec or star_incomplete or tech_incomplete or clarification_req:
            ask_followup = True

        # Check follow-up limits (Task 7)
        parent_num = latest_eval_turn.question_number
        if latest_eval_turn.question_category == "FOLLOWUP" or (latest_eval_turn.evaluation_metadata or {}).get("is_followup"):
            parent_num = (latest_eval_turn.evaluation_metadata or {}).get("parent_question_number", parent_num)

        followups_count = len([
            t for t in session.turns
            if (t.evaluation_metadata or {}).get("parent_question_number") == parent_num
        ])

        meta = dict(session.session_metadata or {})
        max_followups = meta.get("max_followup_questions", 2)
        
        # Check absolute limits
        if session.total_questions >= settings.INTERVIEW_MAX_QUESTIONS:
            ask_followup = False
        elif followups_count >= max_followups:
            ask_followup = False

        context = await self.service.build_context(user_id, session.resume_id, session.job_id)
        next_q_num = latest_eval_turn.question_number + 1

        if ask_followup:
            # Generate follow-up question
            self._transition_state(session, "QUESTION_GENERATED")
            questions, ai_response = await self.service.interview_ai_service.generate_questions(
                session=session,
                context=context,
                count=1,
                last_turn=latest_eval_turn
            )

            if not questions:
                self._transition_state(session, "FAILED")
                self.db.commit()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to generate follow-up question."
                )

            q = questions[0]
            cat = q.category.upper().strip()
            from app.core.enums import QuestionCategory
            supported_categories = [e.value for e in QuestionCategory]
            if cat not in supported_categories:
                cat = latest_eval_turn.question_category or "BEHAVIORAL"

            # Shift question numbers of any subsequent questions
            for t in session.turns:
                if t.question_number >= next_q_num:
                    t.question_number += 1
            
            # Create new turn for the follow-up question
            db_turn = InterviewCRUD.create_turn(
                db=self.db,
                session_id=session.id,
                question_number=next_q_num,
                question_text=q.question,
                question_category=cat
            )

            # Record followup details in metadata
            db_turn.evaluation_metadata = {
                "parent_question_number": parent_num,
                "is_followup": True
            }

            # Increment session's total questions
            session.total_questions += 1
            session.current_question = next_q_num

            # Resolve difficulty
            difficulty = session.difficulty
            if difficulty == "ADAPTIVE":
                difficulty = self.service.interview_ai_service._resolve_adaptive_difficulty(session)

            # Save in questions list metadata
            questions_meta = list(meta.get("questions", []))
            questions_meta.insert(next_q_num - 1, {
                "question_id": next_q_num,
                "category": cat,
                "difficulty": difficulty,
                "question": q.question,
                "parent_question_number": parent_num
            })
            # Re-index ids of succeeding questions
            for idx in range(next_q_num, len(questions_meta)):
                questions_meta[idx]["question_id"] = idx + 1

            meta["questions"] = questions_meta
            session.session_metadata = meta

        else:
            # Check if more questions remain
            if next_q_num > session.total_questions:
                self._transition_state(session, "COMPLETED")
                
                # Compute total duration
                start_time_str = meta.get("start_time")
                total_duration_seconds = None
                if start_time_str:
                    start_dt = datetime.fromisoformat(start_time_str)
                    end_dt = datetime.now(timezone.utc)
                    total_dur = (end_dt - start_dt).total_seconds()
                    total_dur -= meta.get("total_paused_seconds", 0.0)
                    total_duration_seconds = max(0.0, total_dur)
                
                meta["end_time"] = datetime.now(timezone.utc).isoformat()
                meta["total_duration_seconds"] = total_duration_seconds
                session.session_metadata = meta
                
                self.db.commit()
                # Return none to signify completion
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="All questions in this interview session have been completed."
                )

            # Generate next sequential/mixed question
            self._transition_state(session, "QUESTION_GENERATED")
            sequence = meta.get("question_sequence", [])
            category = sequence[next_q_num - 1] if next_q_num - 1 < len(sequence) else "BEHAVIORAL"
            
            difficulty = session.difficulty
            if difficulty == "ADAPTIVE":
                difficulty = self.service.interview_ai_service._resolve_adaptive_difficulty(session)

            prompt_name = CATEGORY_TO_PROMPT.get(category, "behavioral")
            
            questions, ai_response = await self.service.interview_ai_service.generate_questions(
                session=session,
                context=context,
                count=1,
                prompt_name=prompt_name
            )

            if not questions:
                self._transition_state(session, "FAILED")
                self.db.commit()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to generate the next question."
                )

            q = questions[0]
            db_turn = InterviewCRUD.create_turn(
                db=self.db,
                session_id=session.id,
                question_number=next_q_num,
                question_text=q.question,
                question_category=q.category.upper().strip()
            )

            session.current_question = next_q_num

            # Append metadata
            questions_meta = list(meta.get("questions", []))
            questions_meta.append({
                "question_id": next_q_num,
                "category": q.category,
                "difficulty": difficulty,
                "question": q.question,
                "expected_topics": q.expected_topics,
                "recommended_answer_framework": q.recommended_answer_framework,
                "estimated_time_seconds": q.estimated_time_seconds,
                "evaluation_weight": q.evaluation_weight,
                "followup_possible": q.followup_possible
            })
            meta["questions"] = questions_meta
            session.session_metadata = meta

        # Start timer for new question
        q_timers = dict(meta.setdefault("question_timers", {}))
        q_timers[str(session.current_question)] = {
            "start_time": datetime.now(timezone.utc).isoformat()
        }
        meta["question_timers"] = q_timers
        session.session_metadata = meta

        self._transition_state(session, "WAITING_FOR_ANSWER")
        self.db.commit()

        # Clean logging
        logger.info(
            "interview_next_question_served",
            session_id=str(session.id),
            question_number=session.current_question,
            provider=ai_response.provider,
            model=ai_response.model,
            latency=ai_response.latency_ms
        )

        return db_turn

    async def pause_interview(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        """Pauses the session timer and sets the paused flag."""
        session = self._get_session_or_raise(session_id, user_id)
        
        if session.status in ("COMPLETED", "CANCELLED", "FAILED"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot pause a closed session."
            )

        meta = dict(session.session_metadata or {})
        if meta.get("is_paused"):
            return session

        meta["is_paused"] = True
        meta["paused_time"] = datetime.now(timezone.utc).isoformat()
        session.session_metadata = meta
        
        self.db.commit()
        logger.info("interview_session_paused", session_id=str(session.id))
        return session

    async def resume_interview(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        """Resumes the session timer and accumulates paused time."""
        session = self._get_session_or_raise(session_id, user_id)
        
        if session.status in ("COMPLETED", "CANCELLED", "FAILED"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot resume a closed session."
            )

        meta = dict(session.session_metadata or {})
        if not meta.get("is_paused"):
            return session

        paused_at_str = meta.get("paused_time")
        if paused_at_str:
            paused_at = datetime.fromisoformat(paused_at_str)
            now = datetime.now(timezone.utc)
            duration = (now - paused_at).total_seconds()
            
            # Accumulate totals
            meta["total_paused_seconds"] = meta.get("total_paused_seconds", 0.0) + duration
            
            # Accumulate on active question
            q_timers = dict(meta.setdefault("question_timers", {}))
            q_timer = dict(q_timers.setdefault(str(session.current_question), {}))
            q_timer["total_paused_during_question"] = q_timer.get("total_paused_during_question", 0.0) + duration
            q_timers[str(session.current_question)] = q_timer
            meta["question_timers"] = q_timers

        meta["is_paused"] = False
        meta["paused_time"] = None
        session.session_metadata = meta
        
        self.db.commit()
        logger.info("interview_session_resumed", session_id=str(session.id))
        return session

    async def complete_interview(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        """Force completes the session and computes total timing metrics."""
        session = self._get_session_or_raise(session_id, user_id)
        
        if session.status == "COMPLETED":
            return session

        self._transition_state(session, "COMPLETED")
        
        meta = dict(session.session_metadata or {})
        meta["end_time"] = datetime.now(timezone.utc).isoformat()
        
        # Calculate duration
        start_time_str = meta.get("start_time")
        if start_time_str:
            start_dt = datetime.fromisoformat(start_time_str)
            end_dt = datetime.now(timezone.utc)
            total_dur = (end_dt - start_dt).total_seconds()
            total_dur -= meta.get("total_paused_seconds", 0.0)
            meta["total_duration_seconds"] = max(0.0, total_dur)

        session.session_metadata = meta
        self.db.commit()
        logger.info("interview_session_completed", session_id=str(session.id))
        return session

    async def cancel_interview(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        """Cancels an active interview session."""
        session = self._get_session_or_raise(session_id, user_id)
        if session.status == "CANCELLED":
            return session

        self._transition_state(session, "CANCELLED")
        self.db.commit()
        logger.info("interview_session_cancelled", session_id=str(session.id))
        return session

    async def restart_interview(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        """Clears all answers/turns and resets the session to CREATED state to restart."""
        session = self._get_session_or_raise(session_id, user_id)

        # Clear turns
        self.db.query(InterviewTurn).filter(InterviewTurn.session_id == session.id).delete()
        
        session.current_question = 1
        # Retrieve original config or reset total_questions to baseline if modified by followups
        session.total_questions = session.session_metadata.get("original_total_questions", session.total_questions) if session.session_metadata else session.total_questions
        
        session.session_metadata = {
            "original_total_questions": session.total_questions,
            "restarted_at": datetime.now(timezone.utc).isoformat()
        }

        self._transition_state(session, "CREATED")
        self.db.commit()
        logger.info("interview_session_restarted", session_id=str(session.id))
        return session

    async def get_progress(self, session_id: uuid.UUID, user_id: uuid.UUID) -> dict:
        """Calculates and returns the active progress stats for the interview session."""
        session = self._get_session_or_raise(session_id, user_id)

        turns_with_score = [t for t in session.turns if t.score is not None]
        completed = len(turns_with_score)
        remaining = max(0, session.total_questions - completed)
        
        pct = int((completed / session.total_questions) * 100) if session.total_questions > 0 else 0
        avg_score = float(sum(t.score for t in turns_with_score) / completed) if completed > 0 else 0.0

        # Calculate average response duration
        q_timers = (session.session_metadata or {}).get("question_timers", {})
        durations = [t.get("duration_seconds") for t in q_timers.values() if t.get("duration_seconds") is not None]
        avg_resp_time = float(sum(durations) / len(durations)) if durations else 0.0

        # Determine difficulty trend from question metadata
        questions_meta = (session.session_metadata or {}).get("questions", [])
        diff_trend = [q.get("difficulty", "MEDIUM") for q in questions_meta]

        return {
            "current_question": session.current_question,
            "questions_completed": completed,
            "questions_remaining": remaining,
            "completion_percentage": pct,
            "average_score": round(avg_score, 1),
            "average_response_time": round(avg_resp_time, 1),
            "difficulty_trend": diff_trend,
            "session_status": session.status
        }

    async def get_status(self, session_id: uuid.UUID, user_id: uuid.UUID) -> dict:
        """Returns current status, timers, and metadata details."""
        session = self._get_session_or_raise(session_id, user_id)
        meta = session.session_metadata or {}

        # Compute estimated completion time
        est_completion = None
        if not session.status in ("COMPLETED", "CANCELLED", "FAILED"):
            start_str = meta.get("start_time")
            if start_str:
                start_dt = datetime.fromisoformat(start_str)
                completed_count = len([t for t in session.turns if t.score is not None])
                remaining_count = session.total_questions - completed_count
                
                # Fetch average response time or use default of 120s
                q_timers = meta.get("question_timers", {})
                durations = [t.get("duration_seconds") for t in q_timers.values() if t.get("duration_seconds") is not None]
                avg_duration = sum(durations) / len(durations) if durations else 120.0
                
                # Include AI generation estimate (approx 5s per question)
                total_est_seconds = remaining_count * (avg_duration + 5.0)
                
                # Fallback to standard datetime math
                import datetime as dt_module
                est_dt = datetime.now(timezone.utc) + dt_module.timedelta(seconds=total_est_seconds)
                est_completion = est_dt.isoformat()

        return {
            "session_id": str(session.id),
            "status": session.status,
            "is_paused": meta.get("is_paused", False),
            "start_time": meta.get("start_time"),
            "end_time": meta.get("end_time"),
            "total_paused_seconds": meta.get("total_paused_seconds", 0.0),
            "total_duration_seconds": meta.get("total_duration_seconds"),
            "estimated_completion": est_completion
        }
