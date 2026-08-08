import React from 'react'
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
}: HeroDashboardProps) {
  if (isLoading) {
    return <HeroDashboardSkeleton className={className} />
  }

  return (
    <section aria-label="Hero Telemetry Grid" className={cn('text-left', className)}>
      {/* 6 KPI Cards Grid */}
      <KPIGrid />
    </section>
  )
}

export default HeroDashboard
