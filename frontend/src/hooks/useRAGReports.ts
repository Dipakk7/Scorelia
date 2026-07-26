import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ragWorkspaceService } from '@/services/ragWorkspaceService'
import type { ExportFormat } from '@/data/ragReportsMockData'

export function useRAGReports() {
  const queryClient = useQueryClient()

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['ragReportsOverview'],
    queryFn: () => ragWorkspaceService.getReportsOverview(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })

  const { data: exportJobs = [], isLoading: isJobsLoading } = useQuery({
    queryKey: ['ragExportJobs'],
    queryFn: () => ragWorkspaceService.getExportJobs(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false
  })

  const { data: auditLogs = [], isLoading: isAuditLoading } = useQuery({
    queryKey: ['ragAuditLogs'],
    queryFn: () => ragWorkspaceService.getAuditLogs(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false
  })

  const { data: snapshots = [], isLoading: isSnapshotsLoading } = useQuery({
    queryKey: ['ragWorkspaceSnapshots'],
    queryFn: () => ragWorkspaceService.getWorkspaceSnapshots(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  })

  const createExportMutation = useMutation({
    mutationFn: ({ format, targets }: { format: ExportFormat; targets: string[] }) =>
      ragWorkspaceService.createExportJob(format, targets),
    onSuccess: (newJob) => {
      queryClient.setQueryData(['ragExportJobs'], (old: any = []) => [newJob, ...old])
    }
  })

  const createSnapshotMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) =>
      ragWorkspaceService.createSnapshot(name, description),
    onSuccess: (newSnap) => {
      queryClient.setQueryData(['ragWorkspaceSnapshots'], (old: any = []) => [newSnap, ...old])
    }
  })

  const shareMutation = useMutation({
    mutationFn: ({ permission, expiresInDays }: { permission: 'Read-Only' | 'Editable'; expiresInDays: number }) =>
      ragWorkspaceService.generateShareLink(permission, expiresInDays)
  })

  return {
    overview,
    exportJobs,
    auditLogs,
    snapshots,
    isLoading: isOverviewLoading || isJobsLoading || isAuditLoading || isSnapshotsLoading,
    createExportJob: createExportMutation.mutateAsync,
    isExporting: createExportMutation.isPending,
    createSnapshot: createSnapshotMutation.mutateAsync,
    isSnapshotting: createSnapshotMutation.isPending,
    generateShareLink: shareMutation.mutateAsync,
    isSharing: shareMutation.isPending
  }
}

export default useRAGReports
