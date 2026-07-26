import { useQuery } from '@tanstack/react-query'
import { careerRoadmapService } from '@/services/careerRoadmapService'

export function useCareerRoadmap() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['careerRoadmapOverview'],
    queryFn: () => careerRoadmapService.getOverview(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    heroData: data,
    isLoading,
    isError,
    error,
    refetch,
  }
}
export default useCareerRoadmap
