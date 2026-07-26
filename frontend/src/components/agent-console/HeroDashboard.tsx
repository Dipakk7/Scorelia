import React from 'react'
import { AgentHeroHeader } from './AgentHeroHeader'
import { SystemStatusCard } from './SystemStatusCard'
import { NewAgentButton } from './NewAgentButton'
import { KPIGrid } from './KPIGrid'
import { HeroDashboardSkeleton } from './HeroDashboardSkeleton'
import { cn } from '@/lib/utils'

export interface HeroDashboardProps {
  className?: string
  isLoading?: boolean
  onNewAgentClick?: () => void
}

export function HeroDashboard({
  className,
  isLoading = false,
  onNewAgentClick,
}: HeroDashboardProps) {
  if (isLoading) {
    return <HeroDashboardSkeleton className={className} />
  }

  return (
    <section aria-label="Hero Dashboard Overview" className={cn('space-y-6 text-left', className)}>
      {/* Top Header & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <AgentHeroHeader />

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <SystemStatusCard />
          <NewAgentButton onClick={onNewAgentClick} />
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <KPIGrid />
    </section>
  )
}

export default HeroDashboard
