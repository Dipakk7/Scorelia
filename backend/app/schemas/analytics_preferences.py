from pydantic import BaseModel
from typing import List, Optional

class WidgetPreferenceSchema(BaseModel):
  id: str
  name: str
  category: str
  visible: bool
  size: str = "medium"
  order: int
  pinned: bool = False

class PresetSchema(BaseModel):
  id: str
  name: str
  description: str
  isDefault: bool = False
  widgetIds: List[str]

class DisplayPreferencesSchema(BaseModel):
  theme: str = "dark"
  compactMode: bool = False
  autoRefreshInterval: int = 300
  showSparklines: bool = True

class UserAnalyticsPreferencesSchema(BaseModel):
  selectedPresetId: str = "exec_overview"
  widgets: List[WidgetPreferenceSchema]
  favoriteReportIds: List[str] = []
  pinnedInsightIds: List[str] = []
  collapsedSectionIds: List[str] = []
  displayPreferences: DisplayPreferencesSchema = DisplayPreferencesSchema()

class AnalyticsPreferencesResponse(BaseModel):
  success: bool = True
  message: str = "User analytics preferences retrieved successfully"
  data: UserAnalyticsPreferencesSchema
