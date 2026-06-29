import bcrypt
from datetime import datetime, timedelta
from typing import Any
from jose import jwt, JWTError

# --- passlib and bcrypt compatibility monkeypatch ---
# Pinning bcrypt or monkeypatching is required because passlib is unmaintained 
# and doesn't support bcrypt 4.1.0+ or 5.0.0+ out of the box.
original_hashpw = bcrypt.hashpw

def safe_hashpw(password: bytes | str, salt: bytes) -> bytes:
    if isinstance(password, bytes) and len(password) > 72:
        password = password[:72]
    return original_hashpw(password, salt)

bcrypt.hashpw = safe_hashpw

if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = getattr(bcrypt, "__version__", "4.0.0")
    bcrypt.__about__ = About
# ----------------------------------------------------

from passlib.context import CryptContext
from app.core.config import settings
from app.schemas import TokenData

# Initialize the password CryptContext with the bcrypt scheme
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed: str) -> bool:
    """Verify a plain text password against the hashed password."""
    return pwd_context.verify(plain_password, hashed)


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
) -> str:
    """Create a JWT access token with user details and expiration time.

    Args:
        data: A dict containing the payload data (sub, user_id, provider).
        expires_delta: Optional timedelta for token expiration.

    Returns:
        The encoded JWT string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> TokenData | None:
    """Decode and validate a JWT access token.

    Args:
        token: The encoded JWT access token.

    Returns:
        A TokenData schema object if valid, otherwise None. Never raises exceptions.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        email: str | None = payload.get("sub")
        user_id: str | None = payload.get("user_id")
        provider: str | None = payload.get("provider")
        
        if email is None or user_id is None or provider is None:
            return None
            
        return TokenData(
            user_id=str(user_id),
            email=str(email),
            provider=str(provider)
        )
    except JWTError:
        return None
    except Exception:
        return None
