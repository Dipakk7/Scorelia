import React from 'react'
import { motion } from 'framer-motion'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { MilestoneCard } from './MilestoneCard'
import { milestonesTimelineMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { MilestoneItem } from '@/types/careerRoadmap'

export interface MilestoneTimelineProps {
  milestones?: MilestoneItem[]
  onViewDetails?: (id: string) => void
  className?: string
}

export function MilestoneTimeline({
  milestones = milestonesTimelineMockData,
  onViewDetails,
  className,
}: MilestoneTimelineProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <section aria-label="Chronological Career Milestones Timeline" className="w-full text-left">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight m-0">
            Chronological Milestones
          </h3>
          <span className="text-[10px] font-bold text-slate-400 font-mono">
            {milestones.length} Total Goals
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch',
            className
          )}
        >
          {milestones.map((ms) => (
            <motion.div key={ms.id} variants={itemVariants} className="h-full">
              <MilestoneCard milestone={ms} onViewDetails={onViewDetails} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
export default MilestoneTimeline
