import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { KPICard } from './KPICard'
import { cn } from '@/lib/utils'
import type { KPICardData } from '@/types/careerRoadmap'

export interface KPIGridProps {
  kpis: KPICardData[]
  onCardAction?: (cardId: string) => void
  className?: string
}

export const KPIGrid = memo(function KPIGrid({ kpis, onCardAction, className }: KPIGridProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <section aria-label="Career Roadmap Summary Key Performance Indicators" className="w-full">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4',
          className
        )}
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.id} variants={itemVariants}>
            <KPICard data={kpi} onActionClick={onCardAction} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
})
export default KPIGrid
