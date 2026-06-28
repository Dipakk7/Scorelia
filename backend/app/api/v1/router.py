from fastapi import APIRouter

api_router = APIRouter()

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
