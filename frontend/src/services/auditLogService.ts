import api from '@/api/api'
import type { AuditLogItem, ExecutionLogItem } from '@/data/administrationMockData'
import { mockAuditLogs, mockExecutionLogs } from '@/data/administrationMockData'

export class AuditLogService {
  async getAuditLogs(): Promise<AuditLogItem[]> {
    try {
      const response = await api.get('/audit-logs')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockAuditLogs
  }

  async getExecutionLogs(): Promise<ExecutionLogItem[]> {
    try {
      const response = await api.get('/execution-logs')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockExecutionLogs
  }
}

export const auditLogService = new AuditLogService()
export default auditLogService
