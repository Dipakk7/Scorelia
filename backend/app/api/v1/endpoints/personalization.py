from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.personalization import (
    PersonalizationResponse,
    WorkspacePersonalizationUpdate,
    AIPersonalizationUpdate,
    AccessibilityPersonalizationUpdate,
    ProductivityPersonalizationUpdate,
)
from app.services.personalization_service import PersonalizationService

router = APIRouter()

@router.get("", response_model=PersonalizationResponse, status_code=status.HTTP_200_OK)
async def get_personalization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve full personalization settings for the authenticated user."""
    return PersonalizationService.get_personalization(db, current_user.id)

@router.patch("/workspace", response_model=PersonalizationResponse, status_code=status.HTTP_200_OK)
async def update_workspace_personalization(
    payload: WorkspacePersonalizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update workspace layout preferences."""
    update_data = payload.model_dump(exclude_unset=True)
    return PersonalizationService.update_workspace(db, current_user.id, update_data)

@router.patch("/ai", response_model=PersonalizationResponse, status_code=status.HTTP_200_OK)
async def update_ai_personalization(
    payload: AIPersonalizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update AI model and provider preferences."""
    update_data = payload.model_dump(exclude_unset=True)
    return PersonalizationService.update_ai(db, current_user.id, update_data)

@router.patch("/accessibility", response_model=PersonalizationResponse, status_code=status.HTTP_200_OK)
async def update_accessibility_personalization(
    payload: AccessibilityPersonalizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update accessibility preferences."""
    update_data = payload.model_dump(exclude_unset=True)
    return PersonalizationService.update_accessibility(db, current_user.id, update_data)

@router.patch("/productivity", response_model=PersonalizationResponse, status_code=status.HTTP_200_OK)
async def update_productivity_personalization(
    payload: ProductivityPersonalizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update productivity preferences."""
    update_data = payload.model_dump(exclude_unset=True)
    return PersonalizationService.update_productivity(db, current_user.id, update_data)

@router.post("/reset", response_model=PersonalizationResponse, status_code=status.HTTP_200_OK)
async def reset_personalization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Reset personalization settings back to initial production defaults."""
    return PersonalizationService.reset_personalization(db, current_user.id)
