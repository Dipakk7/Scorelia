export type ReportStatusType = 'completed' | 'running' | 'queued' | 'failed' | 'cancelled'
export type ExportFormatType = 'PDF' | 'Excel' | 'CSV' | 'JSON' | 'PowerPoint'

export interface ReportOverviewKPIData {
  id: string
  title: string
  value: string
  subtitle: string
  iconName: string
  iconBg: string
}

export interface ReportTemplateItem {
  id: string
  name: string
  description: string
  category: string
  estimatedGenerationTime: string
  format: ExportFormatType
  iconName: string
  iconBg: string
}

export interface SavedReportItem {
  id: string
  name: string
  createdAt: string
  lastUpdated: string
  owner: string
  size: string
  status: ReportStatusType
  format: ExportFormatType
}

export interface ScheduledReportItem {
  id: string
  name: string
  frequency: 'Daily' | 'Weekly' | 'Monthly'
  nextRun: string
  deliveryMethod: string
  enabled: boolean
  status: ReportStatusType
}

export interface ExportOptionItem {
  id: string
  format: ExportFormatType
  name: string
  description: string
  estimatedSize: string
  compatibility: string
  iconName: string
  iconBg: string
}

export interface ReportHistoryItemData {
  id: string
  name: string
  status: ReportStatusType
  generatedAt: string
  duration: string
  format: ExportFormatType
  initiatedBy: string
}

export interface DataSourceItem {
  id: string
  name: string
  status: 'healthy' | 'warning' | 'critical'
  records: string
  lastSync: string
  health: number
  latency: string
  iconName: string
}

export interface AnalyticsReportsData {
  overview: ReportOverviewKPIData[]
  templates: ReportTemplateItem[]
  savedReports: SavedReportItem[]
  scheduledReports: ScheduledReportItem[]
  exportOptions: ExportOptionItem[]
  history: ReportHistoryItemData[]
  dataSources: DataSourceItem[]
}

export const analyticsReportsMockData: AnalyticsReportsData = {
  overview: [
    { id: 'total_reports', title: 'Total Reports', value: '128', subtitle: '+12 this month', iconName: 'FileText', iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'scheduled_jobs', title: 'Scheduled Jobs', value: '12', subtitle: '4 running weekly', iconName: 'Calendar', iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'successful_exports', title: 'Export Success', value: '98.4%', subtitle: 'vs 95% SLA', iconName: 'CheckCircle', iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'storage_used', title: 'Storage Used', value: '1.24 GB', subtitle: 'of 10 GB limit', iconName: 'HardDrive', iconBg: 'bg-[#a855f7]/20 text-indigo-400 border-indigo-500/30' },
    { id: 'generation_time', title: 'Avg Gen Time', value: '2.4s', subtitle: '↓ 0.6s vs last week', iconName: 'Clock', iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'report_success', title: 'Report Success Rate', value: '99.2%', subtitle: '127/128 completed', iconName: 'Target', iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  ],
  templates: [
    { id: 'tmpl_exec', name: 'Executive Summary', description: 'Comprehensive multi-module KPI dashboard overview for leadership.', category: 'Executive', estimatedGenerationTime: '~2.5s', format: 'PDF', iconName: 'FileText', iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'tmpl_ats', name: 'ATS Compliance Audit', description: 'Detailed candidate ATS compliance metrics, keyword gaps, and score distributions.', category: 'Compliance', estimatedGenerationTime: '~1.8s', format: 'Excel', iconName: 'Scan', iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'tmpl_pipeline', name: 'Candidate Pipeline Trends', description: 'Funnel analytics tracking candidate progression and interview preparation readiness.', category: 'Pipeline', estimatedGenerationTime: '~3.1s', format: 'PowerPoint', iconName: 'TrendingUp', iconBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
    { id: 'tmpl_perf', name: 'System Performance SLA', description: 'Infrastructure metrics audit including endpoint latency, uptime, and database queries.', category: 'Engineering', estimatedGenerationTime: '~1.2s', format: 'JSON', iconName: 'Activity', iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  ],
  savedReports: [
    { id: 'rep_1', name: 'Q2 Executive Intelligence Digest', createdAt: '2025-05-15', lastUpdated: '2025-05-17', owner: 'Dipak Khandagale', size: '4.2 MB', status: 'completed', format: 'PDF' },
    { id: 'rep_2', name: 'ATS Compliance & Keyword Audit', createdAt: '2025-05-14', lastUpdated: '2025-05-16', owner: 'Engineering Team', size: '1.8 MB', status: 'completed', format: 'Excel' },
    { id: 'rep_3', name: 'Weekly System Performance SLA Report', createdAt: '2025-05-12', lastUpdated: '2025-05-15', owner: 'DevOps Automated', size: '850 KB', status: 'completed', format: 'JSON' },
    { id: 'rep_4', name: 'Candidate Interview Preparedness Summary', createdAt: '2025-05-10', lastUpdated: '2025-05-11', owner: 'HR Analytics', size: '12.4 MB', status: 'completed', format: 'PowerPoint' },
    { id: 'rep_5', name: 'Raw Telemetry Event Stream', createdAt: '2025-05-08', lastUpdated: '2025-05-09', owner: 'Dipak Khandagale', size: '24.1 MB', status: 'completed', format: 'CSV' },
  ],
  scheduledReports: [
    { id: 'sched_1', name: 'Weekly Executive Briefing', frequency: 'Weekly', nextRun: 'May 19, 2025 • 09:00 AM', deliveryMethod: 'Email PDF (Executive Board)', enabled: true, status: 'queued' },
    { id: 'sched_2', name: 'Daily Infrastructure Health Audit', frequency: 'Daily', nextRun: 'May 18, 2025 • 00:00 AM', deliveryMethod: 'Slack Webhook (#eng-alerts)', enabled: true, status: 'queued' },
    { id: 'sched_3', name: 'Monthly Candidate Pipeline Review', frequency: 'Monthly', nextRun: 'June 1, 2025 • 08:00 AM', deliveryMethod: 'Email PDF & Excel', enabled: true, status: 'queued' },
    { id: 'sched_4', name: 'Bi-Weekly ATS Scoring Benchmark', frequency: 'Weekly', nextRun: 'May 22, 2025 • 10:00 AM', deliveryMethod: 'Email CSV Data', enabled: false, status: 'cancelled' },
  ],
  exportOptions: [
    { id: 'exp_pdf', format: 'PDF', name: 'Executive PDF Document', description: 'High-resolution vector report layout suitable for executive presentations.', estimatedSize: '~4.5 MB', compatibility: 'Adobe Acrobat, All Browsers', iconName: 'FileText', iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'exp_xlsx', format: 'Excel', name: 'Microsoft Excel Spreadsheet', description: 'Multi-sheet workbook containing raw tabular data, formulas, and charts.', estimatedSize: '~2.1 MB', compatibility: 'MS Excel, Google Sheets', iconName: 'FileSpreadsheet', iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'exp_csv', format: 'CSV', name: 'Comma Separated Values', description: 'Lightweight plain-text matrix representation for data warehouse ingestion.', estimatedSize: '~650 KB', compatibility: 'Python Pandas, BI Tools', iconName: 'Table', iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'exp_json', format: 'JSON', name: 'Structured JSON Payload', description: 'Fully typed schema dataset payload optimized for API integrations.', estimatedSize: '~1.1 MB', compatibility: 'REST/GraphQL Clients', iconName: 'Code', iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'exp_pptx', format: 'PowerPoint', name: 'PowerPoint Presentation', description: 'Formatted slide deck template containing auto-generated charts & takeaways.', estimatedSize: '~14.2 MB', compatibility: 'MS PowerPoint, Keynote', iconName: 'Presentation', iconBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  ],
  history: [
    { id: 'hist_1', name: 'Q2 Executive Intelligence Digest', status: 'completed', generatedAt: '2m ago', duration: '2.4s', format: 'PDF', initiatedBy: 'Dipak Khandagale' },
    { id: 'hist_2', name: 'ATS Compliance & Keyword Audit', status: 'completed', generatedAt: '15m ago', duration: '1.8s', format: 'Excel', initiatedBy: 'Automated Job' },
    { id: 'hist_3', name: 'Raw Telemetry Event Stream', status: 'completed', generatedAt: '1h ago', duration: '3.6s', format: 'CSV', initiatedBy: 'Dipak Khandagale' },
    { id: 'hist_4', name: 'Daily Infrastructure Health Audit', status: 'completed', generatedAt: '3h ago', duration: '1.1s', format: 'JSON', initiatedBy: 'DevOps Scheduler' },
    { id: 'hist_5', name: 'Bi-Weekly ATS Benchmark', status: 'failed', generatedAt: '1d ago', duration: '0.8s', format: 'CSV', initiatedBy: 'Automated Job' },
  ],
  dataSources: [
    { id: 'ds_postgres', name: 'PostgreSQL Relational DB', status: 'healthy', records: '1,420,890', lastSync: '1m ago', health: 99.9, latency: '14ms', iconName: 'Database' },
    { id: 'ds_chroma', name: 'ChromaDB Vector Store', status: 'healthy', records: '482,100', lastSync: '2m ago', health: 99.8, latency: '18ms', iconName: 'Layers' },
    { id: 'ds_ollama', name: 'Ollama LLM Orchestrator', status: 'healthy', records: '128,450', lastSync: '1m ago', health: 99.5, latency: '1.42s', iconName: 'Bot' },
    { id: 'ds_ats', name: 'Scorelia ATS Engine', status: 'healthy', records: '342,100', lastSync: '3m ago', health: 99.9, latency: '22ms', iconName: 'Scan' },
    { id: 'ds_parser', name: 'Resume AI Parser', status: 'healthy', records: '89,200', lastSync: '1m ago', health: 99.7, latency: '1.12s', iconName: 'FileText' },
    { id: 'ds_redis', name: 'Redis Analytics Cache', status: 'healthy', records: '2,480,000', lastSync: 'Real-time', health: 100, latency: '2ms', iconName: 'Zap' },
  ],
}

export default analyticsReportsMockData
