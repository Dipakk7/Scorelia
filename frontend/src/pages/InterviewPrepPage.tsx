import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { useInterviewOverview } from '@/hooks/useInterviewPrep'

export function InterviewPrepPage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getSectionVariants(shouldReduceMotion)

  const [activeTab, setActiveTab] = useState<string>('overview')

  // Consume React Query hook for Overview & Sidebar
  const { overviewData, isLoading, isError } = useInterviewOverview()

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 text-slate-100 selection:bg-purple-500/30 font-sans">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-4 sm:space-y-5"
      >
        {/* 1. Header */}
        <motion.div variants={itemVariants}>
          <InterviewPrepHeader
            onDownloadReport={() => setActiveTab('feedback')}
            onStartMockInterview={() => setActiveTab('mock-interviews')}
          />
        </motion.div>

        {/* 2. Navigation Tabs (Matching ATS Analysis Reference) */}
        <motion.div variants={itemVariants}>
          <InterviewPrepNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* 3. Dashboard Workspace Layout */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              {/* Workspace Area (8 Columns) */}
              <div className="lg:col-span-8 space-y-4 sm:space-y-5">
                <InterviewPrepWorkspace
                  overviewData={overviewData}
                  isLoading={isLoading}
                  isEmpty={!overviewData}
                  isError={isError}
                />
              </div>

              {/* Sidebar Area (4 Columns) */}
              <div className="lg:col-span-4 space-y-4 sm:space-y-5">
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
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default InterviewPrepPage
