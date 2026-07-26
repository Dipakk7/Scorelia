from pydantic import BaseModel
from typing import List, Optional

# --- Overview & Hero ---
class KPIMetricSchema(BaseModel):
  id: str
  title: str
  value: str
  numericValue: float
  unit: str
  trend: str
  trendDirection: str
  isPositive: bool
  status: str
  iconName: str
  description: str
  sparklineData: List[float]

class AnalyticsOverviewResponse(BaseModel):
  success: bool = True
  message: str = "Analytics overview fetched successfully"
  timestamp: str
  metrics: List[KPIMetricSchema]

# --- Platform Activity ---
class PlatformActivityPointSchema(BaseModel):
  date: str
  displayDate: str
  sessions: int
  pageViews: int
  conversions: int
  bounceRate: float

class PlatformActivityResponse(BaseModel):
  success: bool = True
  message: str = "Platform activity fetched successfully"
  data: List[PlatformActivityPointSchema]

# --- Active Users Growth ---
class ActiveUsersPointSchema(BaseModel):
  date: str
  displayDate: str
  activeUsers: int
  newUsers: int
  returningUsers: int

class ActiveUsersResponse(BaseModel):
  success: bool = True
  message: str = "Active users growth fetched successfully"
  data: List[ActiveUsersPointSchema]

# --- Top Features ---
class TopFeatureUsageSchema(BaseModel):
  id: str
  name: str
  usageCount: int
  percentage: float
  color: str

class TopFeaturesResponse(BaseModel):
  success: bool = True
  message: str = "Top features usage fetched successfully"
  totalUsage: int = 3421
  data: List[TopFeatureUsageSchema]

# --- Performance & Telemetry ---
class PerformanceMetricSchema(BaseModel):
  id: str
  title: str
  value: str
  numericValue: float
  trend: str
  isPositive: bool
  status: str
  iconName: str
  description: str
  comparisonLabel: str
  sparklineData: List[float]
  strokeColor: str
  iconBg: str

class ResponseTimePointSchema(BaseModel):
  date: str
  displayDate: str
  responseTime: float
  target: float

class TaskCompletionPointSchema(BaseModel):
  date: str
  displayDate: str
  completed: int
  pending: int
  failed: int

class SystemHealthServiceSchema(BaseModel):
  id: str
  name: str
  status: str
  value: str
  threshold: str
  lastUpdated: str
  iconName: str

class PerformanceResponse(BaseModel):
  success: bool = True
  message: str = "Performance telemetry fetched successfully"
  metrics: List[PerformanceMetricSchema]
  responseTimeTrend: List[ResponseTimePointSchema]
  taskCompletionTrend: List[TaskCompletionPointSchema]

class SystemHealthResponse(BaseModel):
  success: bool = True
  message: str = "System health services fetched successfully"
  data: List[SystemHealthServiceSchema]

# --- Reports & Data Intelligence ---
class ReportOverviewKPISchema(BaseModel):
  id: str
  title: str
  value: str
  subtitle: str
  iconName: str
  iconBg: str

class ReportTemplateSchema(BaseModel):
  id: str
  name: str
  description: str
  category: str
  estimatedGenerationTime: str
  format: str
  iconName: str
  iconBg: str

class SavedReportSchema(BaseModel):
  id: str
  name: str
  createdAt: str
  lastUpdated: str
  owner: str
  size: str
  status: str
  format: str

class ScheduledReportSchema(BaseModel):
  id: str
  name: str
  frequency: str
  nextRun: str
  deliveryMethod: str
  enabled: bool
  status: str

class ExportOptionSchema(BaseModel):
  id: str
  format: str
  name: str
  description: str
  estimatedSize: str
  compatibility: str
  iconName: str
  iconBg: str

class ReportsDashboardResponse(BaseModel):
  success: bool = True
  message: str = "Reports workspace data fetched successfully"
  overview: List[ReportOverviewKPISchema]
  templates: List[ReportTemplateSchema]
  savedReports: List[SavedReportSchema]
  scheduledReports: List[ScheduledReportSchema]
  exportOptions: List[ExportOptionSchema]

class ReportHistoryItemSchema(BaseModel):
  id: str
  name: str
  status: str
  generatedAt: str
  duration: str
  format: str
  initiatedBy: str

class ReportHistoryResponse(BaseModel):
  success: bool = True
  message: str = "Report history audit log fetched successfully"
  data: List[ReportHistoryItemSchema]

class DataSourceSchema(BaseModel):
  id: str
  name: str
  status: str
  records: str
  lastSync: str
  health: float
  latency: str
  iconName: str

class DataSourcesResponse(BaseModel):
  success: bool = True
  message: str = "Data sources health fetched successfully"
  data: List[DataSourceSchema]

# --- Insights & Activity ---
class AIInsightSchema(BaseModel):
  id: str
  title: str
  summary: str
  severity: str
  severityBadgeText: str
  category: str
  confidence: int
  timestamp: str
  iconName: str
  actionLabel: Optional[str] = None

class ExecutiveRecommendationSchema(BaseModel):
  id: str
  title: str
  description: str
  priority: str
  estimatedImpact: str
  timeToImplement: str
  category: str

class AIInsightsResponse(BaseModel):
  success: bool = True
  message: str = "AI insights fetched successfully"
  insights: List[AIInsightSchema]
  recommendations: List[ExecutiveRecommendationSchema]

class ActivityItemSchema(BaseModel):
  id: str
  title: str
  description: str
  type: str
  status: str
  timestamp: str
  timeGroup: str
  actor: str
  iconName: str
  iconBg: str

class AnalyticsActivityResponse(BaseModel):
  success: bool = True
  message: str = "Activity feed fetched successfully"
  data: List[ActivityItemSchema]
