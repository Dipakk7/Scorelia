export type ExportFormat = 'PDF' | 'CSV' | 'JSON' | 'Markdown' | 'ZIP'
export type ExportStatus = 'queued' | 'running' | 'completed' | 'failed'
export type AuditActionStatus = 'success' | 'warning' | 'failed'

export interface ReportsOverviewKPI {
  generatedReports: number
  exportJobs: number
  totalDownloads: number
  scheduledReports: number
  sharedLinks: number
  storageUsedMB: number
}

export interface ExportJobItem {
  id: string
  name: string
  format: ExportFormat
  targets: string[]
  size: string
  status: ExportStatus
  progress: number // 0-100
  eta: string
  createdBy: string
  createdAt: string
  downloadUrl?: string
}

export interface AuditLogItem {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  status: AuditActionStatus
  ipAddress: string
  durationMs: number
  details?: Record<string, any>
}

export interface WorkspaceSnapshotItem {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  size: string
  collectionsCount: number
  documentsCount: number
}

export interface ShareLinkConfig {
  id: string
  linkUrl: string
  permission: 'Read-Only' | 'Editable'
  expiresInDays: number
  passwordProtected: boolean
  createdAt: string
}

export const MOCK_REPORTS_OVERVIEW: ReportsOverviewKPI = {
  generatedReports: 42,
  exportJobs: 128,
  totalDownloads: 310,
  scheduledReports: 4,
  sharedLinks: 8,
  storageUsedMB: 153.4
}

export const MOCK_EXPORT_JOBS: ExportJobItem[] = [
  {
    id: 'exp-1',
    name: 'AI_Research_Papers_Full_Export.zip',
    format: 'ZIP',
    targets: ['Collections', 'Documents', 'Analytics'],
    size: '48.2 MB',
    status: 'completed',
    progress: 100,
    eta: 'Completed',
    createdBy: 'Dipak Khandagale',
    createdAt: 'Today, 10:24 AM',
    downloadUrl: '#'
  },
  {
    id: 'exp-2',
    name: 'Query_Playground_Audit_Logs.csv',
    format: 'CSV',
    targets: ['Analytics', 'Audit Logs'],
    size: '1.4 MB',
    status: 'completed',
    progress: 100,
    eta: 'Completed',
    createdBy: 'Sarah Jenkins',
    createdAt: 'Yesterday, 04:15 PM',
    downloadUrl: '#'
  },
  {
    id: 'exp-3',
    name: 'Knowledge_Graph_Topology.json',
    format: 'JSON',
    targets: ['Knowledge Graph'],
    size: '820 KB',
    status: 'running',
    progress: 65,
    eta: '12s remaining',
    createdBy: 'Dipak Khandagale',
    createdAt: 'Today, 11:40 AM'
  },
  {
    id: 'exp-4',
    name: 'Workspace_Settings_Backup.json',
    format: 'JSON',
    targets: ['Workspace Settings'],
    size: '45 KB',
    status: 'queued',
    progress: 0,
    eta: 'Queued',
    createdBy: 'Admin',
    createdAt: 'Today, 11:45 AM'
  }
]

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: 'Today, 11:40 AM',
    user: 'Dipak Khandagale',
    action: 'EXPORT_KNOWLEDGE_GRAPH',
    resource: 'Knowledge Graph Engine',
    status: 'success',
    ipAddress: '192.168.1.42',
    durationMs: 420,
    details: { nodesCount: 35, edgesCount: 45, format: 'JSON' }
  },
  {
    id: 'aud-2',
    timestamp: 'Today, 10:24 AM',
    user: 'Dipak Khandagale',
    action: 'REINDEX_COLLECTION',
    resource: 'AI Research Papers',
    status: 'success',
    ipAddress: '192.168.1.42',
    durationMs: 12400,
    details: { chunksCount: 872, model: 'nomic-embed-text:latest' }
  },
  {
    id: 'aud-3',
    timestamp: 'Today, 09:15 AM',
    user: 'System Worker',
    action: 'AUTO_BACKUP_SNAPSHOT',
    resource: 'System Storage',
    status: 'success',
    ipAddress: '127.0.0.1',
    durationMs: 3800,
    details: { snapshotSize: '153.4 MB', collections: 12 }
  },
  {
    id: 'aud-4',
    timestamp: 'Yesterday, 06:30 PM',
    user: 'Sarah Jenkins',
    action: 'UPDATE_SETTINGS',
    resource: 'Retrieval Parameters',
    status: 'success',
    ipAddress: '192.168.1.88',
    durationMs: 150,
    details: { searchType: 'Hybrid', topK: 5, temperature: 0.2 }
  },
  {
    id: 'aud-5',
    timestamp: 'Yesterday, 02:10 PM',
    user: 'Admin',
    action: 'DELETE_DOCUMENT',
    resource: 'Legacy_API_Documentation_v1.docx',
    status: 'failed',
    ipAddress: '192.168.1.1',
    durationMs: 950,
    details: { error: 'Parser stream corruption failure' }
  }
]

export const MOCK_WORKSPACE_SNAPSHOTS: WorkspaceSnapshotItem[] = [
  {
    id: 'snap-1',
    name: 'Weekly_System_Snapshot_v3.2.bak',
    description: 'Automated full workspace snapshot including vector indexes and settings.',
    createdBy: 'System Automated Backup',
    createdAt: 'May 24, 2026 00:00 AM',
    size: '153.4 MB',
    collectionsCount: 12,
    documentsCount: 124
  },
  {
    id: 'snap-2',
    name: 'Pre_Migration_Snapshot_v3.1.bak',
    description: 'Manual snapshot captured prior to nomic-embed-text model upgrade.',
    createdBy: 'Dipak Khandagale',
    createdAt: 'May 10, 2026 03:30 PM',
    size: '142.1 MB',
    collectionsCount: 10,
    documentsCount: 110
  }
]
