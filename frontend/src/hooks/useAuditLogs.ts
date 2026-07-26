import { useQuery } from '@tanstack/react-query'
import { auditLogService } from '@/services/auditLogService'

export function useAuditLogs() {
  const { data: auditLogs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['auditLogsList'],
    queryFn: () => auditLogService.getAuditLogs(),
    staleTime: 1000 * 60 * 5,
  })

  return {
    auditLogs,
    isLoading,
    isError,
    refetch,
  }
}

export default useAuditLogs
