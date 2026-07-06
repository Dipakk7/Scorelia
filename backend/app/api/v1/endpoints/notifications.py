import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.db import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse

router = APIRouter()

@router.get("", response_model=dict, status_code=status.HTTP_200_OK)
async def get_notifications(
    is_read: bool | None = Query(default=None, description="Filter by read/unread status"),
    notification_type: str | None = Query(default=None, alias="type", description="Filter by notification type"),
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve paginated and filterable notifications for the logged-in user."""
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    
    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)
        
    if notification_type:
        query = query.filter(Notification.type == notification_type)
        
    total = query.count()
    
    # Sort chronologically, newest first
    notifications = (
        query.order_by(desc(Notification.created_at))
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    
    # Get total unread count
    unread_count = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.is_read == False)
        .count()
    )
    
    return {
        "notifications": [NotificationResponse.model_validate(n) for n in notifications],
        "total": total,
        "page": page,
        "limit": limit,
        "unread_count": unread_count
    }

@router.put("/mark-all-read", response_model=dict, status_code=status.HTTP_200_OK)
async def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all unread notifications of the user as read."""
    unread_notifications = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.is_read == False)
        .all()
    )
    
    for notification in unread_notifications:
        notification.is_read = True
        
    db.commit()
    
    return {
        "success": True,
        "message": f"Successfully marked {len(unread_notifications)} notifications as read"
    }

@router.put("/{notification_id}/read", response_model=NotificationResponse, status_code=status.HTTP_200_OK)
async def mark_notification_as_read(
    notification_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a specific notification as read."""
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
        
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    
    return notification

@router.delete("/{notification_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_notification(
    notification_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific notification."""
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
        
    db.delete(notification)
    db.commit()
    
    return {
        "success": True,
        "message": "Notification successfully deleted"
    }
