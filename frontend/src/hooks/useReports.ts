import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportService } from '@/services/reportService'
import type { GeneratedReportItem } from '@/data/administrationMockData'

export function useReports() {
  const queryClient = useQueryClient()

  const { data: templates = [] } = useQuery({
    queryKey: ['reportTemplates'],
    queryFn: () => reportService.getReportTemplates(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: generatedReports = [], isLoading } = useQuery({
    queryKey: ['generatedReports'],
    queryFn: () => reportService.getGeneratedReports(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: scheduledReports = [] } = useQuery({
    queryKey: ['scheduledReports'],
    queryFn: () => reportService.getScheduledReports(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: exportJobs = [] } = useQuery({
    queryKey: ['exportJobs'],
    queryFn: () => reportService.getExportJobs(),
    staleTime: 1000 * 60 * 5,
  })

  const generateReportMutation = useMutation({
    mutationFn: ({ templateId, format }: { templateId: string; format: 'PDF' | 'CSV' | 'JSON' }) =>
      reportService.generateReport(templateId, format),
    onSuccess: (newReport) => {
      queryClient.setQueryData<GeneratedReportItem[]>(['generatedReports'], (old = []) => [newReport, ...old])
      queryClient.invalidateQueries({ queryKey: ['generatedReports'] })
    },
  })

  return {
    templates,
    generatedReports,
    scheduledReports,
    exportJobs,
    isLoading,
    generateReport: generateReportMutation.mutateAsync,
    isGenerating: generateReportMutation.isPending,
  }
}

export default useReports
