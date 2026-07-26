import React from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { PhaseStatus } from '@/types/careerRoadmap'

export interface TimelineConnectorProps {
  status: PhaseStatus
  className?: string
}

export function TimelineConnector({ status, className }: TimelineConnectorProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const getConnectorStyle = () => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-b from-purple-500 via-purple-600 to-blue-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
      case 'in-progress':
        return 'bg-gradient-to-b from-blue-500 via-indigo-500 to-slate-700 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
      case 'upcoming':
        return 'bg-gradient-to-b from-cyan-500/50 to-slate-800'
      case 'planned':
      default:
        return 'bg-white/10'
    }
  }

  return (
    <div className={cn('w-0.5 min-h-[3rem] h-full my-1 rounded-full relative overflow-hidden bg-white/5', className)}>
      <motion.div
        initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: 'easeOut' }}
        className={cn('w-full h-full origin-top rounded-full', getConnectorStyle())}
      />
    </div>
  )
}
export default TimelineConnector
