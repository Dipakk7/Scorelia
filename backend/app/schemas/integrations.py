import uuid
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class IntegrationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    provider: str
    name: str
    description: str
    icon_name: str
    is_connected: bool
    status_badge: str
    account_identifier: str | None = None
    avatar_url: str | None = None
    masked_key: str | None = None
    connected_repos_count: int = 0
    connected_channels_count: int = 0
    last_synced_at: datetime | None = None

class ConnectIntegrationRequest(BaseModel):
    provider: str = Field(..., description="Provider identifier (github, google, linkedin, openai, slack)")
    auth_code: str | None = Field(default=None, description="OAuth authorization code")
    api_key: str | None = Field(default=None, description="API Key for key-based providers")

class OpenAIKeyRequest(BaseModel):
    api_key: str = Field(..., min_length=10, description="OpenAI API key (starts with sk-)")
