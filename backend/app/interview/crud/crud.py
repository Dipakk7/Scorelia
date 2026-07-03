import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.schemas import InterviewSessionCreate

class InterviewCRUD:
    """CRUD operations for the AI Interview module."""

    @staticmethod
    def create_session(
        db: Session,
        user_id: uuid.UUID,
        schema: InterviewSessionCreate,
        status: str,
        provider: str | None = None,
        model: str | None = None,
        prompt_version: str | None = None
    ) -> InterviewSession:
        """Create a new interview session."""
        db_session = InterviewSession(
            user_id=user_id,
            resume_id=schema.resume_id,
            job_id=schema.job_id,
            company_name=schema.company_name,
            target_role=schema.target_role,
            interview_type=schema.interview_type,
            difficulty=schema.difficulty,
            status=status,
            total_questions=schema.total_questions or 5,
            current_question=1,
            provider=provider,
            model=model,
            prompt_version=prompt_version,
            session_metadata=schema.session_metadata,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        return db_session

    @staticmethod
    def get_session(db: Session, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession | None:
        """Retrieve a specific interview session by ID for a user."""
        return db.query(InterviewSession).filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == user_id
        ).first()

    @staticmethod
    def list_sessions(db: Session, user_id: uuid.UUID) -> list[InterviewSession]:
        """List all interview sessions for a user, ordered by creation date descending."""
        return db.query(InterviewSession).filter(
            InterviewSession.user_id == user_id
        ).order_by(desc(InterviewSession.created_at)).all()

    @staticmethod
    def delete_session(db: Session, session: InterviewSession) -> bool:
        """Delete an interview session from the database."""
        db.delete(session)
        db.commit()
        return True

    @staticmethod
    def create_turn(
        db: Session,
        session_id: uuid.UUID,
        question_number: int,
        question_text: str,
        question_category: str | None = None,
        answer_text: str | None = None,
        feedback: str | None = None,
        score: int | None = None
    ) -> InterviewTurn:
        """Create a turn in an interview session."""
        db_turn = InterviewTurn(
            session_id=session_id,
            question_number=question_number,
            question_category=question_category,
            question_text=question_text,
            answer_text=answer_text,
            feedback=feedback,
            score=score,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(db_turn)
        db.commit()
        db.refresh(db_turn)
        return db_turn
