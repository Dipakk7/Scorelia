import React from 'react'
import { motion } from 'framer-motion'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { TimelineNode } from './TimelineNode'
import { TimelineConnector } from './TimelineConnector'
import { RoadmapPhaseCard } from './RoadmapPhaseCard'
import { cn } from '@/lib/utils'
import type { RoadmapPhase } from '@/types/careerRoadmap'

export interface TimelineViewProps {
  phases: RoadmapPhase[]
  onExpandDetails?: (phaseId: string) => void
  className?: string
}

export function TimelineView({ phases, onExpandDetails, className }: TimelineViewProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <section aria-label="12-Month Vertical Career Roadmap Timeline" className={cn('w-full text-left', className)}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-6 sm:space-y-8 relative"
      >
        {phases.map((phase, idx) => {
          const isLast = idx === phases.length - 1

          return (
            <motion.div key={phase.id} variants={itemVariants} className="relative flex items-start gap-4 sm:gap-6">
              {/* Left Column: Timeline Node & Connector Line */}
              <div className="flex flex-col items-center shrink-0 pt-2">
                <TimelineNode phaseNumber={phase.phaseNumber} status={phase.status} />
                {!isLast && <TimelineConnector status={phase.status} className="my-2" />}
              </div>

              {/* Right Column: Roadmap Phase Card */}
              <div className="flex-1 min-w-0">
                <RoadmapPhaseCard phase={phase} onExpandDetails={onExpandDetails} />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
export default TimelineView
