export interface ApiKPIMetricDTO {
  id: string
  title: string
  value: string
  numericValue: number
  unit: string
  trend: string
  trendDirection: string
  isPositive: boolean
  status: string
  iconName: string
  description: string
  sparklineData: number[]
}

export interface ApiAnalyticsOverviewResponse {
  success: boolean
  message: string
  timestamp: string
  metrics: ApiKPIMetricDTO[]
}

export interface ApiPlatformActivityPointDTO {
  date: string
  displayDate: string
  sessions: number
  pageViews: number
  conversions: number
  bounceRate: number
}

export interface ApiPlatformActivityResponse {
  success: boolean
  message: string
  data: ApiPlatformActivityPointDTO[]
}

export interface ApiActiveUsersPointDTO {
  date: string
  displayDate: string
  activeUsers: number
  newUsers: number
  returningUsers: number
}

export interface ApiActiveUsersResponse {
  success: boolean
  message: string
  data: ApiActiveUsersPointDTO[]
}

export interface ApiTopFeatureUsageDTO {
  id: string
  name: string
  usageCount: number
  percentage: number
  color: string
}

export interface ApiTopFeaturesResponse {
  success: boolean
  message: string
  totalUsage: number
  data: ApiTopFeatureUsageDTO[]
}

export interface ApiPerformanceMetricDTO {
  id: string
  title: string
  value: string
  numericValue: number
  trend: string
  isPositive: boolean
  status: string
  iconName: string
  description: string
  comparisonLabel: string
  sparklineData: number[]
  strokeColor: string
  iconBg: string
}

export interface ApiResponseTimePointDTO {
  date: string
  displayDate: string
  responseTime: number
  target: number
}

export interface ApiTaskCompletionPointDTO {
  date: string
  displayDate: string
  completed: number
  pending: number
  failed: number
}

export interface ApiPerformanceResponse {
  success: boolean
  message: string
  metrics: ApiPerformanceMetricDTO[]
  responseTimeTrend: ApiResponseTimePointDTO[]
  taskCompletionTrend: ApiTaskCompletionPointDTO[]
}

export interface ApiSystemHealthServiceDTO {
  id: string
  name: string
  status: string
  value: string
  threshold: string
  lastUpdated: string
  iconName: string
}

export interface ApiSystemHealthResponse {
  success: boolean
  message: string
  data: ApiSystemHealthServiceDTO[]
}

export interface ApiReportOverviewKPIDTO {
  id: string
  title: string
  value: string
  subtitle: string
  iconName: string
  iconBg: string
}

export interface ApiReportTemplateDTO {
  id: string
  name: string
  description: string
  category: string
  estimatedGenerationTime: string
  format: string
  iconName: string
  iconBg: string
}

export interface ApiSavedReportDTO {
  id: string
  name: string
  createdAt: string
  lastUpdated: string
  owner: string
  size: string
  status: string
  format: string
}

export interface ApiScheduledReportDTO {
  id: string
  name: string
  frequency: string
  nextRun: string
  deliveryMethod: string
  enabled: boolean
  status: string
}

export interface ApiExportOptionDTO {
  id: string
  format: string
  name: string
  description: string
  estimatedSize: string
  compatibility: string
  iconName: string
  iconBg: string
}

export interface ApiReportsDashboardResponse {
  success: boolean
  message: string
  overview: ApiReportOverviewKPIDTO[]
  templates: ApiReportTemplateDTO[]
  savedReports: ApiSavedReportDTO[]
  scheduledReports: ApiScheduledReportDTO[]
  exportOptions: ApiExportOptionDTO[]
}

export interface ApiReportHistoryItemDTO {
  id: string
  name: string
  status: string
  generatedAt: string
  duration: string
  format: string
  initiatedBy: string
}

export interface ApiReportHistoryResponse {
  success: boolean
  message: string
  data: ApiReportHistoryItemDTO[]
}

export interface ApiDataSourceDTO {
  id: string
  name: string
  status: string
  records: string
  lastSync: string
  health: number
  latency: string
  iconName: string
}

export interface ApiDataSourcesResponse {
  success: boolean
  message: string
  data: ApiDataSourceDTO[]
}

export interface ApiAIInsightDTO {
  id: string
  title: string
  summary: string
  severity: string
  severityBadgeText: string
  category: string
  confidence: number
  timestamp: string
  iconName: string
  actionLabel?: string
}

export interface ApiExecutiveRecommendationDTO {
  id: string
  title: string
  description: string
  priority: string
  estimatedImpact: string
  timeToImplement: string
  category: string
}

export interface ApiAIInsightsResponse {
  success: boolean
  message: string
  insights: ApiAIInsightDTO[]
  recommendations: ApiExecutiveRecommendationDTO[]
}

export interface ApiActivityItemDTO {
  id: string
  title: string
  description: string
  type: string
  status: string
  timestamp: string
  timeGroup: string
  actor: string
  iconName: string
  iconBg: string
}

export interface ApiAnalyticsActivityResponse {
  success: boolean
  message: string
  data: ApiActivityItemDTO[]
}
