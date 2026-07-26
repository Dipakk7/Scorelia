from typing import List, Optional
from pydantic import BaseModel, Field

class KPICardSchema(BaseModel):
    id: str
    label: str
    value: str
    subtext: str
    accentColor: str
    iconType: str
    actionable: Optional[bool] = False
    actionText: Optional[str] = None
    progressValue: Optional[int] = None

class CareerRoadmapOverviewResponse(BaseModel):
    title: str
    subtitle: str
    lastUpdated: str
    kpis: List[KPICardSchema]

class ChecklistItemSchema(BaseModel):
    id: str
    title: str
    status: str

class RoadmapPhaseSchema(BaseModel):
    id: str
    phaseNumber: int
    title: str
    months: str
    progress: int
    status: str
    description: str
    learningObjectives: List[str]
    checklist: List[ChecklistItemSchema]
    estimatedHours: str
    difficulty: str
    skillTags: List[str]
    accentColor: str

class RecommendedStepSchema(BaseModel):
    id: str
    type: str
    title: str
    subtitle: str
    meta: str
    estimatedTime: str
    difficulty: str
    action: str
    btnVariant: str
    tagBg: str

class TimelineResponse(BaseModel):
    phases: List[RoadmapPhaseSchema]
    recommendedNextSteps: List[RecommendedStepSchema]

class SkillsOverviewSchema(BaseModel):
    overallReadiness: int
    gapScore: int
    completedSkillsCount: int
    totalSkillsCount: int
    marketAlignment: str

class SkillCategoryItemSchema(BaseModel):
    id: str
    name: str
    completion: int
    status: str
    difficulty: str
    iconName: str
    accentColor: str

class MissingSkillItemSchema(BaseModel):
    id: str
    name: str
    priority: str
    estimatedHours: str
    recommendedTimeline: str
    category: str

class PriorityMatrixItemSchema(BaseModel):
    id: str
    name: str
    impact: str
    effort: str
    quadrant: str
    category: str

class MarketDemandSchema(BaseModel):
    demandLevel: str
    hiringTrend: str
    yoyGrowth: str
    topHiringSkills: List[str]
    salaryRange: str
    industryGrowth: str

class CertificationItemSchema(BaseModel):
    id: str
    title: str
    provider: str
    estimatedDuration: str
    difficulty: str
    priority: str
    actionText: str

class LearningPathStepSchema(BaseModel):
    stepNumber: int
    title: str
    status: str
    description: str

class SkillsGapResponse(BaseModel):
    skillsOverview: SkillsOverviewSchema
    skillCategories: List[SkillCategoryItemSchema]
    missingSkills: List[MissingSkillItemSchema]
    priorityMatrix: List[PriorityMatrixItemSchema]
    marketDemand: MarketDemandSchema
    certificationRecommendations: List[CertificationItemSchema]
    learningPath: List[LearningPathStepSchema]

class MilestonesOverviewSchema(BaseModel):
    completedMilestones: int
    upcomingMilestones: int
    currentStreakDays: int
    overallCompletionPercentage: int

class GoalTrackerSchema(BaseModel):
    currentGoal: str
    targetCompletionQuarter: str
    goalHealth: str
    weeklyProgressPercentage: int
    weeklyTasksDone: int
    weeklyTasksTotal: int
    monthlyProgressPercentage: int
    monthlyTopicsDone: int
    monthlyTopicsTotal: int

class MilestoneItemSchema(BaseModel):
    id: str
    title: str
    phaseName: str
    targetDate: str
    status: str
    progress: int
    description: str
    priority: str
    estimatedEffort: str
    iconName: str

class UpcomingMilestoneItemSchema(BaseModel):
    id: str
    title: str
    dueDate: str
    daysRemaining: int
    priority: str
    progress: int

class AchievementItemSchema(BaseModel):
    id: str
    title: str
    unlockDate: str
    description: str
    iconName: str
    badgeRibbon: str

class NextStepPlannerItemSchema(BaseModel):
    id: str
    title: str
    category: str
    estimatedDuration: str
    priority: str
    actionText: str
    iconName: str

class ProgressHistoryItemSchema(BaseModel):
    id: str
    title: str
    description: str
    timestamp: str
    eventType: str

class ProductivityInsightSchema(BaseModel):
    learningConsistencyPercentage: int
    avgStudyHoursPerDay: float
    tasksCompletedTotal: int
    weeklyTrendPercentage: str
    longestStreakDays: int
    mostProductiveDay: str

class MilestonesResponse(BaseModel):
    overview: MilestonesOverviewSchema
    goalTracker: GoalTrackerSchema
    milestones: List[MilestoneItemSchema]
    upcomingMilestones: List[UpcomingMilestoneItemSchema]
    achievements: List[AchievementItemSchema]
    nextSteps: List[NextStepPlannerItemSchema]
    productivityInsights: ProductivityInsightSchema
    progressHistory: List[ProgressHistoryItemSchema]

class ChatMessageSchema(BaseModel):
    id: str
    sender: str
    text: str
    timestamp: str
    codeSnippet: Optional[str] = None
    bulletPoints: Optional[List[str]] = None

class CareerInsightSchema(BaseModel):
    readinessScore: int
    strongestSkill: str
    weakestSkill: str
    estimatedTimeline: str
    focusArea: str
    learningVelocity: str

class RecommendedActionSchema(BaseModel):
    id: str
    title: str
    category: str
    iconName: str
    actionText: str

class SessionSummarySchema(BaseModel):
    todayFocus: str
    goalsDiscussed: List[str]
    aiSuggestionsCount: int
    completedTopicsCount: int
    sessionDuration: str

class AssistantResponse(BaseModel):
    messages: List[ChatMessageSchema]
    suggestedPrompts: List[str]
    insights: CareerInsightSchema
    recommendedActions: List[RecommendedActionSchema]
    sessionSummary: SessionSummarySchema

class AssistantMessageRequest(BaseModel):
    message: str
    context: Optional[str] = None
    roadmap_id: Optional[str] = None
