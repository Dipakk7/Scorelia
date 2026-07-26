export type InsightSeverityType = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type ActivityStatusType = 'completed' | 'running' | 'queued' | 'failed' | 'cancelled'

export interface AIInsightItem {
  id: string
  title: string
  summary: string
  severity: InsightSeverityType
  severityBadgeText: string
  category: string
  confidence: number
  timestamp: string
  iconName: 'TrendingUp' | 'Sparkles' | 'Zap' | 'AlertTriangle' | 'ShieldAlert'
  actionLabel?: string
}

export interface ExecutiveRecommendationItem {
  id: string
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  estimatedImpact: string
  timeToImplement: string
  category: string
}

export interface ActivityTimelineItemData {
  id: string
  title: string
  description: string
  type: 'resume' | 'ats' | 'interview' | 'cover_letter' | 'roadmap' | 'system'
  status: ActivityStatusType
  timestamp: string
  timeGroup: 'Today' | 'Yesterday' | 'Earlier'
  actor: string
  iconName: string
  iconBg: string
}

export interface QuickActionItemData {
  id: string
  title: string
  description: string
  iconName: string
  category: string
  enabled: boolean
}

export interface AnalyticsInsightsData {
  insights: AIInsightItem[]
  recommendations: ExecutiveRecommendationItem[]
  timelineItems: ActivityTimelineItemData[]
  quickActions: QuickActionItemData[]
}

export const analyticsInsightsMockData: AnalyticsInsightsData = {
  insights: [
    {
      id: 'engagement_spike',
      title: 'User Engagement',
      summary: 'Engagement is 24% higher than last week across interactive modules.',
      severity: 'high',
      severityBadgeText: 'High',
      category: 'User Behavior',
      confidence: 94,
      timestamp: '10m ago',
      iconName: 'TrendingUp',
      actionLabel: 'View Breakdown',
    },
    {
      id: 'feature_growth',
      title: 'Feature Opportunity',
      summary: 'Career Roadmap usage is growing fast among senior candidates.',
      severity: 'medium',
      severityBadgeText: 'Medium',
      category: 'Feature Adoption',
      confidence: 88,
      timestamp: '25m ago',
      iconName: 'Sparkles',
      actionLabel: 'Explore Roadmap',
    },
    {
      id: 'system_performance',
      title: 'Performance',
      summary: 'System performance is optimal with average response latency at 1.32s.',
      severity: 'low',
      severityBadgeText: 'Good',
      category: 'Infrastructure',
      confidence: 99,
      timestamp: '1h ago',
      iconName: 'Zap',
      actionLabel: 'Check Uptime',
    },
    {
      id: 'retention_dip',
      title: 'Retention',
      summary: '7-day retention dropped by 3% following recent UI navigation updates.',
      severity: 'critical',
      severityBadgeText: 'Watch',
      category: 'Retention',
      confidence: 82,
      timestamp: '2h ago',
      iconName: 'AlertTriangle',
      actionLabel: 'Audit Retention',
    },
  ],
  recommendations: [
    {
      id: 'rec_interview',
      title: 'Optimize Mock Interview Feedback Loops',
      description: 'Streamline AI feedback latency to increase session completions.',
      priority: 'High',
      estimatedImpact: '+18% Engagement',
      timeToImplement: '2-3 days',
      category: 'User Retention',
    },
    {
      id: 'rec_ats',
      title: 'Expand ATS Keyword Parsing Models',
      description: 'Incorporate new tech stack tags for engineering job descriptions.',
      priority: 'Medium',
      estimatedImpact: '+12% ATS Score Accuracy',
      timeToImplement: '1 week',
      category: 'Intelligence',
    },
    {
      id: 'rec_cache',
      title: 'Enable RAG Knowledge Cache Pre-warming',
      description: 'Pre-cache top 100 domain queries to reduce retrieval latency.',
      priority: 'Low',
      estimatedImpact: '-150ms Retrieval Latency',
      timeToImplement: '1-2 days',
      category: 'Performance',
    },
  ],
  timelineItems: [
    {
      id: 'act_1',
      title: 'Resume analyzed',
      description: 'Senior Software Engineer resume parsed and scored 94/100.',
      type: 'resume',
      status: 'completed',
      timestamp: '2m ago',
      timeGroup: 'Today',
      actor: 'AI Resume Engine',
      iconName: 'FileText',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      id: 'act_2',
      title: 'ATS report generated',
      description: 'Full compliance report generated for vacancy target #4092.',
      type: 'ats',
      status: 'completed',
      timestamp: '5m ago',
      timeGroup: 'Today',
      actor: 'Scorelia ATS',
      iconName: 'Scan',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      id: 'act_3',
      title: 'Mock interview completed',
      description: 'System Architecture interview prep drill scored 89% STAR accuracy.',
      type: 'interview',
      status: 'completed',
      timestamp: '12m ago',
      timeGroup: 'Today',
      actor: 'Interview Coach',
      iconName: 'UserCheck',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'act_4',
      title: 'Cover letter created',
      description: 'Targeted executive cover letter drafted for Lead Architect role.',
      type: 'cover_letter',
      status: 'completed',
      timestamp: '18m ago',
      timeGroup: 'Today',
      actor: 'AI Letter Writer',
      iconName: 'MailOpen',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'act_5',
      title: 'Roadmap updated',
      description: 'Distributed Systems learning track updated with 3 new milestones.',
      type: 'roadmap',
      status: 'completed',
      timestamp: '25m ago',
      timeGroup: 'Today',
      actor: 'Career Planner',
      iconName: 'Map',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
  ],
  quickActions: [
    { id: 'qa_create', title: 'Generate Executive Report', description: 'Compile multi-module PDF analytics summary', iconName: 'PlusCircle', category: 'Reporting', enabled: true },
    { id: 'qa_schedule', title: 'Schedule Analytics Sync', description: 'Configure automated daily/weekly email digests', iconName: 'Calendar', category: 'Automation', enabled: true },
    { id: 'qa_download', title: 'Download Raw Telemetry', description: 'Export platform CSV/JSON metrics dataset', iconName: 'Download', category: 'Data', enabled: true },
    { id: 'qa_manage', title: 'Manage Dashboard Widgets', description: 'Customize executive workspace grid layouts', iconName: 'SlidersHorizontal', category: 'Customization', enabled: true },
    { id: 'qa_alerts', title: 'Configure Threshold Alerts', description: 'Set up latency and SLA warning triggers', iconName: 'Bell', category: 'Monitoring', enabled: true },
    { id: 'qa_sources', title: 'Connect Data Sources', description: 'Link external GitHub & ATS data providers', iconName: 'Database', category: 'Integrations', enabled: true },
  ],
}

export default analyticsInsightsMockData
