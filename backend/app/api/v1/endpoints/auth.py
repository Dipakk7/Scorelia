from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
import structlog
from pydantic import BaseModel

from app.core.db import get_db
from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.core.dependencies import get_current_user
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services import auth_service
from app.models.user import User

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
