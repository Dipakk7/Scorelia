import React from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { HeroHeader } from './HeroHeader'
import { SystemStatusCard } from './SystemStatusCard'
import { KnowledgeGraphButton } from './KnowledgeGraphButton'
import { AddCollectionButton } from './AddCollectionButton'
import { KPIGrid } from './KPIGrid'
import { cn } from '@/lib/utils'

export interface HeroDashboardProps {
  className?: string
  onAddNewCollection?: () => void
  onOpenKnowledgeGraph?: () => void
}

export function HeroDashboard({
  className,
  onAddNewCollection,
  onOpenKnowledgeGraph
}: HeroDashboardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const heroVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.section
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      aria-label="RAG Workspace Hero Dashboard"
      className={cn('space-y-6', className)}
    >
      {/* Top Header & Actions Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <HeroHeader />

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <SystemStatusCard />
          <KnowledgeGraphButton onClick={onOpenKnowledgeGraph} />
          <AddCollectionButton onClick={onAddNewCollection} />
        </div>
      </div>

      {/* KPI 6-Card Responsive Grid */}
      <KPIGrid />
    </motion.section>
  )
}

export default HeroDashboard
