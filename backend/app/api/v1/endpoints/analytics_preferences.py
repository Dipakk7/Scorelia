from fastapi import APIRouter, Depends, status
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics_preferences import (
  AnalyticsPreferencesResponse,
  UserAnalyticsPreferencesSchema,
)

router = APIRouter()

DEFAULT_PREFERENCES = {
  "selectedPresetId": "exec_overview",
  "widgets": [
    {"id": "hero_kpis", "name": "Executive Hero KPIs", "category": "Overview", "visible": True, "size": "full", "order": 1, "pinned": True},
    {"id": "platform_activity", "name": "Platform Activity Chart", "category": "Charts", "visible": True, "size": "medium", "order": 2, "pinned": False},
    {"id": "active_users", "name": "Active Users Growth", "category": "Charts", "visible": True, "size": "medium", "order": 3, "pinned": False},
    {"id": "top_features", "name": "Top Features Usage", "category": "Charts", "visible": True, "size": "medium", "order": 4, "pinned": False},
    {"id": "performance_overview", "name": "System Performance SLA", "category": "Performance", "visible": True, "size": "full", "order": 5, "pinned": False},
    {"id": "ai_insights", "name": "AI Executive Insights", "category": "Intelligence", "visible": True, "size": "small", "order": 6, "pinned": True},
    {"id": "activity_timeline", "name": "Activity Feed Log", "category": "Intelligence", "visible": True, "size": "small", "order": 7, "pinned": False},
    {"id": "quick_actions", "name": "Productivity Quick Actions", "category": "Utilities", "visible": True, "size": "small", "order": 8, "pinned": False},
  ],
  "favoriteReportIds": ["rep_1", "rep_2"],
  "pinnedInsightIds": ["engagement_spike"],
  "collapsedSectionIds": [],
  "displayPreferences": {
    "theme": "dark",
    "compactMode": False,
    "autoRefreshInterval": 300,
    "showSparklines": True,
  },
}

@router.get(
  "",
  response_model=AnalyticsPreferencesResponse,
  status_code=status.HTTP_200_OK,
  summary="Get User Analytics Preferences",
)
async def get_user_preferences(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "User analytics preferences retrieved successfully",
    "data": DEFAULT_PREFERENCES,
  }

@router.put(
  "",
  response_model=AnalyticsPreferencesResponse,
  status_code=status.HTTP_200_OK,
  summary="Save User Analytics Preferences",
)
async def update_user_preferences(
  prefs: UserAnalyticsPreferencesSchema,
  current_user: User = Depends(get_current_user),
):
  return {
    "success": True,
    "message": "Analytics preferences updated successfully",
    "data": prefs.dict(),
  }

@router.post(
  "/reset",
  response_model=AnalyticsPreferencesResponse,
  status_code=status.HTTP_200_OK,
  summary="Reset Analytics Preferences to Defaults",
)
async def reset_user_preferences(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Analytics preferences reset to factory defaults",
    "data": DEFAULT_PREFERENCES,
  }
