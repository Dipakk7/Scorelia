import React, { useState } from 'react'
import InterviewReportHeader from './InterviewReportHeader'
import InterviewSummaryCard from './InterviewSummaryCard'
import CommunicationAnalysisCard from './CommunicationAnalysisCard'
import TechnicalAnalysisCard from './TechnicalAnalysisCard'
import BehavioralAnalysisCard from './BehavioralAnalysisCard'
import ConfidenceInsightsCard from './ConfidenceInsightsCard'
import ImprovementSuggestionsCard from './ImprovementSuggestionsCard'
import AnswerReviewCard from './AnswerReviewCard'
import ExportInterviewReportModal from './ExportInterviewReportModal'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import type { AdaptedTurn, AdaptedInterviewSession } from '@/lib/interview-adapter'

export interface InterviewAnalysisOverviewProps {
  turns?: AdaptedTurn[]
  session?: AdaptedInterviewSession | null
}

export const InterviewAnalysisOverview: React.FC<InterviewAnalysisOverviewProps> = ({
  turns = [],
  session,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getSectionVariants(shouldReduceMotion)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  return (
    <motion.section
      className="flex flex-col gap-6"
      aria-label="Interview Analysis & Report Workspace"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* 1. Report Header with Export & Print Actions */}
      <motion.div variants={itemVariants}>
        <InterviewReportHeader
          session={session}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />
      </motion.div>

      {/* 2. Session Summary Metadata Card */}
      <motion.div variants={itemVariants}>
        <InterviewSummaryCard session={session} />
      </motion.div>

      {/* 3. Recorded Transcript Review Cards */}
      <motion.div variants={itemVariants}>
        <AnswerReviewCard turns={turns} />
      </motion.div>

      {/* 4. Communication & Technical Analysis Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
        <CommunicationAnalysisCard />
        <TechnicalAnalysisCard />
      </motion.div>

      {/* 5. Behavioral & Confidence Insights Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
        <BehavioralAnalysisCard />
        <ConfidenceInsightsCard />
      </motion.div>

      {/* 6. Improvement Suggestions Categories */}
      <motion.div variants={itemVariants}>
        <ImprovementSuggestionsCard />
      </motion.div>

      {/* 7. Export Interview Report Modal */}
      <ExportInterviewReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        session={session}
      />
    </motion.section>
  )
}

export default InterviewAnalysisOverview
