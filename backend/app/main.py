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

    # 1. Database connection verification
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection successfully established and verified.")
    except Exception as e:
        logger.error("Database connection initialization failed on startup.", error=str(e))
        raise RuntimeError(f"Database connection failed: {str(e)}") from e

    # Skip external service checks during testing environment setup
    import sys
    is_testing = "pytest" in sys.modules or settings.ENVIRONMENT == "testing"
    
    if not is_testing:
        # 2. ChromaDB connection verification
        try:
            from app.modules.rag.dependencies import get_chroma_manager
            chroma_manager = get_chroma_manager()
            if not chroma_manager.validate_connection():
                raise RuntimeError("ChromaDB heartbeat verification failed.")
            logger.info("ChromaDB connection successfully established and verified.")
        except Exception as e:
            logger.error("ChromaDB connection initialization failed on startup.", error=str(e))
            raise RuntimeError(f"ChromaDB connection failed: {str(e)}") from e

        # 3. Ollama connection verification
        try:
            from app.ai.dependencies import get_ai_provider
            ai_provider = get_ai_provider()
            ai_health = await ai_provider.health_check()
            if ai_health.get("status") != "healthy":
                raise RuntimeError(ai_health.get("error", "AI health status not healthy"))
            logger.info(
                "Ollama connection and model successfully verified.",
                model=ai_health.get("model", settings.OLLAMA_MODEL)
            )
        except Exception as e:
            logger.error("Ollama connection verification failed on startup.", error=str(e))
            raise RuntimeError(f"Ollama connection failed: {str(e)}") from e

    yield

    logger.info("Shutting down Scorelia Backend...")

app = FastAPI(
    title=settings.APP_NAME,
    description="The Intelligent Career Copilot Backend Server",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# HTTP request/response logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("Incoming request", method=request.method, path=request.url.path)
    try:
        response = await call_next(request)
        logger.info("Request completed", path=request.url.path, status_code=response.status_code)
        return response
    except Exception as e:
        logger.exception("Request failed", path=request.url.path, error=str(e))
        raise

# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning("HTTP exception occurred", path=request.url.path, status_code=exc.status_code, message=exc.detail)
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
    logger.warning("Request validation failed", path=request.url.path, errors=exc.errors())
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

try:
    from app.ai.exceptions import AIError
    @app.exception_handler(AIError)
    async def ai_exception_handler(request: Request, exc: AIError):
        logger.error("AI service error occurred", path=request.url.path, error=str(exc), error_type=exc.__class__.__name__)
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={
                "error": True,
                "status_code": status.HTTP_502_BAD_GATEWAY,
                "message": f"AI service error: {exc.__class__.__name__}",
                "detail": str(exc)
            }
        )
except ImportError:
    pass


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
