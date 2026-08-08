import api from '@/api/api'
import {
  careerRoadmapHeroMockData,
  roadmapPhasesMockData,
  recommendedNextStepsMockData,
  skillsOverviewMockData,
  skillCategoriesMockData,
  missingSkillsMockData,
  priorityMatrixMockData,
  marketDemandMockData,
  certificationRecommendationsMockData,
  learningPathMockData,
  milestonesOverviewMockData,
  goalTrackerMockData,
  milestonesTimelineMockData,
  upcomingMilestonesMockData,
  achievementGalleryMockData,
  nextStepsPlannerMockData,
  productivityInsightsMockData,
  progressHistoryMockData,
  assistantMessagesMockData,
  suggestedPromptsMockData,
  careerInsightsMockData,
  recommendedActionsMockData,
  sessionSummaryMockData,
} from '@/data/careerRoadmapMockData'
import type {
  CareerRoadmapHeroData,
  RoadmapPhase,
  RecommendedStepData,
  SkillsOverviewData,
  SkillCategoryItem,
  MissingSkillItem,
  PriorityMatrixItem,
  MarketDemandData,
  CertificationItem,
  LearningPathStep,
  MilestonesOverviewData,
  GoalTrackerData,
  MilestoneItem,
  UpcomingMilestoneItem,
  AchievementItem,
  NextStepPlannerItem,
  ProductivityInsightData,
  ProgressHistoryItem,
  ChatMessageData,
  CareerInsightData,
  RecommendedActionData,
  SessionSummaryData,
} from '@/types/careerRoadmap'

export interface TimelineApiResponse {
  phases: RoadmapPhase[]
  recommendedNextSteps: RecommendedStepData[]
}

export interface SkillsGapApiResponse {
  skillsOverview: SkillsOverviewData
  skillCategories: SkillCategoryItem[]
  missingSkills: MissingSkillItem[]
  priorityMatrix: PriorityMatrixItem[]
  marketDemand: MarketDemandData
  certificationRecommendations: CertificationItem[]
  learningPath: LearningPathStep[]
}

export interface MilestonesApiResponse {
  overview: MilestonesOverviewData
  goalTracker: GoalTrackerData
  milestones: MilestoneItem[]
  upcomingMilestones: UpcomingMilestoneItem[]
  achievements: AchievementItem[]
  nextSteps: NextStepPlannerItem[]
  productivityInsights: ProductivityInsightData
  progressHistory: ProgressHistoryItem[]
}

export interface AssistantApiResponse {
  messages: ChatMessageData[]
  suggestedPrompts: string[]
  insights: CareerInsightData
  recommendedActions: RecommendedActionData[]
  sessionSummary: SessionSummaryData
}

export class CareerRoadmapApiService {
  /* 1. Overview / Hero Data API */
  static async getOverviewData(): Promise<CareerRoadmapHeroData> {
    try {
      const response = await api.get('/ai/roadmap/overview')
      return response.data
    } catch (error) {
      console.warn('[CareerRoadmapApi] /ai/roadmap/overview fallback used', error)
      return careerRoadmapHeroMockData
    }
  }

  /* 2. Timeline API */
  static async getTimelineData(): Promise<TimelineApiResponse> {
    try {
      const response = await api.get('/ai/roadmap/timeline')
      return response.data
    } catch (error) {
      console.warn('[CareerRoadmapApi] /ai/roadmap/timeline fallback used', error)
      return {
        phases: roadmapPhasesMockData,
        recommendedNextSteps: recommendedNextStepsMockData,
      }
    }
  }

  /* 3. Skills Gap API */
  static async getSkillsGapData(): Promise<SkillsGapApiResponse> {
    try {
      const response = await api.get('/ai/roadmap/skills-gap')
      return response.data
    } catch (error) {
      console.warn('[CareerRoadmapApi] /ai/roadmap/skills-gap fallback used', error)
      return {
        skillsOverview: skillsOverviewMockData,
        skillCategories: skillCategoriesMockData,
        missingSkills: missingSkillsMockData,
        priorityMatrix: priorityMatrixMockData,
        marketDemand: marketDemandMockData,
        certificationRecommendations: certificationRecommendationsMockData,
        learningPath: learningPathMockData,
      }
    }
  }

  /* 4. Milestones API */
  static async getMilestonesData(): Promise<MilestonesApiResponse> {
    try {
      const response = await api.get('/ai/roadmap/milestones')
      return response.data
    } catch (error) {
      console.warn('[CareerRoadmapApi] /ai/roadmap/milestones fallback used', error)
      return {
        overview: milestonesOverviewMockData,
        goalTracker: goalTrackerMockData,
        milestones: milestonesTimelineMockData,
        upcomingMilestones: upcomingMilestonesMockData,
        achievements: achievementGalleryMockData,
        nextSteps: nextStepsPlannerMockData,
        productivityInsights: productivityInsightsMockData,
        progressHistory: progressHistoryMockData,
      }
    }
  }

  /* 5. Assistant API */
  static async getAssistantData(): Promise<AssistantApiResponse> {
    try {
      const response = await api.get('/ai/roadmap/assistant')
      return response.data
    } catch (error) {
      console.warn('[CareerRoadmapApi] /ai/roadmap/assistant fallback used', error)
      return {
        messages: assistantMessagesMockData,
        suggestedPrompts: suggestedPromptsMockData,
        insights: careerInsightsMockData,
        recommendedActions: recommendedActionsMockData,
        sessionSummary: sessionSummaryMockData,
      }
    }
  }

  /* 6. Post Assistant Message API */
  static async sendAssistantMessage(
    message: string,
    context?: string,
    roadmapId?: string
  ): Promise<AssistantApiResponse> {
    try {
      const response = await api.post('/ai/roadmap/assistant/message', {
        message,
        context,
        roadmap_id: roadmapId,
      })
      return response.data
    } catch (error) {
      console.warn('[CareerRoadmapApi] /ai/roadmap/assistant/message fallback used', error)
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const userMsg: ChatMessageData = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: message,
        timestamp: nowStr,
      }
      const aiReply: ChatMessageData = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Great focus! Regarding "${message}", I recommend prioritizing your Phase 2 Model Evaluation modules and tackling 2 coding challenges on Scikit-Learn pipelines today.`,
        timestamp: nowStr,
        bulletPoints: [
          'Review Cross-Validation & ROC-AUC score metrics',
          'Practice model persistence using Joblib or Pickle',
        ],
      }
      return {
        messages: [...assistantMessagesMockData, userMsg, aiReply],
        suggestedPrompts: suggestedPromptsMockData,
        insights: careerInsightsMockData,
        recommendedActions: recommendedActionsMockData,
        sessionSummary: sessionSummaryMockData,
      }
    }
  }
}
export default CareerRoadmapApiService
