import React from 'react'
import { AgentKPICardSkeleton } from './AgentKPICard'
import { cn } from '@/lib/utils'

export interface HeroDashboardSkeletonProps {
  className?: string
}

export function HeroDashboardSkeleton({ className }: HeroDashboardSkeletonProps) {
  return (
    <div className={cn('space-y-6 animate-pulse text-left', className)} role="status" aria-label="Loading Hero Dashboard">
      {/* Top Header & Actions Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Hero Title Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-slate-800/60 rounded-lg" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-44 bg-slate-800 rounded-xl" />
          <div className="h-9 w-28 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* 6 KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <AgentKPICardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default HeroDashboardSkeleton
