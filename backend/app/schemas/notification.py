import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class NotificationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
