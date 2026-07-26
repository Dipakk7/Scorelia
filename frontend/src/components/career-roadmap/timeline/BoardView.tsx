import React from 'react'
import { motion } from 'framer-motion'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { RoadmapPhaseCard } from './RoadmapPhaseCard'
import { cn } from '@/lib/utils'
import type { RoadmapPhase } from '@/types/careerRoadmap'

export interface BoardViewProps {
  phases: RoadmapPhase[]
  onExpandDetails?: (phaseId: string) => void
  className?: string
}

export function BoardView({ phases, onExpandDetails, className }: BoardViewProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <section aria-label="12-Month Board View Career Roadmap" className={cn('w-full text-left', className)}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch"
      >
        {phases.map((phase) => (
          <motion.div key={phase.id} variants={itemVariants} className="h-full">
            <RoadmapPhaseCard phase={phase} onExpandDetails={onExpandDetails} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
export default BoardView
