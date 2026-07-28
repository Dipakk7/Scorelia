from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.settings import (
    SettingsResponse,
    GeneralSettingsUpdate,
    SystemSettingsUpdate,
    AppearanceSettingsUpdate,
    NotificationSettingsUpdate,
    PrivacySettingsUpdate,
)
from app.services.settings_service import SettingsService

router = APIRouter()

@router.get("", response_model=SettingsResponse, status_code=status.HTTP_200_OK)
async def get_user_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve full user settings for the authenticated user."""
    return SettingsService.get_or_create_settings(db, current_user.id)

@router.patch("/general", response_model=SettingsResponse, status_code=status.HTTP_200_OK)
async def update_general_settings(
    payload: GeneralSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update general settings preferences for the authenticated user."""
    update_data = payload.model_dump(exclude_unset=True)
    return SettingsService.update_general(db, current_user.id, update_data)

@router.patch("/system", response_model=SettingsResponse, status_code=status.HTTP_200_OK)
async def update_system_settings(
    payload: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update system preference toggles for the authenticated user."""
    update_data = payload.model_dump(exclude_unset=True)
    return SettingsService.update_system(db, current_user.id, update_data)

@router.patch("/appearance", response_model=SettingsResponse, status_code=status.HTTP_200_OK)
async def update_appearance_settings(
    payload: AppearanceSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update appearance and theme preferences for the authenticated user."""
    update_data = payload.model_dump(exclude_unset=True)
    return SettingsService.update_appearance(db, current_user.id, update_data)

@router.patch("/notifications", response_model=SettingsResponse, status_code=status.HTTP_200_OK)
async def update_notification_settings(
    payload: NotificationSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update notification preferences for the authenticated user."""
    update_data = payload.model_dump(exclude_unset=True)
    return SettingsService.update_notifications(db, current_user.id, update_data)

@router.patch("/privacy", response_model=SettingsResponse, status_code=status.HTTP_200_OK)
async def update_privacy_settings(
    payload: PrivacySettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update data privacy preferences for the authenticated user."""
    update_data = payload.model_dump(exclude_unset=True)
    return SettingsService.update_privacy(db, current_user.id, update_data)

@router.post("/reset", response_model=SettingsResponse, status_code=status.HTTP_200_OK)
async def reset_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Reset all settings back to initial production defaults."""
    return SettingsService.reset_defaults(db, current_user.id)
