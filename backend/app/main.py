from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import configure_logging
from app.core.db import engine
from app.api.v1.router import api_router
from app.api.v1.endpoints import health
from sqlalchemy.sql import text
import structlog

# Initialize logging configuration before app instantiation
configure_logging()
logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "Starting CareerPilot AI Backend",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        api_prefix=settings.API_PREFIX,
        log_level=settings.LOG_LEVEL
    )

    try:
        # Run startup connection verification
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection successfully established and verified.")
    except Exception as e:
        logger.error("Database connection initialization failed on startup.", error=str(e))

    yield

    logger.info("Shutting down CareerPilot AI Backend...")

app = FastAPI(
    title=settings.APP_NAME,
    description="The Intelligent Career Copilot Backend Server",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount health endpoint router directly at root (GET /health)
app.include_router(health.router)

# Mount versioned API routes
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/", tags=["System"])
async def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }
