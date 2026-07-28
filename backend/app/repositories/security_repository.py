import uuid
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.security import UserSession, TrustedDevice, LoginHistory, User2FASetting

class SecurityRepository:
    """Repository handling database operations for security features."""

    @staticmethod
    def get_sessions(db: Session, user_id: uuid.UUID) -> list[UserSession]:
        """Fetch active user sessions ordered by last active time."""
        return (
            db.query(UserSession)
            .filter(UserSession.user_id == user_id)
            .order_by(desc(UserSession.last_active_at))
            .all()
        )

    @staticmethod
    def revoke_session(db: Session, user_id: uuid.UUID, session_id: uuid.UUID) -> bool:
        """Delete / revoke a specific user session."""
        session_rec = (
            db.query(UserSession)
            .filter(UserSession.user_id == user_id, UserSession.id == session_id)
            .first()
        )
        if session_rec and not session_rec.is_current:
            db.delete(session_rec)
            db.commit()
            return True
        return False

    @staticmethod
    def revoke_other_sessions(db: Session, user_id: uuid.UUID, current_session_id: uuid.UUID | None = None) -> int:
        """Revoke all sessions for a user except current session."""
        query = db.query(UserSession).filter(UserSession.user_id == user_id, UserSession.is_current == False)
        count = query.delete(synchronize_session=False)
        db.commit()
        return count

    @staticmethod
    def get_trusted_devices(db: Session, user_id: uuid.UUID) -> list[TrustedDevice]:
        """Fetch trusted devices for user."""
        return (
            db.query(TrustedDevice)
            .filter(TrustedDevice.user_id == user_id)
            .order_by(desc(TrustedDevice.last_used_at))
            .all()
        )

    @staticmethod
    def remove_trusted_device(db: Session, user_id: uuid.UUID, device_id: uuid.UUID) -> bool:
        """Remove a trusted device entry."""
        device_rec = (
            db.query(TrustedDevice)
            .filter(TrustedDevice.user_id == user_id, TrustedDevice.id == device_id)
            .first()
        )
        if device_rec:
            db.delete(device_rec)
            db.commit()
            return True
        return False

    @staticmethod
    def get_login_history(db: Session, user_id: uuid.UUID, limit: int = 10) -> list[LoginHistory]:
        """Fetch recent login audit history for user."""
        return (
            db.query(LoginHistory)
            .filter(LoginHistory.user_id == user_id)
            .order_by(desc(LoginHistory.created_at))
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_2fa_setting(db: Session, user_id: uuid.UUID) -> User2FASetting | None:
        """Fetch 2FA configuration record."""
        return db.query(User2FASetting).filter(User2FASetting.user_id == user_id).first()

    @staticmethod
    def save_2fa_setting(db: Session, user_id: uuid.UUID, is_enabled: bool, secret_key: str | None = None, backup_codes: list[str] | None = None) -> User2FASetting:
        """Create or update 2FA configuration."""
        rec = db.query(User2FASetting).filter(User2FASetting.user_id == user_id).first()
        if not rec:
            rec = User2FASetting(
                user_id=user_id,
                is_enabled=is_enabled,
                secret_key=secret_key,
                backup_codes={"codes": backup_codes or []}
            )
            db.add(rec)
        else:
            rec.is_enabled = is_enabled
            if secret_key:
                rec.secret_key = secret_key
            if backup_codes:
                rec.backup_codes = {"codes": backup_codes}
        db.commit()
        db.refresh(rec)
        return rec
