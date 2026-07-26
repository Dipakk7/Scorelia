export type TaskStatus = 'pending' | 'running' | 'completed' | 'queued' | 'failed' | 'cancelled'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'
export type AutomationStatus = 'enabled' | 'disabled' | 'running' | 'paused' | 'draft' | 'error'
export type CollectionHealth = 'healthy' | 'syncing' | 'needs_update' | 'error' | 'offline'

export interface TaskItem {
  id: string
  name: string
  assignedAgent: string
  assignedAgentIconBg: string
  priority: TaskPriority
  status: TaskStatus
  estimatedDuration: string
  progress: number
  createdTime: string
}

export interface AutomationItem {
  id: string
  name: string
  description: string
  trigger: string
  frequency: string
  status: AutomationStatus
  executionCount: number
  successRate: number
  avgRuntime: string
  lastRun: string
  nextRun: string
}

export interface KnowledgeCollectionItem {
  id: string
  name: string
  documentsCount: number
  embeddingsCount: number
  storageUsed: string
  lastSync: string
  health: CollectionHealth
  assignedAgents: string[]
}

export interface ConnectedSourceItem {
  id: string
  name: string
  connectionState: 'connected' | 'syncing' | 'error'
  lastSync: string
  documentCount: number
}

// 20 Realistic Enterprise Tasks
export const mockTasksData: TaskItem[] = [
  {
    id: 'task-1',
    name: 'ATS Keyword Compliance Scan & Format Audit',
    assignedAgent: 'Resume Assistant',
    assignedAgentIconBg: 'bg-purple-600',
    priority: 'critical',
    status: 'running',
    estimatedDuration: '45s',
    progress: 68,
    createdTime: '2m ago',
  },
  {
    id: 'task-2',
    name: 'Workday Layout Margin & Font Verification',
    assignedAgent: 'ATS Optimizer',
    assignedAgentIconBg: 'bg-blue-600',
    priority: 'high',
    status: 'running',
    estimatedDuration: '30s',
    progress: 42,
    createdTime: '4m ago',
  },
  {
    id: 'task-3',
    name: 'Generate Mock System Design Interview Questions',
    assignedAgent: 'Interview Coach',
    assignedAgentIconBg: 'bg-cyan-600',
    priority: 'medium',
    status: 'queued',
    estimatedDuration: '1m 15s',
    progress: 0,
    createdTime: '6m ago',
  },
  {
    id: 'task-4',
    name: 'Draft Tailored Cover Letter for Google Lead Engineer',
    assignedAgent: 'Cover Letter Writer',
    assignedAgentIconBg: 'bg-emerald-600',
    priority: 'high',
    status: 'completed',
    estimatedDuration: '55s',
    progress: 100,
    createdTime: '15m ago',
  },
  {
    id: 'task-5',
    name: 'Map 12-Month Staff Engineer Transition Roadmap',
    assignedAgent: 'Career Advisor',
    assignedAgentIconBg: 'bg-amber-600',
    priority: 'medium',
    status: 'completed',
    estimatedDuration: '2m 10s',
    progress: 100,
    createdTime: '25m ago',
  },
  {
    id: 'task-6',
    name: 'Vector Embeddings Index Refresh (Career Papers)',
    assignedAgent: 'RAG Agent',
    assignedAgentIconBg: 'bg-indigo-600',
    priority: 'low',
    status: 'completed',
    estimatedDuration: '3m 40s',
    progress: 100,
    createdTime: '40m ago',
  },
  {
    id: 'task-7',
    name: 'Compensation & Stock Equity Benchmark Query',
    assignedAgent: 'Salary Negotiator',
    assignedAgentIconBg: 'bg-red-600',
    priority: 'high',
    status: 'failed',
    estimatedDuration: '1m 00s',
    progress: 35,
    createdTime: '1h ago',
  },
  {
    id: 'task-8',
    name: 'GitHub Repository Architecture AST Audit',
    assignedAgent: 'Code Intelligence Agent',
    assignedAgentIconBg: 'bg-[#6366f1]',
    priority: 'medium',
    status: 'pending',
    estimatedDuration: '2m 00s',
    progress: 0,
    createdTime: '1h 10m ago',
  },
  {
    id: 'task-9',
    name: 'LinkedIn Headline SEO Keyword Enrichment',
    assignedAgent: 'LinkedIn Profile Optimizer',
    assignedAgentIconBg: 'bg-sky-600',
    priority: 'low',
    status: 'completed',
    estimatedDuration: '40s',
    progress: 100,
    createdTime: '1h 30m ago',
  },
  {
    id: 'task-10',
    name: 'Pipeline Kanban Application Stage Sync',
    assignedAgent: 'Job Application Tracker',
    assignedAgentIconBg: 'bg-teal-600',
    priority: 'medium',
    status: 'completed',
    estimatedDuration: '50s',
    progress: 100,
    createdTime: '2h ago',
  },
  {
    id: 'task-11',
    name: 'Executive Board Bio Summary Generation',
    assignedAgent: 'Executive Career Agent',
    assignedAgentIconBg: 'bg-indigo-700',
    priority: 'high',
    status: 'cancelled',
    estimatedDuration: '1m 30s',
    progress: 20,
    createdTime: '2h 15m ago',
  },
  {
    id: 'task-12',
    name: 'Cold Outreach Draft for Meta Staff Recruiters',
    assignedAgent: 'Networking Assistant',
    assignedAgentIconBg: 'bg-violet-600',
    priority: 'medium',
    status: 'completed',
    estimatedDuration: '45s',
    progress: 100,
    createdTime: '3h ago',
  },
  {
    id: 'task-13',
    name: 'React Developer Portfolio Code Sample Extractor',
    assignedAgent: 'Portfolio Builder',
    assignedAgentIconBg: 'bg-purple-700',
    priority: 'low',
    status: 'completed',
    estimatedDuration: '1m 50s',
    progress: 100,
    createdTime: '3h 30m ago',
  },
  {
    id: 'task-14',
    name: 'Target Requirement Skill Delta Computation',
    assignedAgent: 'Skill Gap Matcher',
    assignedAgentIconBg: 'bg-rose-600',
    priority: 'high',
    status: 'completed',
    estimatedDuration: '1m 10s',
    progress: 100,
    createdTime: '4h ago',
  },
  {
    id: 'task-15',
    name: 'System Design Diagram Architecture Export',
    assignedAgent: 'Interview Coach',
    assignedAgentIconBg: 'bg-cyan-600',
    priority: 'medium',
    status: 'pending',
    estimatedDuration: '1m 20s',
    progress: 0,
    createdTime: '4h 20m ago',
  },
  {
    id: 'task-16',
    name: 'PDF Resume Metadata Stripping & Redaction',
    assignedAgent: 'ATS Optimizer',
    assignedAgentIconBg: 'bg-blue-600',
    priority: 'low',
    status: 'completed',
    estimatedDuration: '25s',
    progress: 100,
    createdTime: '5h ago',
  },
  {
    id: 'task-17',
    name: 'Annual Career Goal Progress Telemetry Scan',
    assignedAgent: 'Career Advisor',
    assignedAgentIconBg: 'bg-amber-600',
    priority: 'low',
    status: 'completed',
    estimatedDuration: '1m 40s',
    progress: 100,
    createdTime: '5h 45m ago',
  },
  {
    id: 'task-18',
    name: 'Pinecone Vector Index Namespace Re-indexing',
    assignedAgent: 'RAG Agent',
    assignedAgentIconBg: 'bg-indigo-600',
    priority: 'medium',
    status: 'completed',
    estimatedDuration: '4m 10s',
    progress: 100,
    createdTime: '6h ago',
  },
  {
    id: 'task-19',
    name: 'Custom Cover Letter Tone Adjustment (Executive)',
    assignedAgent: 'Cover Letter Writer',
    assignedAgentIconBg: 'bg-emerald-600',
    priority: 'medium',
    status: 'completed',
    estimatedDuration: '40s',
    progress: 100,
    createdTime: '7h ago',
  },
  {
    id: 'task-20',
    name: 'Behavioral STAR Answer Feedback Scoring',
    assignedAgent: 'Interview Coach',
    assignedAgentIconBg: 'bg-cyan-600',
    priority: 'high',
    status: 'completed',
    estimatedDuration: '1m 15s',
    progress: 100,
    createdTime: '8h ago',
  },
]

// 10 Realistic Automations
export const mockAutomationsData: AutomationItem[] = [
  {
    id: 'auto-1',
    name: 'Daily ATS Resume Compatibility Scan',
    description: 'Automatically scans draft resumes against active target job postings every morning.',
    trigger: 'Cron Schedule (Everyday 08:00 AM)',
    frequency: 'Daily',
    status: 'enabled',
    executionCount: 142,
    successRate: 98.5,
    avgRuntime: '42s',
    lastRun: '10h ago',
    nextRun: 'In 14h',
  },
  {
    id: 'auto-2',
    name: 'Weekly Career Roadmap Skill Audit',
    description: 'Computes missing skill benchmarks and updates personalized learning recommendations.',
    trigger: 'Weekly Trigger (Mondays 09:00 AM)',
    frequency: 'Weekly',
    status: 'enabled',
    executionCount: 52,
    successRate: 96.1,
    avgRuntime: '1m 45s',
    lastRun: '3 days ago',
    nextRun: 'In 4 days',
  },
  {
    id: 'auto-[#3]',
    name: 'Automatic Cover Letter Draft on Saved Job',
    description: 'Triggered whenever a candidate saves a target job description to their wishlist.',
    trigger: 'Event Trigger (On Job Saved)',
    frequency: 'On Event',
    status: 'enabled',
    executionCount: 89,
    successRate: 97.8,
    avgRuntime: '55s',
    lastRun: '12m ago',
    nextRun: 'On Next Saved Job',
  },
  {
    id: 'auto-4',
    name: 'Vector Knowledge Index Auto-Sync',
    description: 'Syncs new PDF upload documents into the Pinecone RAG vector store.',
    trigger: 'Webhook (Document Upload)',
    frequency: 'Real-time',
    status: 'running',
    executionCount: 310,
    successRate: 94.2,
    avgRuntime: '2m 15s',
    lastRun: 'Just now',
    nextRun: 'Continuous',
  },
  {
    id: 'auto-5',
    name: 'Application Status Follow-up Email Reminder',
    description: 'Schedules automated follow-up draft emails 7 days after application submission.',
    trigger: 'Event Trigger (7 Days Post-Application)',
    frequency: 'Continuous',
    status: 'paused',
    executionCount: 64,
    successRate: 91.0,
    avgRuntime: '30s',
    lastRun: '1 day ago',
    nextRun: 'Paused',
  },
  {
    id: 'auto-6',
    name: 'GitHub Repository AST Quality Guard',
    description: 'Runs AST code smell checks whenever new GitHub repositories are linked.',
    trigger: 'GitHub Webhook (Repo Linked)',
    frequency: 'On Event',
    status: 'enabled',
    executionCount: 45,
    successRate: 95.5,
    avgRuntime: '1m 20s',
    lastRun: '2h ago',
    nextRun: 'On Repo Event',
  },
  {
    id: 'auto-7',
    name: 'Salary Benchmark Compensation Alert',
    description: 'Monitors compensation changes in target tech hubs for tier-1 roles.',
    trigger: 'Monthly Schedule (1st of Month)',
    frequency: 'Monthly',
    status: 'disabled',
    executionCount: 12,
    successRate: 88.0,
    avgRuntime: '3m 10s',
    lastRun: '15 days ago',
    nextRun: 'Disabled',
  },
  {
    id: 'auto-8',
    name: 'Interview Prep Behavioral Flashcards',
    description: 'Generates daily STAR method practice questions based on past interview logs.',
    trigger: 'Cron Schedule (Everyday 06:00 PM)',
    frequency: 'Daily',
    status: 'enabled',
    executionCount: 190,
    successRate: 99.1,
    avgRuntime: '25s',
    lastRun: '20h ago',
    nextRun: 'In 4h',
  },
  {
    id: 'auto-9',
    name: 'LinkedIn Headline Optimization Check',
    description: 'Verifies recruiter visibility keywords on candidate LinkedIn profiles.',
    trigger: 'Bi-Weekly Schedule',
    frequency: 'Bi-Weekly',
    status: 'draft',
    executionCount: 0,
    successRate: 0,
    avgRuntime: '—',
    lastRun: 'Never',
    nextRun: 'Draft Mode',
  },
  {
    id: 'auto-10',
    name: 'Executive Bio Refresh Automation',
    description: 'Updates executive summary metrics whenever new career accomplishments are added.',
    trigger: 'Event Trigger (Accomplishment Added)',
    frequency: 'On Event',
    status: 'error',
    executionCount: 18,
    successRate: 77.8,
    avgRuntime: '1m 05s',
    lastRun: '3h ago',
    nextRun: 'Requires Attention',
  },
]

// 10 Knowledge Collections
export const mockKnowledgeCollections: KnowledgeCollectionItem[] = [
  {
    id: 'col-1',
    name: 'ATS Keyword Standards (2026)',
    documentsCount: 420,
    embeddingsCount: 18450,
    storageUsed: '340 MB',
    lastSync: '10m ago',
    health: 'healthy',
    assignedAgents: ['Resume Assistant', 'ATS Optimizer'],
  },
  {
    id: 'col-2',
    name: 'System Design Interview Transcripts',
    documentsCount: 280,
    embeddingsCount: 12600,
    storageUsed: '215 MB',
    lastSync: '1h ago',
    health: 'healthy',
    assignedAgents: ['Interview Coach'],
  },
  {
    id: 'col-3',
    name: 'FAANG Salary & Equity Benchmarks',
    documentsCount: 150,
    embeddingsCount: 6800,
    storageUsed: '110 MB',
    lastSync: '3h ago',
    health: 'needs_update',
    assignedAgents: ['Salary Negotiator', 'Career Advisor'],
  },
  {
    id: 'col-4',
    name: 'Enterprise Cover Letter Corpus',
    documentsCount: 310,
    embeddingsCount: 14200,
    storageUsed: '260 MB',
    lastSync: '15m ago',
    health: 'healthy',
    assignedAgents: ['Cover Letter Writer'],
  },
  {
    id: 'col-5',
    name: 'Pinecone RAG Career Vector Index',
    documentsCount: 1240,
    embeddingsCount: 62000,
    storageUsed: '1.1 GB',
    lastSync: 'Syncing now',
    health: 'syncing',
    assignedAgents: ['RAG Agent'],
  },
  {
    id: 'col-6',
    name: 'GitHub Clean Architecture Rules',
    documentsCount: 190,
    embeddingsCount: 8900,
    storageUsed: '145 MB',
    lastSync: '5h ago',
    health: 'healthy',
    assignedAgents: ['Code Intelligence Agent'],
  },
  {
    id: 'col-7',
    name: 'Executive Leadership Frameworks',
    documentsCount: 85,
    embeddingsCount: 3900,
    storageUsed: '68 MB',
    lastSync: '1 day ago',
    health: 'healthy',
    assignedAgents: ['Executive Career Agent'],
  },
  {
    id: 'col-[#8]',
    name: 'Recruiter InMail Cold Outreach Database',
    documentsCount: 210,
    embeddingsCount: 9400,
    storageUsed: '175 MB',
    lastSync: '2 days ago',
    health: 'error',
    assignedAgents: ['Networking Assistant'],
  },
  {
    id: 'col-9',
    name: 'LinkedIn Headline Analytics Index',
    documentsCount: 165,
    embeddingsCount: 7200,
    storageUsed: '130 MB',
    lastSync: '4h ago',
    health: 'healthy',
    assignedAgents: ['LinkedIn Profile Optimizer'],
  },
  {
    id: 'col-10',
    name: 'Developer Portfolio Showcase Code Templates',
    documentsCount: 95,
    embeddingsCount: 4100,
    storageUsed: '85 MB',
    lastSync: '12h ago',
    health: 'offline',
    assignedAgents: ['Portfolio Builder'],
  },
]

// 6 Connected Sources
export const mockConnectedSources: ConnectedSourceItem[] = [
  {
    id: 'src-1',
    name: 'Resume Database',
    connectionState: 'connected',
    lastSync: '5m ago',
    documentCount: 420,
  },
  {
    id: 'src-2',
    name: 'Interview Knowledge Base',
    connectionState: 'connected',
    lastSync: '1h ago',
    documentCount: 280,
  },
  {
    id: 'src-3',
    name: 'Career Roadmaps DB',
    connectionState: 'connected',
    lastSync: '3h ago',
    documentCount: 190,
  },
  {
    id: 'src-4',
    name: 'Company Research Repository',
    connectionState: 'syncing',
    lastSync: 'Syncing',
    documentCount: 310,
  },
  {
    id: 'src-5',
    name: 'GitHub Intelligence Index',
    connectionState: 'connected',
    lastSync: '2h ago',
    documentCount: 190,
  },
  {
    id: 'src-6',
    name: 'Job Market Data Feed',
    connectionState: 'error',
    lastSync: 'Failed',
    documentCount: 150,
  },
]
