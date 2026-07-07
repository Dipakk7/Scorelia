from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from starlette.exceptions import HTTPException as StarletteHTTPException
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
        "Starting Scorelia Backend",
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

    logger.info("Shutting down Scorelia Backend...")

app = FastAPI(
    title=settings.APP_NAME,
    description="The Intelligent Career Copilot Backend Server",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "message": exc.detail,
            "detail": None
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "message": "Validation error",
            "detail": jsonable_encoder(exc.errors())
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server error occurred", error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "message": "Internal server error",
            "detail": None
        }
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
