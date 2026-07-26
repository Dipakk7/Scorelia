import { useQuery } from '@tanstack/react-query'
import { careerRoadmapService } from '@/services/careerRoadmapService'

export function useRoadmapTimeline() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['roadmapTimeline'],
    queryFn: () => careerRoadmapService.getTimeline(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    phases: data?.phases || [],
    recommendedNextSteps: data?.recommendedNextSteps || [],
    isLoading,
    isError,
    error,
    refetch,
  }
}
export default useRoadmapTimeline
