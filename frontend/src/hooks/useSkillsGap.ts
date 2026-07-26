import { useQuery } from '@tanstack/react-query'
import { careerRoadmapService } from '@/services/careerRoadmapService'

export function useSkillsGap() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['skillsGapAnalytics'],
    queryFn: () => careerRoadmapService.getSkillsGap(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    skillsOverview: data?.skillsOverview,
    skillCategories: data?.skillCategories || [],
    missingSkills: data?.missingSkills || [],
    priorityMatrix: data?.priorityMatrix || [],
    marketDemand: data?.marketDemand,
    certificationRecommendations: data?.certificationRecommendations || [],
    learningPath: data?.learningPath || [],
    isLoading,
    isError,
    error,
    refetch,
  }
}
export default useSkillsGap
