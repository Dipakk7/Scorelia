import { useMutation } from '@tanstack/react-query'
import { administrationService } from '@/services/administrationService'

export function useAdministration() {
  const bulkActionMutation = useMutation({
    mutationFn: ({ actionType, targetIds }: { actionType: string; targetIds?: string[] }) =>
      administrationService.executeBulkAction(actionType, targetIds),
  })

  const diagnosticsMutation = useMutation({
    mutationFn: () => administrationService.runSystemDiagnostics(),
  })

  return {
    executeBulkAction: bulkActionMutation.mutateAsync,
    isExecutingBulk: bulkActionMutation.isPending,
    runDiagnostics: diagnosticsMutation.mutateAsync,
    isRunningDiagnostics: diagnosticsMutation.isPending,
  }
}

export default useAdministration
