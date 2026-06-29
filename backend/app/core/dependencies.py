from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
import structlog
from app.core.db import get_db
from app.core.security import decode_access_token
from app.crud.user import get_user_by_id
from app.models.user import User

logger = structlog.get_logger()


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """Dependency to retrieve the currently authenticated user from HttpOnly cookies.

    Extracts the JWT access token from the 'access_token' cookie, decodes and validates it,
    queries the user from the database, and verifies the account is active.

    Args:
        request: The incoming FastAPI request.
        db: The SQLAlchemy Session database connection.

    Returns:
        The authenticated User database model instance.

    Raises:
        HTTPException: 401 Unauthorized if the token is missing, invalid, expired, or the user is not found.
        HTTPException: 403 Forbidden if the user account is disabled.
    """
    # Extract token from the HttpOnly cookie
    token = request.cookies.get("access_token")
    if not token:
        logger.warning("missing cookie")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Decode and validate the access token
    token_data = decode_access_token(token)
    if not token_data:
        logger.warning("invalid/expired token", reason="failed to decode or validate token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Retrieve the user from the database
    user = get_user_by_id(db, user_id=token_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Check if the user account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
        
    return user
