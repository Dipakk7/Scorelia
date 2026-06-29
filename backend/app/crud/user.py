import uuid
from datetime import datetime
import structlog
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password

logger = structlog.get_logger()


def get_user_by_email(db: Session, email: str) -> User | None:
    """Query the users table by email.

    Args:
        db: The SQLAlchemy Session database connection.
        email: The email address to look up.

    Returns:
        The User object if found, or None.
    """
    try:
        return db.query(User).filter(User.email == email).first()
    except Exception as e:
        logger.error("Error retrieving user by email", email=email, error=str(e))
        return None


def get_user_by_id(db: Session, user_id: str) -> User | None:
    """Query the users table by id, handling UUID conversion safely.

    Args:
        db: The SQLAlchemy Session database connection.
        user_id: The UUID of the user as a string.

    Returns:
        The User object if found, or None.
    """
    try:
        try:
            parsed_id = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
        except ValueError:
            logger.warning("Invalid UUID string provided", user_id=user_id)
            return None

        return db.query(User).filter(User.id == parsed_id).first()
    except Exception as e:
        logger.error("Error retrieving user by id", user_id=user_id, error=str(e))
        return None


def create_user(db: Session, user_create: UserCreate) -> User:
    """Create a new User record in the database.

    Hashes the user's plain text password and sets the auth provider to LOCAL.

    Args:
        db: The SQLAlchemy Session database connection.
        user_create: The UserCreate schema containing signup details.

    Returns:
        The created User database object.
    """
    try:
        hashed_password = hash_password(user_create.password)
        db_user = User(
            email=user_create.email,
            hashed_password=hashed_password,
            full_name=user_create.full_name,
            auth_provider="LOCAL",
            is_active=True,
            is_verified=False
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        logger.error("Error creating user in database", email=user_create.email, error=str(e))
        raise e


def update_last_login(db: Session, user: User) -> User:
    """Update the user's last login timestamp to the current UTC datetime.

    Args:
        db: The SQLAlchemy Session database connection.
        user: The User object to update.

    Returns:
        The updated User object.
    """
    try:
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        logger.error("Error updating user last login timestamp", user_id=str(user.id), error=str(e))
        raise e
