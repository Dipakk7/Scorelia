from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.integrations import (
    IntegrationResponse,
    ConnectIntegrationRequest,
    OpenAIKeyRequest,
)
from app.services.integration_service import IntegrationService

router = APIRouter()

@router.get("", response_model=list[IntegrationResponse], status_code=status.HTTP_200_OK)
async def get_user_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all user integrations with masked keys and status badges."""
    return IntegrationService.get_user_integrations(db, current_user.id)

@router.post("/{provider}/connect", response_model=IntegrationResponse, status_code=status.HTTP_200_OK)
async def connect_integration(
    provider: str,
    payload: ConnectIntegrationRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Connect or authenticate third-party integration provider."""
    ident = payload.auth_code if payload and payload.auth_code else f"{current_user.email.split('@')[0]}"
    key = payload.api_key if payload and payload.api_key else None
    return IntegrationService.connect_provider(db, current_user.id, provider, identifier=ident, key=key)

@router.delete("/{provider}/disconnect", response_model=IntegrationResponse, status_code=status.HTTP_200_OK)
async def disconnect_integration(
    provider: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Disconnect third-party integration provider."""
    return IntegrationService.disconnect_provider(db, current_user.id, provider)

@router.post("/openai/key", response_model=IntegrationResponse, status_code=status.HTTP_200_OK)
async def save_openai_key(
    payload: OpenAIKeyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Securely store OpenAI API key."""
    return IntegrationService.save_openai_key(db, current_user.id, payload.api_key)

@router.post("/{provider}/sync", response_model=IntegrationResponse, status_code=status.HTTP_200_OK)
async def sync_integration(
    provider: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Trigger manual data synchronization for provider."""
    return IntegrationService.connect_provider(db, current_user.id, provider)
