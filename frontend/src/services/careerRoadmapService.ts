import { CareerRoadmapApiService } from '@/api/careerRoadmapApi'
import type {
  TimelineApiResponse,
  SkillsGapApiResponse,
  MilestonesApiResponse,
  AssistantApiResponse,
} from '@/api/careerRoadmapApi'
import type { CareerRoadmapHeroData } from '@/types/careerRoadmap'

export const careerRoadmapService = {
  getOverview: (): Promise<CareerRoadmapHeroData> => CareerRoadmapApiService.getOverviewData(),
  getTimeline: (): Promise<TimelineApiResponse> => CareerRoadmapApiService.getTimelineData(),
  getSkillsGap: (): Promise<SkillsGapApiResponse> => CareerRoadmapApiService.getSkillsGapData(),
  getMilestones: (): Promise<MilestonesApiResponse> => CareerRoadmapApiService.getMilestonesData(),
  getAssistant: (): Promise<AssistantApiResponse> => CareerRoadmapApiService.getAssistantData(),
  sendAssistantMessage: (
    message: string,
    context?: string,
    roadmapId?: string
  ): Promise<AssistantApiResponse> =>
    CareerRoadmapApiService.sendAssistantMessage(message, context, roadmapId),
}
export default careerRoadmapService
