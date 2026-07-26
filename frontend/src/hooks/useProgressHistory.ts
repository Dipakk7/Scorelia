import { useQuery } from '@tanstack/react-query'
import { careerRoadmapService } from '@/services/careerRoadmapService'

export function useProgressHistory() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['milestonesWorkspace'],
    queryFn: () => careerRoadmapService.getMilestones(),
    staleTime: 1000 * 60 * 5,
    select: (res) => res.progressHistory,
  })

  return {
    progressHistory: data || [],
    isLoading,
    isError,
    refetch,
  }
}
export default useProgressHistory
