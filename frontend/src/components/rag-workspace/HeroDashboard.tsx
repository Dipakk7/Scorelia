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
        'relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#14162a] via-[#111324] to-[#0d0f1e] border border-white/10 shadow-2xl shadow-purple-950/20 backdrop-blur-md transition-all duration-300 space-y-4 text-left select-none',
        className
      )}
    >
      {/* Ambient Glow Effects */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Actions Row */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
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
      {showKpiGrid && (
        <div className="relative z-10">
          <KPIGrid />
        </div>
      )}
    </motion.section>
  )
}

export default HeroDashboard


