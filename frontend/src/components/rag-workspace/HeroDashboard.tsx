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
  showKpiGrid?: boolean
}

export function HeroDashboard({
  className,
  onAddNewCollection,
  onOpenKnowledgeGraph,
  showKpiGrid = false
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
      className={cn(
        'p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-purple-500/30 transition-all duration-300 space-y-4 text-left select-none',
        className
      )}
    >
      {/* Top Header & Actions Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        {/* Title & Subtitle */}
        <HeroHeader />

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <SystemStatusCard />
          <KnowledgeGraphButton onClick={onOpenKnowledgeGraph} />
          <AddCollectionButton onClick={onAddNewCollection} />
        </div>
      </div>

      {/* Optional KPI Grid */}
      {showKpiGrid && <KPIGrid />}
    </motion.section>
  )
}

export default HeroDashboard


