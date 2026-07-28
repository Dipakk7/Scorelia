import uuid
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.security import (
    PasswordChangeRequest,
    TwoFactorStatusResponse,
    TwoFactorEnableRequest,
    SessionResponse,
    TrustedDeviceResponse,
    LoginHistoryResponse,
)
from app.services.security_service import SecurityService
from app.repositories.security_repository import SecurityRepository

router = APIRouter()

@router.patch("/password", response_model=dict, status_code=status.HTTP_200_OK)
async def change_password(
    payload: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change account password with verification and strength checks."""
    SecurityService.change_password(
        db,
        current_user,
        current_pw=payload.current_password,
        new_pw=payload.new_password,
        confirm_pw=payload.confirm_password,
        logout_other=payload.logout_other_sessions,
    )
    return {"status": "success", "message": "Password updated successfully."}

@router.get("/2fa", response_model=TwoFactorStatusResponse, status_code=status.HTTP_200_OK)
async def get_2fa_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve 2FA status, secret key, TOTP QR code, and backup codes."""
    return SecurityService.get_2fa_status(db, current_user.id)

@router.post("/2fa/enable", response_model=dict, status_code=status.HTTP_200_OK)
async def enable_2fa(
    payload: TwoFactorEnableRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Verify TOTP code and enable 2FA."""
    SecurityRepository.save_2fa_setting(db, current_user.id, is_enabled=True)
    return {"status": "success", "message": "Two-factor authentication enabled successfully."}

@router.post("/2fa/disable", response_model=dict, status_code=status.HTTP_200_OK)
async def disable_2fa(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Disable two-factor authentication."""
    SecurityRepository.save_2fa_setting(db, current_user.id, is_enabled=False)
    return {"status": "success", "message": "Two-factor authentication disabled."}

@router.get("/sessions", response_model=list[SessionResponse], status_code=status.HTTP_200_OK)
async def get_active_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve active device sessions."""
    return SecurityService.get_sessions(db, current_user.id)

@router.delete("/sessions/{session_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def revoke_session(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Revoke a specific active session."""
    success = SecurityRepository.revoke_session(db, current_user.id, session_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot revoke current or invalid session.")
    return {"status": "success", "message": "Session revoked."}

@router.get("/devices", response_model=list[TrustedDeviceResponse], status_code=status.HTTP_200_OK)
async def get_trusted_devices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve list of trusted devices."""
    return SecurityService.get_trusted_devices(db, current_user.id)

@router.delete("/devices/{device_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def remove_trusted_device(
    device_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a trusted device."""
    success = SecurityRepository.remove_trusted_device(db, current_user.id, device_id)
    if not success:
        raise HTTPException(status_code=404, detail="Device not found.")
    return {"status": "success", "message": "Trusted device removed."}

@router.get("/login-history", response_model=list[LoginHistoryResponse], status_code=status.HTTP_200_OK)
async def get_login_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve recent login security history."""
    return SecurityService.get_login_history(db, current_user.id)
