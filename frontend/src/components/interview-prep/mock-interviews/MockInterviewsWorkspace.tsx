import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { InterviewSetupPanel } from './InterviewSetupPanel'
import { InterviewSummaryCard } from './InterviewSummaryCard'
import { StartInterviewSection } from './StartInterviewSection'
import { RecentMockInterviews } from './RecentMockInterviews'
import { useMockInterviews } from '@/hooks/useInterviewPrep'
import type { MockInterviewSetupConfig } from '@/types/interviewPrep'

export function MockInterviewsWorkspace() {
  const {
    resumes,
    difficulties,
    interviewTypes,
    interviewModes,
    history,
    isLoading,
    startInterview,
    isStarting,
  } = useMockInterviews()

  const [setupConfig, setSetupConfig] = useState<MockInterviewSetupConfig>({
    resumeId: resumes[0]?.id || 'res-1',
    targetRole: 'AI/ML Engineer',
    companyName: 'Google',
    experienceLevel: 'Mid',
    durationMinutes: 45,
    interviewType: 'technical',
    difficulty: 'medium',
    mode: 'voice',
  })

  const handleStartInterview = async () => {
    await startInterview(setupConfig)
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-5 text-left"
    >
      {/* Top Split Layout: Configuration Form (8 Cols) vs Real-time Summary Card (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Left Column: Form Setup Panel (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col">
          <InterviewSetupPanel
            config={setupConfig}
            onChangeConfig={(updated) => setSetupConfig((prev) => ({ ...prev, ...updated }))}
            resumes={resumes}
            difficulties={difficulties}
            interviewTypes={interviewTypes}
            interviewModes={interviewModes}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Real-time Config Summary & Start Section (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 sm:space-y-5">
          <InterviewSummaryCard
            config={setupConfig}
            resumes={resumes}
          />

          <StartInterviewSection
            onStartInterview={handleStartInterview}
            isStarting={isStarting}
          />
        </div>
      </div>

      {/* Bottom Full-Width Section: Past Mock Rounds History */}
      <RecentMockInterviews historyList={history} isLoading={isLoading} />
    </motion.main>
  )
}
export default MockInterviewsWorkspace
