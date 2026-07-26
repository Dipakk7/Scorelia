import React from 'react'
import InterviewOverviewCard from './InterviewOverviewCard'
import SessionProgressCard from './SessionProgressCard'
import QuestionNavigatorCard from './QuestionNavigatorCard'
import InterviewTimelineCard from './InterviewTimelineCard'
import InterviewInsightsCard from './InterviewInsightsCard'
import InterviewFeedbackTimeline from './InterviewFeedbackTimeline'
import InterviewPreparationTipsCard from './InterviewPreparationTipsCard'
import AITipsCard from './AITipsCard'
import InterviewNotesCard from './InterviewNotesCard'
import UpcomingFeaturesCard from './UpcomingFeaturesCard'

export interface InterviewSidebarProps {
  activeTab?: 'workspace' | 'analysis'
  currentQuestionIndex?: number
}

export const InterviewSidebar: React.FC<InterviewSidebarProps> = ({
  activeTab = 'workspace',
  currentQuestionIndex = 0,
}) => {
  if (activeTab === 'analysis') {
    return (
      <aside className="flex flex-col gap-6" aria-label="Interview Analysis Sidebar">
        {/* Analysis & Feedback Timeline */}
        <InterviewFeedbackTimeline />

        {/* Preparation Tips Guide */}
        <InterviewPreparationTipsCard />

        {/* Session Overview Card */}
        <InterviewOverviewCard />

        {/* Candidate Notes */}
        <InterviewNotesCard />

        {/* Roadmap Teaser */}
        <UpcomingFeaturesCard />
      </aside>
    )
  }

  return (
    <aside className="flex flex-col gap-6" aria-label="Interview Workspace Sidebar">
      {/* Progression Timeline */}
      <InterviewTimelineCard currentStepIndex={currentQuestionIndex + 1} />

      {/* Overview Card */}
      <InterviewOverviewCard />

      {/* Session Progress Timeline */}
      <SessionProgressCard />

      {/* Question Navigator */}
      <QuestionNavigatorCard />

      {/* Guidance & Insights */}
      <InterviewInsightsCard />

      {/* Preparation Tips */}
      <InterviewPreparationTipsCard />

      {/* Real-time AI Tips */}
      <AITipsCard />

      {/* Candidate Notes */}
      <InterviewNotesCard />

      {/* Roadmap Teaser */}
      <UpcomingFeaturesCard />
    </aside>
  )
}

export default InterviewSidebar
