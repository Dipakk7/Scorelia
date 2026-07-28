import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.user_integration import UserIntegration

PROVIDER_METADATA = {
    "github": {
        "name": "GitHub Intelligence",
        "description": "Sync repositories, contribution heatmaps, commit frequency, and developer code quality scores.",
        "icon_name": "Github",
    },
    "linkedin": {
        "name": "LinkedIn Career Connect",
        "description": "Import professional experience, endorsements, skills, and industry network connections.",
        "icon_name": "Linkedin",
    },
    "google": {
        "name": "Google Workspace Sync",
        "description": "Sync Google Calendar interview reminders and Drive document uploads.",
        "icon_name": "Globe",
    },
    "openai": {
        "name": "OpenAI API Bridge",
        "description": "Connect custom OpenAI API keys for extended LLM model processing throughput.",
        "icon_name": "Cpu",
    },
    "slack": {
        "name": "Slack Notification Bot",
        "description": "Send AI daily career briefs and subagent status updates directly to your Slack channel.",
        "icon_name": "MessageSquare",
    },
}

class IntegrationRepository:
    """Repository handling database operations for UserIntegration."""

    @staticmethod
    def get_user_integrations(db: Session, user_id: uuid.UUID) -> list[UserIntegration]:
        """Fetch or initialize default 5 integration records for user."""
        records = db.query(UserIntegration).filter(UserIntegration.user_id == user_id).all()
        existing_providers = {r.provider for r in records}

        # Seed defaults for any missing provider
        for provider in PROVIDER_METADATA:
            if provider not in existing_providers:
                # Seed connected defaults for github, linkedin, openai for realistic test setup
                is_conn = provider in {"github", "linkedin", "openai"}
                ident = (
                    "dipakkhandagale" if provider == "github" else
                    "dipak-khandagale" if provider == "linkedin" else
                    "sk-proj-****4a9b" if provider == "openai" else None
                )
                rec = UserIntegration(
                    user_id=user_id,
                    provider=provider,
                    is_connected=is_conn,
                    account_identifier=ident,
                    status_badge="Connected" if is_conn else "Not Connected",
                    connected_repos_count=12 if provider == "github" else 0,
                    connected_channels_count=0,
                    last_synced_at=datetime.utcnow() if is_conn else None
                )
                db.add(rec)
                records.append(rec)
        db.commit()
        return db.query(UserIntegration).filter(UserIntegration.user_id == user_id).all()

    @staticmethod
    def update_integration(db: Session, user_id: uuid.UUID, provider: str, is_connected: bool, identifier: str | None = None, key: str | None = None) -> UserIntegration | None:
        """Connect or disconnect an integration."""
        rec = (
            db.query(UserIntegration)
            .filter(UserIntegration.user_id == user_id, UserIntegration.provider == provider)
            .first()
        )
        if not rec:
            rec = UserIntegration(user_id=user_id, provider=provider)
            db.add(rec)

        rec.is_connected = is_connected
        rec.status_badge = "Connected" if is_connected else "Not Connected"
        if identifier is not None:
            rec.account_identifier = identifier
        if key is not None:
            rec.encrypted_api_key = key
        rec.last_synced_at = datetime.utcnow() if is_connected else None
        db.commit()
        db.refresh(rec)
        return rec
