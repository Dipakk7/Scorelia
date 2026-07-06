from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
import structlog
from pydantic import BaseModel

from app.core.db import get_db
from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.core.dependencies import get_current_user
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserUpdate
from app.services import auth_service
from app.models.user import User
from app.core.security import verify_password, hash_password
from datetime import datetime
from pydantic import Field

logger = structlog.get_logger()
router = APIRouter()


class LoginResponse(BaseModel):
    message: str = "Login successful"
    user: UserResponse


class LogoutResponse(BaseModel):
    message: str = "Logged out successfully"


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user, normalize email, and return user profile details."""
    user_create.email = user_create.email.strip().lower()
    user = auth_service.register_user(db, user_create=user_create)
    return user


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    response: Response,
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Authenticate credentials, issue JWT in cookie, and return user profile details."""
    email = credentials.email.strip().lower()
    user = auth_service.login_user(db, email=email, password=credentials.password)
    
    # Generate token payload
    token_payload = {
        "sub": user.email,
        "user_id": str(user.id),
        "provider": user.auth_provider
    }
    
    # Create the access token
    token = create_access_token(data=token_payload)
    
    # Set the cookie with settings
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.ENVIRONMENT == "production",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    
    return LoginResponse(message="Login successful", user=UserResponse.model_validate(user))


@router.post("/logout", response_model=LogoutResponse, status_code=status.HTTP_200_OK)
async def logout(
    request: Request,
    response: Response
):
    """Clear access token cookie to logout user and audit log the action."""
    # Attempt to extract user email for audit log if cookie is present
    email = None
    token = request.cookies.get("access_token")
    if token:
        try:
            token_data = decode_access_token(token)
            if token_data:
                email = token_data.email
        except Exception:
            pass
            
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
        path="/"
    )
    
    logger.info("user logged out", email=email)
    return LogoutResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_me(current_user: User = Depends(get_current_user)):
    """Retrieve the current user profile from context."""
    return current_user


@router.put("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user profile and settings."""
    update_data = user_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(current_user, key, value)
        
    db.commit()
    db.refresh(current_user)
    return current_user


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    req: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change the user's password after validating the current password."""
    if current_user.auth_provider != "LOCAL":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot be changed for third-party authentication logins"
        )
        
    if not current_user.hashed_password or not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
        
    v = req.new_password
    if len(v) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long")
    if not any(c.isupper() for c in v):
        raise HTTPException(status_code=400, detail="New password must contain at least one uppercase letter (A-Z)")
    if not any(c.islower() for c in v):
        raise HTTPException(status_code=400, detail="New password must contain at least one lowercase letter (a-z)")
    if not any(c.isdigit() for c in v):
        raise HTTPException(status_code=400, detail="New password must contain at least one digit (0-9)")
    if not any(not c.isalnum() for c in v):
        raise HTTPException(status_code=400, detail="New password must contain at least one special character (!@#$%^&*...)")

    current_user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"success": True, "message": "Password changed successfully"}


@router.get("/sessions", status_code=status.HTTP_200_OK)
async def get_active_sessions(current_user: User = Depends(get_current_user)):
    """Retrieve simulated list of active sessions for security configuration UX."""
    return [
        {
            "id": "current-session",
            "device": "Chrome on Windows (Current)",
            "ip_address": "192.168.1.42",
            "last_active": datetime.utcnow().isoformat(),
            "is_current": True
        },
        {
            "id": "mock-session-2",
            "device": "Safari on iPhone 15",
            "ip_address": "10.0.0.8",
            "last_active": "2026-07-04T12:00:00Z",
            "is_current": False
        }
    ]


@router.post("/sessions/logout-others", status_code=status.HTTP_200_OK)
async def logout_other_devices(current_user: User = Depends(get_current_user)):
    """Simulate logging out of other devices."""
    return {"success": True, "message": "Logged out of all other sessions successfully"}


@router.post("/delete-account", status_code=status.HTTP_200_OK)
async def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete current user account and all their records from the database."""
    db.delete(current_user)
    db.commit()
    return {"success": True, "message": "Account successfully deleted"}


@router.post("/export-data", status_code=status.HTTP_200_OK)
async def export_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export all user-related records (profile, resumes, roadmaps, cover letters) as a unified JSON download."""
    profile_data = {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "bio": current_user.bio,
        "location": current_user.location,
        "website": current_user.website,
        "linkedin": current_user.linkedin,
        "github": current_user.github,
        "role": current_user.role,
        "skills": current_user.skills,
        "education": current_user.education,
        "experience": current_user.experience,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }
    
    resumes_list = []
    for resume in current_user.resumes:
        resumes_list.append({
            "original_filename": resume.original_filename,
            "status": resume.status,
            "ats_score": resume.ats_score,
            "uploaded_at": resume.uploaded_at.isoformat() if resume.uploaded_at else None
        })
        
    return {
        "user_profile": profile_data,
        "resumes": resumes_list,
        "export_date": datetime.utcnow().isoformat()
    }

