from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
import structlog

logger = structlog.get_logger()

# Map connection string to psycopg v3 driver for SQLAlchemy
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

try:
    logger.info("Initializing database engine", url=db_url.split("@")[-1])  # Sanitize: exclude password
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        future=True
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
except Exception as e:
    logger.error("Failed to initialize database engine", error=str(e))
    raise e

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
