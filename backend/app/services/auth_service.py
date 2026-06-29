from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import structlog
from app.models.user import User
from app.schemas.user import UserCreate
from app.crud import user as crud_user
from app.core.security import verify_password

logger = structlog.get_logger()


def register_user(
    db: Session,
    user_create: UserCreate
) -> User:
    """Register a new user in the system after validating that the email is unique.

    Args:
        db: The SQLAlchemy Session database connection.
        user_create: The UserCreate schema containing signup details.

    Returns:
        The newly created User database model instance.

    Raises:
        HTTPException: 400 Bad Request if the email is already registered.
    """
    # Check if the user already exists in the database
    existing_user = crud_user.get_user_by_email(db, email=user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Delegate the creation of the user to the CRUD layer
    user = crud_user.create_user(db, user_create=user_create)
    logger.info("new user registered", email=user.email)
    return user


def login_user(
    db: Session,
    email: str,
    password: str
) -> User:
    """Authenticate a user using their email and password.

    Validates that the user exists, the password matches the hash, and the account is active.
    On successful login, the last login timestamp is updated in the database.

    Args:
        db: The SQLAlchemy Session database connection.
        email: The email of the user attempting to log in.
        password: The plain text password of the user.

    Returns:
        The authenticated User database model instance.

    Raises:
        HTTPException: 401 Unauthorized if the credentials are invalid.
        HTTPException: 403 Forbidden if the account is deactivated.
    """
    # Retrieve user from the database
    user = crud_user.get_user_by_email(db, email=email)
    
    # Generic "Invalid credentials" error for both user-not-found and incorrect password
    if not user:
        logger.warning("invalid credentials", email=email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify the password against the stored bcrypt hash
    if not verify_password(password, user.hashed_password or ""):
        logger.warning("invalid credentials", email=email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
        
    # Check if the account is active
    if not user.is_active:
        logger.warning("account disabled login attempt", email=email)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
        
    # Update the last login time
    updated_user = crud_user.update_last_login(db, user=user)
    logger.info("user logged in", email=updated_user.email, auth_provider=updated_user.auth_provider)
    return updated_user

