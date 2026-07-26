import type { KPIMetricItem } from '@/data/analyticsHeroMockData'
import type { AnalyticsChartsData, TopFeatureUsagePoint } from '@/data/analyticsChartsMockData'
import type { AnalyticsPerformanceData, PerformanceMetricItem } from '@/data/analyticsPerformanceMockData'
import type { AnalyticsInsightsData } from '@/data/analyticsInsightsMockData'
import type { AnalyticsReportsData } from '@/data/analyticsReportsMockData'
import type {
  ApiAnalyticsOverviewResponse,
  ApiPlatformActivityResponse,
  ApiActiveUsersResponse,
  ApiTopFeaturesResponse,
  ApiPerformanceResponse,
  ApiSystemHealthResponse,
  ApiReportsDashboardResponse,
  ApiReportHistoryResponse,
  ApiDataSourcesResponse,
  ApiAIInsightsResponse,
  ApiAnalyticsActivityResponse,
} from './analyticsTypes'

export function transformOverviewData(dto?: ApiAnalyticsOverviewResponse): KPIMetricItem[] {
  if (!dto || !dto.metrics || !Array.isArray(dto.metrics)) return []
  return dto.metrics.map((item) => ({
    id: item.id,
    title: item.title,
    value: item.value,
    numericValue: item.numericValue,
    previousValue: '1,002',
    percentageChange: 14.2,
    trend: item.isPositive ? 'positive' : 'negative',
    status: (item.status as any) || 'optimal',
    iconName: (item.iconName as any) || 'Users',
    sparklineData: item.sparklineData,
    description: item.description,
    comparisonLabel: 'vs last timeframe',
    color: '#a855f7',
    strokeColor: '#a855f7',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    timeframe: 'May 11 – May 17',
  }))
}

export function transformChartsData(
  platformDto?: ApiPlatformActivityResponse,
  activeUsersDto?: ApiActiveUsersResponse,
  topFeaturesDto?: ApiTopFeaturesResponse
): AnalyticsChartsData {
  const topFeatures: TopFeatureUsagePoint[] = (topFeaturesDto?.data || []).map((tf) => ({
    feature: tf.name,
    usage: tf.usageCount,
    percentage: tf.percentage,
    color: tf.color || '#a855f7',
    category: 'Intelligence',
  }))

  return {
    platformActivity: platformDto?.data || [],
    activeUsersGrowth: activeUsersDto?.data || [],
    topFeatures,
  }
}

export function transformPerformanceData(
  perfDto?: ApiPerformanceResponse,
  healthDto?: ApiSystemHealthResponse
): AnalyticsPerformanceData {
  const metrics: PerformanceMetricItem[] = (perfDto?.metrics || []).map((m) => ({
    id: m.id,
    title: m.title,
    value: m.value,
    numericValue: m.numericValue,
    trend: m.trend,
    isPositive: m.isPositive,
    status: (m.status as any) || 'healthy',
    iconName: (m.iconName as any) || 'Clock',
    description: m.description,
    comparisonLabel: m.comparisonLabel,
    sparklineData: m.sparklineData,
    strokeColor: m.strokeColor,
    iconBg: m.iconBg,
  }))

  return {
    metrics,
    responseTimeTrend: perfDto?.responseTimeTrend || [],
    taskCompletionTrend: perfDto?.taskCompletionTrend || [],
    healthServices: (healthDto?.data || []).map((s) => ({
      id: s.id,
      name: s.name,
      status: (s.status as any) || 'healthy',
      value: s.value,
      threshold: s.threshold,
      lastUpdated: s.lastUpdated,
      iconName: s.iconName,
    })),
  }
}

export function transformInsightsData(
  insightsDto?: ApiAIInsightsResponse,
  activityDto?: ApiAnalyticsActivityResponse
): AnalyticsInsightsData {
  return {
    insights: (insightsDto?.insights || []).map((i) => ({
      id: i.id,
      title: i.title,
      summary: i.summary,
      severity: (i.severity as any) || 'info',
      severityBadgeText: i.severityBadgeText,
      category: i.category,
      confidence: i.confidence,
      timestamp: i.timestamp,
      iconName: (i.iconName as any) || 'Sparkles',
      actionLabel: i.actionLabel,
    })),
    recommendations: (insightsDto?.recommendations || []).map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      priority: (r.priority as any) || 'Medium',
      estimatedImpact: r.estimatedImpact,
      timeToImplement: r.timeToImplement,
      category: r.category,
    })),
    timelineItems: (activityDto?.data || []).map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      type: (a.type as any) || 'system',
      status: (a.status as any) || 'completed',
      timestamp: a.timestamp,
      timeGroup: (a.timeGroup as any) || 'Today',
      actor: a.actor,
      iconName: a.iconName,
      iconBg: a.iconBg,
    })),
    quickActions: [
      { id: 'qa_create', title: 'Generate Executive Report', description: 'Compile multi-module PDF analytics summary', iconName: 'PlusCircle', category: 'Reporting', enabled: true },
      { id: 'qa_schedule', title: 'Schedule Analytics Sync', description: 'Configure automated daily/weekly email digests', iconName: 'Calendar', category: 'Automation', enabled: true },
      { id: 'qa_download', title: 'Download Raw Telemetry', description: 'Export platform CSV/JSON metrics dataset', iconName: 'Download', category: 'Data', enabled: true },
      { id: 'qa_manage', title: 'Manage Dashboard Widgets', description: 'Customize executive workspace grid layouts', iconName: 'SlidersHorizontal', category: 'Customization', enabled: true },
      { id: 'qa_alerts', title: 'Configure Threshold Alerts', description: 'Set up latency and SLA warning triggers', iconName: 'Bell', category: 'Monitoring', enabled: true },
      { id: 'qa_sources', title: 'Connect Data Sources', description: 'Link external GitHub & ATS data providers', iconName: 'Database', category: 'Integrations', enabled: true },
    ],
  }
}

export function transformReportsData(
  reportsDto?: ApiReportsDashboardResponse,
  historyDto?: ApiReportHistoryResponse,
  sourcesDto?: ApiDataSourcesResponse
): AnalyticsReportsData {
  return {
    overview: (reportsDto?.overview || []).map((o) => ({
      id: o.id,
      title: o.title,
      value: o.value,
      subtitle: o.subtitle,
      iconName: o.iconName,
      iconBg: o.iconBg,
    })),
    templates: (reportsDto?.templates || []).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      estimatedGenerationTime: t.estimatedGenerationTime,
      format: (t.format as any) || 'PDF',
      iconName: t.iconName,
      iconBg: t.iconBg,
    })),
    savedReports: (reportsDto?.savedReports || []).map((s) => ({
      id: s.id,
      name: s.name,
      createdAt: s.createdAt,
      lastUpdated: s.lastUpdated,
      owner: s.owner,
      size: s.size,
      status: (s.status as any) || 'completed',
      format: (s.format as any) || 'PDF',
    })),
    scheduledReports: (reportsDto?.scheduledReports || []).map((sc) => ({
      id: sc.id,
      name: sc.name,
      frequency: (sc.frequency as any) || 'Weekly',
      nextRun: sc.nextRun,
      deliveryMethod: sc.deliveryMethod,
      enabled: sc.enabled,
      status: (sc.status as any) || 'queued',
    })),
    exportOptions: (reportsDto?.exportOptions || []).map((e) => ({
      id: e.id,
      format: (e.format as any) || 'PDF',
      name: e.name,
      description: e.description,
      estimatedSize: e.estimatedSize,
      compatibility: e.compatibility,
      iconName: e.iconName,
      iconBg: e.iconBg,
    })),
    history: (historyDto?.data || []).map((h) => ({
      id: h.id,
      name: h.name,
      status: (h.status as any) || 'completed',
      generatedAt: h.generatedAt,
      duration: h.duration,
      format: (h.format as any) || 'PDF',
      initiatedBy: h.initiatedBy,
    })),
    dataSources: (sourcesDto?.data || []).map((ds) => ({
      id: ds.id,
      name: ds.name,
      status: (ds.status as any) || 'healthy',
      records: ds.records,
      lastSync: ds.lastSync,
      health: ds.health,
      latency: ds.latency,
      iconName: ds.iconName,
    })),
  }
}
