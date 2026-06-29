from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

@api_router.get("", tags=["System"])
async def get_v1_index():
    return {
        "version": "1.0",
        "modules": {
            "auth": "placeholder",
            "resumes": "placeholder",
            "jobs": "placeholder",
            "interviews": "placeholder",
            "chats": "placeholder"
        }
    }
