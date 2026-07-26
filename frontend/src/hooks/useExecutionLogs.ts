import { useQuery } from '@tanstack/react-query'
import { auditLogService } from '@/services/auditLogService'

export function useExecutionLogs() {
  const { data: executionLogs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['executionLogsList'],
    queryFn: () => auditLogService.getExecutionLogs(),
    staleTime: 1000 * 60 * 5,
  })

  return {
    executionLogs,
    isLoading,
    isError,
    refetch,
  }
}

export default useExecutionLogs
