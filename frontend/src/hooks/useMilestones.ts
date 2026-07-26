import { useQuery } from '@tanstack/react-query'
import { careerRoadmapService } from '@/services/careerRoadmapService'

export function useMilestones() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['milestonesWorkspace'],
    queryFn: () => careerRoadmapService.getMilestones(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    overview: data?.overview,
    goalTracker: data?.goalTracker,
    milestones: data?.milestones || [],
    upcomingMilestones: data?.upcomingMilestones || [],
    achievements: data?.achievements || [],
    nextSteps: data?.nextSteps || [],
    productivityInsights: data?.productivityInsights,
    progressHistory: data?.progressHistory || [],
    isLoading,
    isError,
    error,
    refetch,
  }
}
export default useMilestones
