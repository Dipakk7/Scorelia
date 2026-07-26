export type InsightPriority = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type ServiceStatus = 'operational' | 'degraded' | 'maintenance' | 'offline' | 'error'
export type NotificationPriority = 'critical' | 'warning' | 'info' | 'success'

export interface InsightItem {
  id: string
  title: string
  description: string
  priority: InsightPriority
  confidenceScore: number // percentage
  affectedAgents: string[]
  suggestedAction: string
  estimatedImpact: string
}

export interface ActivityTimelineItem {
  id: string
  timestamp: string
  agent: string
  action: string
  status: 'success' | 'failed' | 'running' | 'queued'
  duration: string
  source: 'User' | 'System'
  category: 'agent' | 'automation' | 'knowledge' | 'system'
}

export interface OperationalServiceItem {
  id: string
  name: string
  description: string
  status: ServiceStatus
  latencyMs: number
  uptimePercentage: number
}

export interface NotificationItem {
  id: string
  category: 'system' | 'agent' | 'knowledge' | 'automation' | 'security'
  priority: NotificationPriority
  title: string
  description: string
  timestamp: string
  isRead: boolean
}

// 10 AI Insights & Recommendations
export const mockInsightsList: InsightItem[] = [
  {
    id: 'ins-1',
    title: 'Pinecone Vector Index Refresh Recommended',
    description: 'The Career Papers knowledge collection has 45 pending updates. Re-indexing will improve RAG answer precision by ~14%.',
    priority: 'high',
    confidenceScore: 94,
    affectedAgents: ['RAG Agent', 'Resume Assistant'],
    suggestedAction: 'Trigger vector store auto-sync',
    estimatedImpact: '+14% Context Accuracy',
  },
  {
    id: 'ins-2',
    title: 'Idle Automation Workflow Detected',
    description: 'The "Salary Benchmark Compensation Alert" automation has not run for 15 days due to disabled status.',
    priority: 'medium',
    confidenceScore: 88,
    affectedAgents: ['Salary Negotiator'],
    suggestedAction: 'Enable or archive automation workflow',
    estimatedImpact: 'Save 2.4k Monthly API Credits',
  },
  {
    id: 'ins-3',
    title: 'ATS Optimizer Latency Spike Alert',
    description: 'Workday parsing response time increased from 0.8s to 1.6s under high concurrency loads.',
    priority: 'critical',
    confidenceScore: 98,
    affectedAgents: ['ATS Optimizer'],
    suggestedAction: 'Allocate +2 worker threads',
    estimatedImpact: '-45% Average Latency',
  },
  {
    id: 'ins-[#4]',
    title: 'Interview Prep Agent Success Surge',
    description: 'System design interview simulation pass rates improved to 98.4% following prompt optimization.',
    priority: 'info',
    confidenceScore: 99,
    affectedAgents: ['Interview Coach'],
    suggestedAction: 'Promote prompt template to global production',
    estimatedImpact: '+8% Candidate Ratings',
  },
  {
    id: 'ins-5',
    title: 'Credit Usage Anomaly Warning',
    description: 'Pinecone embedding calls consumed 34% more tokens than historical daily baseline.',
    priority: 'high',
    confidenceScore: 91,
    affectedAgents: ['RAG Agent'],
    suggestedAction: 'Enable embedding chunk caching',
    estimatedImpact: 'Save 1,200 Credits / day',
  },
  {
    id: 'ins-6',
    title: 'Cover Letter Writer Token Efficiency Boost',
    description: 'Enabling tone condensation reduced prompt token sizes by 28% without loss of quality.',
    priority: 'low',
    confidenceScore: 85,
    affectedAgents: ['Cover Letter Writer'],
    suggestedAction: 'Apply tone condensation to executive templates',
    estimatedImpact: '-28% Token Costs',
  },
  {
    id: 'ins-7',
    title: 'LinkedIn Headline Keyword Refresh Available',
    description: 'New industry recruiter search trends detected for Staff & Principal Architect roles.',
    priority: 'medium',
    confidenceScore: 89,
    affectedAgents: ['LinkedIn Profile Optimizer'],
    suggestedAction: 'Update headline keyword dictionary',
    estimatedImpact: '+22% Profile Views',
  },
  {
    id: 'ins-8',
    title: 'Cold Outreach Draft Acceptance Rate Peak',
    description: 'InMail cold outreach templates achieved a 92% recruiter response rate.',
    priority: 'info',
    confidenceScore: 96,
    affectedAgents: ['Networking Assistant'],
    suggestedAction: 'Save high-performing template to team library',
    estimatedImpact: '+35% Response Rate',
  },
  {
    id: 'ins-9',
    title: 'System Design Diagram Exporter Idle',
    description: 'No architecture diagram tasks requested in the last 48 hours.',
    priority: 'low',
    confidenceScore: 78,
    affectedAgents: ['Interview Coach'],
    suggestedAction: 'Scale down idle worker instances',
    estimatedImpact: 'Resource Optimization',
  },
  {
    id: 'ins-10',
    title: 'Executive Career Bio Alignment',
    description: '3 executive career summaries require metrics validation against GitHub repositories.',
    priority: 'medium',
    confidenceScore: 90,
    affectedAgents: ['Executive Career Agent', 'Code Intelligence Agent'],
    suggestedAction: 'Run automated AST code audit',
    estimatedImpact: 'Verified Portfolio Metrics',
  },
]

// 20 Activity Timeline Events
export const mockActivityTimeline: ActivityTimelineItem[] = [
  { id: 'act-1', timestamp: '2m ago', agent: 'Resume Assistant', action: 'ATS Keyword Compliance Scan Completed', status: 'success', duration: '0.84s', source: 'User', category: 'agent' },
  { id: 'act-2', timestamp: '5m ago', agent: 'ATS Optimizer', action: 'Workday Layout Font & Margin Validation', status: 'success', duration: '1.12s', source: 'System', category: 'agent' },
  { id: 'act-3', timestamp: '12m ago', agent: 'RAG Agent', action: 'Pinecone Vector Namespace Re-index', status: 'running', duration: '2m 15s', source: 'System', category: 'knowledge' },
  { id: 'act-4', timestamp: '18m ago', agent: 'Interview Coach', action: 'System Design Practice Simulation Export', status: 'success', duration: '1.45s', source: 'User', category: 'agent' },
  { id: 'act-5', timestamp: '25m ago', agent: 'Cover Letter Writer', action: 'Tailored Google Lead Engineer Letter', status: 'success', duration: '0.98s', source: 'User', category: 'agent' },
  { id: 'act-6', timestamp: '35m ago', agent: 'Career Advisor', action: 'Staff Engineer 12-Month Transition Plan', status: 'success', duration: '1.80s', source: 'User', category: 'agent' },
  { id: 'act-7', timestamp: '45m ago', agent: 'Salary Negotiator', action: 'Tech Hub Compensation Benchmark Query', status: 'failed', duration: '3.10s', source: 'System', category: 'agent' },
  { id: 'act-8', timestamp: '1h ago', agent: 'Automation Scheduler', action: 'Daily ATS Resume Compatibility Scan', status: 'success', duration: '42s', source: 'System', category: 'automation' },
  { id: 'act-9', timestamp: '1h 15m ago', agent: 'Code Intelligence Agent', action: 'GitHub AST Repository Quality Scan', status: 'success', duration: '1.25s', source: 'User', category: 'agent' },
  { id: 'act-10', timestamp: '1h 40m ago', agent: 'LinkedIn Profile Optimizer', action: 'Headline SEO Enrichment Scan', status: 'success', duration: '0.90s', source: 'User', category: 'agent' },
  { id: 'act-11', timestamp: '2h ago', agent: 'Job Application Tracker', action: 'Pipeline Stage Synchronization', status: 'success', duration: '0.50s', source: 'System', category: 'automation' },
  { id: 'act-12', timestamp: '2h 30m ago', agent: 'Networking Assistant', action: 'Cold Outreach Draft Generation', status: 'success', duration: '0.85s', source: 'User', category: 'agent' },
  { id: 'act-13', timestamp: '3h ago', agent: 'Embedding Service', action: 'Chunk Vector Embedding Batch Sync', status: 'success', duration: '1m 20s', source: 'System', category: 'knowledge' },
  { id: 'act-14', timestamp: '3h 45m ago', agent: 'Inference Engine', action: 'System Diagnostic Health Check', status: 'success', duration: '0.15s', source: 'System', category: 'system' },
  { id: 'act-15', timestamp: '4h ago', agent: 'Skill Gap Matcher', action: 'Target Skill Requirement Delta Audit', status: 'success', duration: '1.10s', source: 'User', category: 'agent' },
  { id: 'act-16', timestamp: '5h ago', agent: 'Executive Career Agent', action: 'Board Bio Summary Generation', status: 'failed', duration: '2.50s', source: 'User', category: 'agent' },
  { id: 'act-17', timestamp: '6h ago', agent: 'Knowledge Engine', action: 'Document Store Sync (ATS Standards)', status: 'success', duration: '45s', source: 'System', category: 'knowledge' },
  { id: 'act-18', timestamp: '7h ago', agent: 'Automation Scheduler', action: 'Behavioral STAR Question Generator', status: 'success', duration: '25s', source: 'System', category: 'automation' },
  { id: 'act-19', timestamp: '8h ago', agent: 'Portfolio Builder', action: 'Code Sample Preview Export', status: 'success', duration: '1.50s', source: 'User', category: 'agent' },
  { id: 'act-20', timestamp: '9h ago', agent: 'Agent Runtime', action: 'Worker Thread Pool Auto-Scaling', status: 'success', duration: '0.30s', source: 'System', category: 'system' },
]

// 5 Operational Services
export const mockOperationalServices: OperationalServiceItem[] = [
  { id: 'srv-1', name: 'Agent Runtime', description: 'Core orchestration engine & worker threads', status: 'operational', latencyMs: 14, uptimePercentage: 99.98 },
  { id: 'srv-2', name: 'Knowledge Engine', description: 'Pinecone vector retrieval & chunk indexing', status: 'operational', latencyMs: 42, uptimePercentage: 99.95 },
  { id: 'srv-3', name: 'Automation Scheduler', description: 'Cron & event-driven trigger scheduler', status: 'operational', latencyMs: 8, uptimePercentage: 100.0 },
  { id: 'srv-4', name: 'Embedding Service', description: 'Text embedding vector transformation API', status: 'degraded', latencyMs: 185, uptimePercentage: 98.7 },
  { id: 'srv-5', name: 'Inference Engine', description: 'LLM reasoning model dispatch pipeline', status: 'operational', latencyMs: 95, uptimePercentage: 99.91 },
]

// Resource Metrics
export const mockResourceMetrics = {
  cpuUsage: 34,
  memoryUsage: 62,
  storageUsage: 45,
  creditsRemaining: 78,
  queueUtilization: 28,
  overallHealth: 99.8,
}

// 15 Notifications
export const mockNotificationsList: NotificationItem[] = [
  { id: 'not-1', category: 'system', priority: 'warning', title: 'Embedding Latency Alert', description: 'Embedding API latency exceeded 150ms benchmark threshold.', timestamp: '10m ago', isRead: false },
  { id: 'not-2', category: 'agent', priority: 'success', title: 'Resume Assistant Updated', description: 'ATS compliance parser updated to 2026 enterprise standard.', timestamp: '35m ago', isRead: false },
  { id: 'not-3', category: 'knowledge', priority: 'info', title: 'Vector Store Sync Complete', description: 'Indexed 420 documents into Pinecone career collection.', timestamp: '1h ago', isRead: false },
  { id: 'not-4', category: 'automation', priority: 'critical', title: 'Automation Execution Failed', description: 'Executive Bio Refresh failed due to missing GitHub token.', timestamp: '2h ago', isRead: false },
  { id: 'not-[#5]', category: 'security', priority: 'info', title: 'API Key Rotated', description: 'Scorelia API key successfully rotated by system security policy.', timestamp: '3h ago', isRead: true },
  { id: 'not-6', category: 'agent', priority: 'success', title: 'Interview Coach Milestone', description: 'Completed 500 mock interview sessions this month.', timestamp: '4h ago', isRead: true },
  { id: 'not-7', category: 'system', priority: 'info', title: 'Scheduled Maintenance', description: 'System health check completed with zero memory leaks.', timestamp: '5h ago', isRead: true },
  { id: 'not-8', category: 'knowledge', priority: 'warning', title: 'Collection Requires Sync', description: 'FAANG Salary & Equity Benchmarks needs periodic refresh.', timestamp: '6h ago', isRead: true },
  { id: 'not-9', category: 'automation', priority: 'success', title: 'Daily Scan Complete', description: 'Scanned 14 active job postings against user resume.', timestamp: '7h ago', isRead: true },
  { id: 'not-10', category: 'agent', priority: 'info', title: 'New Capabilities Unlocked', description: 'LinkedIn Profile Optimizer added InMail cold outreach features.', timestamp: '8h ago', isRead: true },
  { id: 'not-11', category: 'system', priority: 'success', title: 'Worker Pool Auto-scaled', description: 'Scaled worker pool +2 instances to match peak load.', timestamp: '10h ago', isRead: true },
  { id: 'not-12', category: 'security', priority: 'info', title: 'Session Verified', description: 'Enterprise OAuth SSO credentials verified successfully.', timestamp: '12h ago', isRead: true },
  { id: 'not-13', category: 'knowledge', priority: 'info', title: 'Storage Capacity Normal', description: 'Storage usage at 45% of allocated vector volume quota.', timestamp: '14h ago', isRead: true },
  { id: 'not-14', category: 'automation', priority: 'info', title: 'Cron Trigger Fired', description: 'Weekly Career Roadmap Skill Audit finished in 1m 45s.', timestamp: '1 day ago', isRead: true },
  { id: 'not-15', category: 'system', priority: 'info', title: 'Console Version 3.2 Live', description: 'Scorelia Agent Console Phase 6 update deployed.', timestamp: '2 days ago', isRead: true },
]
