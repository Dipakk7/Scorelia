import React from 'react'
import { cn } from '@/lib/utils'

export interface InsightsSkeletonProps {
  className?: string
}

export function InsightsSkeleton({ className }: InsightsSkeletonProps) {
  return (
    <div className={cn('space-y-6 animate-pulse text-left', className)} role="status" aria-label="Loading insights">
      {/* Header & Tabs Skeleton */}
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <div className="h-6 w-56 bg-slate-800 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 w-32 bg-slate-800 rounded-xl" />
          <div className="h-8 w-32 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Insight Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#111322] border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-5 w-48 bg-slate-800 rounded" />
              <div className="h-4 w-16 bg-slate-800 rounded-full" />
            </div>
            <div className="h-3 w-full bg-slate-800 rounded" />
            <div className="h-3 w-3/4 bg-slate-800 rounded" />
            <div className="h-10 w-full bg-slate-800/60 rounded-xl pt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsightsSkeleton
