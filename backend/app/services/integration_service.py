import uuid
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user_integration import UserIntegration
from app.repositories.integration_repository import IntegrationRepository, PROVIDER_METADATA

class IntegrationService:
    """Service enforcing business rules for integrations and API key masking."""

    @classmethod
    def mask_key(cls, key: str | None) -> str | None:
        """Mask sensitive API keys for display (e.g. sk-proj-****4a9b)."""
        if not key:
            return None
        if len(key) <= 8:
            return "********"
        return f"{key[:7]}****{key[-4:]}"

    @classmethod
    def get_user_integrations(cls, db: Session, user_id: uuid.UUID) -> list[dict]:
        """Fetch all user integrations formatted for API response."""
        records = IntegrationRepository.get_user_integrations(db, user_id)
        result = []
        for r in records:
            meta = PROVIDER_METADATA.get(r.provider, {
                "name": r.provider.capitalize(),
                "description": "External integration service.",
                "icon_name": "Layers",
            })
            result.append({
                "id": r.id,
                "provider": r.provider,
                "name": meta["name"],
                "description": meta["description"],
                "icon_name": meta["icon_name"],
                "is_connected": r.is_connected,
                "status_badge": r.status_badge,
                "account_identifier": r.account_identifier,
                "avatar_url": r.avatar_url,
                "masked_key": cls.mask_key(r.encrypted_api_key),
                "connected_repos_count": r.connected_repos_count,
                "connected_channels_count": r.connected_channels_count,
                "last_synced_at": r.last_synced_at,
            })
        return result

    @classmethod
    def connect_provider(cls, db: Session, user_id: uuid.UUID, provider: str, identifier: str | None = None, key: str | None = None) -> dict:
        """Connect an integration provider."""
        if provider not in PROVIDER_METADATA:
            raise HTTPException(status_code=400, detail=f"Unsupported integration provider '{provider}'.")

        rec = IntegrationRepository.update_integration(
            db, user_id, provider, is_connected=True, identifier=identifier, key=key
        )
        meta = PROVIDER_METADATA[provider]
        return {
            "id": rec.id,
            "provider": rec.provider,
            "name": meta["name"],
            "description": meta["description"],
            "icon_name": meta["icon_name"],
            "is_connected": rec.is_connected,
            "status_badge": rec.status_badge,
            "account_identifier": rec.account_identifier,
            "avatar_url": rec.avatar_url,
            "masked_key": cls.mask_key(rec.encrypted_api_key),
            "connected_repos_count": rec.connected_repos_count,
            "connected_channels_count": rec.connected_channels_count,
            "last_synced_at": rec.last_synced_at,
        }

    @classmethod
    def disconnect_provider(cls, db: Session, user_id: uuid.UUID, provider: str) -> dict:
        """Disconnect an integration provider."""
        rec = IntegrationRepository.update_integration(
            db, user_id, provider, is_connected=False, identifier=None, key=None
        )
        meta = PROVIDER_METADATA.get(provider, {
            "name": provider.capitalize(),
            "description": "",
            "icon_name": "Layers"
        })
        return {
            "id": rec.id,
            "provider": rec.provider,
            "name": meta["name"],
            "description": meta["description"],
            "icon_name": meta["icon_name"],
            "is_connected": rec.is_connected,
            "status_badge": rec.status_badge,
            "account_identifier": None,
            "avatar_url": None,
            "masked_key": None,
            "connected_repos_count": 0,
            "connected_channels_count": 0,
            "last_synced_at": None,
        }

    @classmethod
    def save_openai_key(cls, db: Session, user_id: uuid.UUID, api_key: str) -> dict:
        """Securely store OpenAI API key and return masked representation."""
        if not api_key.startswith("sk-"):
            raise HTTPException(status_code=400, detail="Invalid OpenAI API key format. Key must start with 'sk-'.")
        return cls.connect_provider(db, user_id, "openai", identifier=cls.mask_key(api_key), key=api_key)
