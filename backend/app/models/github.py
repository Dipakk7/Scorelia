"""
GitHub Database ORM Models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.sql import func
from app.core.db import Base

class GitHubConnection(Base):
    """SQLAlchemy model storing user GitHub OAuth tokens and connection state."""
    __tablename__ = "github_connections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    github_username = Column(String(255), nullable=False)
    access_token = Column(String(512), nullable=False)
    is_connected = Column(Boolean, default=True)
    rate_limit_remaining = Column(Integer, default=5000)
    rate_limit_reset = Column(Integer, default=0)
    last_synced_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GitHubRepositoryModel(Base):
    """SQLAlchemy model for synchronized GitHub repositories."""
    __tablename__ = "github_repositories"

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(Integer, ForeignKey("github_connections.id"), nullable=False)
    github_repo_id = Column(String(100), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    visibility = Column(String(20), default="Public")
    language = Column(String(100), nullable=True)
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    issues = Column(Integer, default=0)
    health = Column(String(50), default="Good")
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

class GitHubSyncHistory(Base):
    """SQLAlchemy model tracking sync history logs."""
    __tablename__ = "github_sync_history"

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(Integer, ForeignKey("github_connections.id"), nullable=False)
    status = Column(String(50), default="success")
    synced_items_count = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
