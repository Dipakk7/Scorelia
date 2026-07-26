import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { InterviewPrepHeader } from '@/components/interview-prep/InterviewPrepHeader'
import { InterviewPrepNavigation } from '@/components/interview-prep/InterviewPrepNavigation'
import { InterviewPrepWorkspace } from '@/components/interview-prep/InterviewPrepWorkspace'
import { MockInterviewsWorkspace } from '@/components/interview-prep/mock-interviews/MockInterviewsWorkspace'
import { QuestionBankWorkspace } from '@/components/interview-prep/question-bank/QuestionBankWorkspace'
import { MyAnswersWorkspace } from '@/components/interview-prep/my-answers/MyAnswersWorkspace'
import { PerformanceWorkspace } from '@/components/interview-prep/performance/PerformanceWorkspace'
import { InterviewReportsWorkspace } from '@/components/interview-prep/reports/InterviewReportsWorkspace'
import { InterviewCopilotWorkspace } from '@/components/interview-prep/copilot/InterviewCopilotWorkspace'
import { InterviewPrepSidebar } from '@/components/interview-prep/sidebar/InterviewPrepSidebar'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { useInterviewOverview } from '@/hooks/useInterviewPrep'

export function InterviewPrepPage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<string>('overview')

  // Consume React Query hook for Overview & Sidebar
  const { overviewData, isLoading, isError } = useInterviewOverview()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-5 p-4 sm:p-6 text-left max-w-[1600px] mx-auto font-sans"
    >
      {/* 1. Header */}
      <InterviewPrepHeader
        onDownloadReport={() => setActiveTab('feedback')}
        onStartMockInterview={() => setActiveTab('mock-interviews')}
      />

      {/* 2. Navigation Tabs */}
      <InterviewPrepNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Overview Dashboard Workspace Layout */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Workspace Area (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            <InterviewPrepWorkspace
              overviewData={overviewData}
              isLoading={isLoading}
              isEmpty={!overviewData}
              isError={isError}
            />
          </div>

          {/* Sidebar Area (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <InterviewPrepSidebar
              sidebarData={overviewData?.aiSidebarData}
              isLoading={isLoading}
              isEmpty={!overviewData}
              isError={isError}
            />
          </div>
        </div>
      )}

      {/* 4. Mock Interviews Workspace Layout */}
      {activeTab === 'mock-interviews' && <MockInterviewsWorkspace />}

      {/* 5. Question Bank Workspace Layout */}
      {activeTab === 'question-bank' && <QuestionBankWorkspace />}

      {/* 6. My Answers & Feedback Workspace Layout */}
      {activeTab === 'my-answers' && <MyAnswersWorkspace />}

      {/* 7. Performance Workspace Layout */}
      {activeTab === 'performance' && <PerformanceWorkspace />}

      {/* 8. Reports & Feedback Workspace Layout */}
      {activeTab === 'feedback' && <InterviewReportsWorkspace />}

      {/* 9. Interview Copilot Workspace Layout */}
      {activeTab === 'copilot' && <InterviewCopilotWorkspace />}
    </motion.div>
  )
}
export default InterviewPrepPage
