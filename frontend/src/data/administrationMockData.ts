export type AuditSeverity = 'critical' | 'warning' | 'info' | 'notice'
export type AuditCategory = 'Agent' | 'Automation' | 'Knowledge' | 'System' | 'Security' | 'User'

export interface AuditLogItem {
  id: string
  timestamp: string
  user: string
  action: string
  target: string
  category: AuditCategory
  severity: AuditSeverity
  status: 'success' | 'failed' | 'denied'
  duration: string
  ipAddress: string
  details: string
}

export interface ExecutionLogItem {
  id: string
  timestamp: string
  agentName: string
  taskName: string
  status: 'completed' | 'failed' | 'running' | 'cancelled'
  duration: string
  tokensUsed: number
  cpuUtilization: string
  memoryUsage: string
  failureReason?: string
  retryCount: number
}

export interface ReportTemplateItem {
  id: string
  name: string
  category: string
  description: string
  supportedFormats: ('PDF' | 'CSV' | 'JSON')[]
  estimatedGenerationTime: string
}

export interface GeneratedReportItem {
  id: string
  name: string
  templateName: string
  format: 'PDF' | 'CSV' | 'JSON'
  size: string
  createdDate: string
  downloadUrl: string
}

export interface ScheduledReportItem {
  id: string
  name: string
  frequency: 'Daily' | 'Weekly' | 'Monthly'
  format: 'PDF' | 'CSV'
  recipients: string[]
  nextRun: string
  status: 'Active' | 'Paused'
}

export interface ExportJobItem {
  id: string
  fileName: string
  format: 'CSV' | 'JSON' | 'PDF'
  size: string
  createdTime: string
  status: 'Ready' | 'Processing' | 'Expired'
}

// 20 Audit Log Items
export const mockAuditLogs: AuditLogItem[] = [
  { id: 'aud-1', timestamp: '2026-07-26 18:20:12', user: 'dipak@scorelia.ai', action: 'UPDATE_AGENT_STATUS', target: 'Resume Assistant', category: 'Agent', severity: 'info', status: 'success', duration: '120ms', ipAddress: '192.168.1.45', details: 'Status toggled from paused to active.' },
  { id: 'aud-2', timestamp: '2026-07-26 18:15:04', user: 'system', action: 'PINECONE_INDEX_SYNC', target: 'Pinecone RAG Vector Index', category: 'Knowledge', severity: 'info', status: 'success', duration: '2.4s', ipAddress: '10.0.0.12', details: 'Synced 420 vector embedding chunks.' },
  { id: 'aud-3', timestamp: '2026-07-26 17:55:30', user: 'dipak@scorelia.ai', action: 'DELETE_TASK_QUEUE', target: 'Task-11', category: 'Agent', severity: 'warning', status: 'success', duration: '85ms', ipAddress: '192.168.1.45', details: 'Cancelled executive board bio generation task.' },
  { id: 'aud-4', timestamp: '2026-07-26 17:30:15', user: 'admin@scorelia.ai', action: 'ROTATE_API_KEY', target: 'FastAPI Production Key', category: 'Security', severity: 'critical', status: 'success', duration: '450ms', ipAddress: '192.168.1.10', details: 'Rotated production API auth tokens.' },
  { id: 'aud-5', timestamp: '2026-07-26 16:45:22', user: 'system', action: 'AUTOMATION_TRIGGER', target: 'Daily ATS Compatibility Scan', category: 'Automation', severity: 'info', status: 'success', duration: '42s', ipAddress: '10.0.0.5', details: 'Executed automated daily ATS scan.' },
  { id: 'aud-6', timestamp: '2026-07-26 16:10:18', user: 'dipak@scorelia.ai', action: 'ASSIGN_KNOWLEDGE', target: 'FAANG Salary Benchmarks', category: 'Knowledge', severity: 'info', status: 'success', duration: '110ms', ipAddress: '192.168.1.45', details: 'Bound collection to Salary Negotiator.' },
  { id: 'aud-7', timestamp: '2026-07-26 15:20:00', user: 'system', action: 'WORKER_POOL_AUTOSCALE', target: 'Inference Worker Pool', category: 'System', severity: 'info', status: 'success', duration: '1.2s', ipAddress: '10.0.0.1', details: 'Scaled worker instances from 4 to 6.' },
  { id: 'aud-[#8]', timestamp: '2026-07-26 14:05:12', user: 'guest@scorelia.ai', action: 'ACCESS_ADMIN_PANEL', target: 'System Administration', category: 'Security', severity: 'warning', status: 'denied', duration: '15ms', ipAddress: '203.0.113.88', details: 'Unauthorized admin panel access attempt.' },
  { id: 'aud-9', timestamp: '2026-07-26 13:40:55', user: 'dipak@scorelia.ai', action: 'CREATE_AUTOMATION', target: 'GitHub AST Quality Guard', category: 'Automation', severity: 'info', status: 'success', duration: '210ms', ipAddress: '192.168.1.45', details: 'Created event-driven GitHub AST workflow.' },
  { id: 'aud-10', timestamp: '2026-07-26 12:15:30', user: 'system', action: 'DATABASE_BACKUP', target: 'PostgreSQL Telemetry DB', category: 'System', severity: 'info', status: 'success', duration: '14.5s', ipAddress: '10.0.0.30', details: 'Automated daily telemetry database snapshot.' },
  { id: 'aud-11', timestamp: '2026-07-26 11:30:10', user: 'dipak@scorelia.ai', action: 'EXPORT_ANALYTICS_CSV', target: 'Performance Analytics 90d', category: 'User', severity: 'info', status: 'success', duration: '320ms', ipAddress: '192.168.1.45', details: 'Downloaded CSV telemetry export.' },
  { id: 'aud-12', timestamp: '2026-07-26 10:45:00', user: 'system', action: 'EMBEDDING_LATENCY_ALERT', target: 'Embedding API Service', category: 'System', severity: 'warning', status: 'failed', duration: '185ms', ipAddress: '10.0.0.15', details: 'Latency spike exceeded 150ms threshold.' },
  { id: 'aud-13', timestamp: '2026-07-26 09:20:45', user: 'dipak@scorelia.ai', action: 'PAUSE_AGENT', target: 'Data Analyst Agent', category: 'Agent', severity: 'notice', status: 'success', duration: '90ms', ipAddress: '192.168.1.45', details: 'User paused agent during maintenance.' },
  { id: 'aud-14', timestamp: '2026-07-26 08:10:30', user: 'system', action: 'HEALTH_CHECK_DIAGNOSTIC', target: 'Inference Engine', category: 'System', severity: 'info', status: 'success', duration: '150ms', ipAddress: '10.0.0.1', details: 'Diagnostic check passed 100% tests.' },
  { id: 'aud-15', timestamp: '2026-07-26 07:05:00', user: 'admin@scorelia.ai', action: 'UPDATE_ROLE_PERMISSIONS', target: 'Role: Senior Developer', category: 'Security', severity: 'critical', status: 'success', duration: '340ms', ipAddress: '192.168.1.10', details: 'Granted knowledge collection assignment scope.' },
  { id: 'aud-16', timestamp: '2026-07-25 23:45:10', user: 'system', action: 'CLEARED_EXPIRED_NOTIFICATIONS', target: 'Notification Stream', category: 'System', severity: 'info', status: 'success', duration: '50ms', ipAddress: '10.0.0.2', details: 'Pruned 45 stale notifications.' },
  { id: 'aud-17', timestamp: '2026-07-25 22:30:15', user: 'dipak@scorelia.ai', action: 'RETRY_FAILED_TASK', target: 'Compensation Benchmark', category: 'Agent', severity: 'info', status: 'success', duration: '1.0s', ipAddress: '192.168.1.45', details: 'Retried failed salary query task.' },
  { id: 'aud-18', timestamp: '2026-07-25 21:15:00', user: 'system', action: 'CREDIT_CAP_WARNING', target: 'Monthly Credit Quota', category: 'System', severity: 'warning', status: 'success', duration: '10ms', ipAddress: '10.0.0.1', details: 'Credits usage reached 78% of monthly limit.' },
  { id: 'aud-19', timestamp: '2026-07-25 20:00:22', user: 'dipak@scorelia.ai', action: 'REFRESH_COLLECTION_HEALTH', target: 'System Design Transcripts', category: 'Knowledge', severity: 'info', status: 'success', duration: '890ms', ipAddress: '192.168.1.45', details: 'Refreshed collection embeddings status.' },
  { id: 'aud-20', timestamp: '2026-07-25 19:10:00', user: 'system', action: 'DEPLOY_CONSOLE_V3.2', target: 'Scorelia Agent Console', category: 'System', severity: 'info', status: 'success', duration: '3.2s', ipAddress: '10.0.0.1', details: 'Deployed production bundle v3.2.0.' },
]

// 15 Execution Log Items
export const mockExecutionLogs: ExecutionLogItem[] = [
  { id: 'exec-1', timestamp: '2m ago', agentName: 'Resume Assistant', taskName: 'ATS Keyword Compliance Scan & Format Audit', status: 'completed', duration: '0.84s', tokensUsed: 1450, cpuUtilization: '28%', memoryUsage: '42 MB', retryCount: 0 },
  { id: 'exec-2', timestamp: '5m ago', agentName: 'ATS Optimizer', taskName: 'Workday Layout Margin & Font Verification', status: 'completed', duration: '1.12s', tokensUsed: 2100, cpuUtilization: '35%', memoryUsage: '58 MB', retryCount: 0 },
  { id: 'exec-3', timestamp: '12m ago', agentName: 'RAG Agent', taskName: 'Vector Embeddings Index Refresh (Career Papers)', status: 'running', duration: '2m 15s', tokensUsed: 18450, cpuUtilization: '64%', memoryUsage: '185 MB', retryCount: 0 },
  { id: 'exec-4', timestamp: '18m ago', agentName: 'Interview Coach', taskName: 'Generate Mock System Design Interview Questions', status: 'completed', duration: '1.45s', tokensUsed: 3200, cpuUtilization: '41%', memoryUsage: '76 MB', retryCount: 0 },
  { id: 'exec-5', timestamp: '25m ago', agentName: 'Cover Letter Writer', taskName: 'Draft Tailored Cover Letter for Google Lead Engineer', status: 'completed', duration: '0.98s', tokensUsed: 1890, cpuUtilization: '30%', memoryUsage: '51 MB', retryCount: 0 },
  { id: 'exec-6', timestamp: '35m ago', agentName: 'Career Advisor', taskName: 'Map 12-Month Staff Engineer Transition Roadmap', status: 'completed', duration: '1.80s', tokensUsed: 4120, cpuUtilization: '48%', memoryUsage: '92 MB', retryCount: 0 },
  { id: 'exec-7', timestamp: '45m ago', agentName: 'Salary Negotiator', taskName: 'Compensation & Stock Equity Benchmark Query', status: 'failed', duration: '3.10s', tokensUsed: 850, cpuUtilization: '18%', memoryUsage: '34 MB', failureReason: 'External compensation API timeout after 3000ms', retryCount: 2 },
  { id: 'exec-8', timestamp: '1h ago', agentName: 'Code Intelligence Agent', taskName: 'GitHub Repository Architecture AST Audit', status: 'completed', duration: '1.25s', tokensUsed: 2750, cpuUtilization: '39%', memoryUsage: '68 MB', retryCount: 0 },
  { id: 'exec-9', timestamp: '1h 15m ago', agentName: 'LinkedIn Profile Optimizer', taskName: 'LinkedIn Headline SEO Keyword Enrichment', status: 'completed', duration: '0.90s', tokensUsed: 1320, cpuUtilization: '25%', memoryUsage: '38 MB', retryCount: 0 },
  { id: 'exec-10', timestamp: '2h ago', agentName: 'Job Application Tracker', taskName: 'Pipeline Kanban Application Stage Sync', status: 'completed', duration: '0.50s', tokensUsed: 620, cpuUtilization: '14%', memoryUsage: '26 MB', retryCount: 0 },
  { id: 'exec-11', timestamp: '2h 15m ago', agentName: 'Executive Career Agent', taskName: 'Executive Board Bio Summary Generation', status: 'cancelled', duration: '0.40s', tokensUsed: 410, cpuUtilization: '12%', memoryUsage: '22 MB', failureReason: 'Cancelled by user trigger', retryCount: 0 },
  { id: 'exec-12', timestamp: '3h ago', agentName: 'Networking Assistant', taskName: 'Cold Outreach Draft for Meta Staff Recruiters', status: 'completed', duration: '0.85s', tokensUsed: 1650, cpuUtilization: '29%', memoryUsage: '45 MB', retryCount: 0 },
  { id: 'exec-13', timestamp: '3h 30m ago', agentName: 'Portfolio Builder', taskName: 'React Developer Portfolio Code Sample Extractor', status: 'completed', duration: '1.50s', tokensUsed: 2900, cpuUtilization: '44%', memoryUsage: '81 MB', retryCount: 0 },
  { id: 'exec-14', timestamp: '4h ago', agentName: 'Skill Gap Matcher', taskName: 'Target Requirement Skill Delta Computation', status: 'completed', duration: '1.10s', tokensUsed: 1950, cpuUtilization: '32%', memoryUsage: '54 MB', retryCount: 0 },
  { id: 'exec-15', timestamp: '5h ago', agentName: 'Interview Coach', taskName: 'Behavioral STAR Answer Feedback Scoring', status: 'completed', duration: '1.15s', tokensUsed: 2400, cpuUtilization: '36%', memoryUsage: '62 MB', retryCount: 0 },
]

// 5 Report Templates
export const mockReportTemplates: ReportTemplateItem[] = [
  { id: 'tmpl-1', name: 'Agent Performance Summary', category: 'Analytics', description: 'Comprehensive report on agent success rates, response latencies, and task throughput.', supportedFormats: ['PDF', 'CSV', 'JSON'], estimatedGenerationTime: '~5 seconds' },
  { id: 'tmpl-2', name: 'Automation Workflows Summary', category: 'Operations', description: 'Detailed breakdown of active automation triggers, execution history, and error logs.', supportedFormats: ['PDF', 'CSV'], estimatedGenerationTime: '~3 seconds' },
  { id: 'tmpl-3', name: 'Vector Knowledge Health Report', category: 'Knowledge', description: 'Audit of Pinecone vector index sizes, document counts, embeddings, and sync timestamps.', supportedFormats: ['PDF', 'JSON'], estimatedGenerationTime: '~4 seconds' },
  { id: 'tmpl-4', name: 'Monthly API & Credit Usage Report', category: 'Billing', description: 'Executive audit of monthly API call volumes, credit consumption, and token efficiency.', supportedFormats: ['PDF', 'CSV'], estimatedGenerationTime: '~2 seconds' },
  { id: 'tmpl-5', name: 'Operational System Health Audit', category: 'System', description: 'Service uptime metrics, resource utilization, CPU/RAM spikes, and diagnostic test logs.', supportedFormats: ['PDF', 'CSV', 'JSON'], estimatedGenerationTime: '~3 seconds' },
]

// Generated Reports
export const mockGeneratedReports: GeneratedReportItem[] = [
  { id: 'rep-1', name: 'Monthly_Agent_Performance_July_2026.pdf', templateName: 'Agent Performance Summary', format: 'PDF', size: '2.4 MB', createdDate: '2026-07-26 14:30', downloadUrl: '#' },
  { id: 'rep-2', name: 'Automation_Execution_Audit_Q3.csv', templateName: 'Automation Workflows Summary', format: 'CSV', size: '480 KB', createdDate: '2026-07-25 09:15', downloadUrl: '#' },
  { id: 'rep-3', name: 'Vector_Knowledge_Health_July.json', templateName: 'Vector Knowledge Health Report', format: 'JSON', size: '1.2 MB', createdDate: '2026-07-24 16:40', downloadUrl: '#' },
  { id: 'rep-4', name: 'API_Credit_Usage_Q2_Summary.pdf', templateName: 'Monthly API & Credit Usage Report', format: 'PDF', size: '3.1 MB', createdDate: '2026-07-20 11:00', downloadUrl: '#' },
]

// Scheduled Reports
export const mockScheduledReports: ScheduledReportItem[] = [
  { id: 'sch-1', name: 'Weekly Executive Agent Digest', frequency: 'Weekly', format: 'PDF', recipients: ['dipak@scorelia.ai', 'admin@scorelia.ai'], nextRun: 'Mon 08:00 AM', status: 'Active' },
  { id: 'sch-2', name: 'Daily Automation Error Audit', frequency: 'Daily', format: 'CSV', recipients: ['devops@scorelia.ai'], nextRun: 'Tomorrow 06:00 AM', status: 'Active' },
  { id: 'sch-3', name: 'Monthly Vector Index Health', frequency: 'Monthly', format: 'PDF', recipients: ['knowledge@scorelia.ai'], nextRun: 'Aug 1 09:00 AM', status: 'Paused' },
]

// Export Center Jobs
export const mockExportJobs: ExportJobItem[] = [
  { id: 'exp-1', fileName: 'agent_performance_telemetry_90d.csv', format: 'CSV', size: '1.4 MB', createdTime: 'Just now', status: 'Ready' },
  { id: 'exp-2', fileName: 'audit_logs_export_july_2026.json', format: 'JSON', size: '3.8 MB', createdTime: '2h ago', status: 'Ready' },
  { id: 'exp-3', fileName: 'system_health_diagnostics_report.pdf', format: 'PDF', size: '2.1 MB', createdTime: '1 day ago', status: 'Ready' },
  { id: 'exp-4', fileName: 'knowledge_collection_embeddings.json', format: 'JSON', size: '14.2 MB', createdTime: '3 days ago', status: 'Expired' },
]
