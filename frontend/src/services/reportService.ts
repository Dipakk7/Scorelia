import api from '@/api/api'
import type {
  ReportTemplateItem,
  GeneratedReportItem,
  ScheduledReportItem,
  ExportJobItem,
} from '@/data/administrationMockData'
import {
  mockReportTemplates,
  mockGeneratedReports,
  mockScheduledReports,
  mockExportJobs,
} from '@/data/administrationMockData'

export class ReportService {
  async getReportTemplates(): Promise<ReportTemplateItem[]> {
    try {
      const response = await api.get('/reports/templates')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockReportTemplates
  }

  async getGeneratedReports(): Promise<GeneratedReportItem[]> {
    try {
      const response = await api.get('/reports/generated')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockGeneratedReports
  }

  async getScheduledReports(): Promise<ScheduledReportItem[]> {
    try {
      const response = await api.get('/reports/scheduled')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockScheduledReports
  }

  async getExportJobs(): Promise<ExportJobItem[]> {
    try {
      const response = await api.get('/reports/exports')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockExportJobs
  }

  async generateReport(templateId: string, format: 'PDF' | 'CSV' | 'JSON'): Promise<GeneratedReportItem> {
    try {
      const response = await api.post('/reports/generate', { templateId, format })
      if (response.data) return response.data
    } catch {
      // Fall back
    }
    const tmpl = mockReportTemplates.find((t) => t.id === templateId)
    return {
      id: `rep-${Date.now()}`,
      name: `${tmpl?.name.replace(/ /g, '_')}_${Date.now()}.${format.toLowerCase()}`,
      templateName: tmpl?.name || 'Custom Report',
      format,
      size: '1.8 MB',
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      downloadUrl: '#',
    }
  }
}

export const reportService = new ReportService()
export default reportService
