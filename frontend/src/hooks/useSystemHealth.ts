import { useQuery } from '@tanstack/react-query'
import { systemHealthService } from '@/services/systemHealthService'

export function useSystemHealth() {
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['systemHealthServices'],
    queryFn: () => systemHealthService.getOperationalServices(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: resources, isLoading: isLoadingResources } = useQuery({
    queryKey: ['systemHealthResources'],
    queryFn: () => systemHealthService.getResourceMetrics(),
    staleTime: 1000 * 60 * 5,
  })

  return {
    services,
    resources,
    isLoading: isLoadingServices || isLoadingResources,
  }
}

export default useSystemHealth
