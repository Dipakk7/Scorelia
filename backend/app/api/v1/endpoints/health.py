from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.core.db import get_db
from datetime import datetime
import structlog

logger = structlog.get_logger()
router = APIRouter()

@router.get("/health", tags=["System"])
async def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error("Health check database connection failed", error=str(e))
        db_status = "unhealthy"

    overall_status = "healthy" if db_status == "healthy" else "unhealthy"

    return {
        "status": overall_status,
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
