import React from 'react'
import { cn } from '@/lib/utils'

export interface AnalyticsSkeletonProps {
  className?: string
}

export function AnalyticsSkeleton({ className }: AnalyticsSkeletonProps) {
  return (
    <div className={cn('space-y-6 animate-pulse text-left', className)} role="status" aria-label="Loading analytics">
      {/* Header & Toolbar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111322] border border-white/5">
        <div className="h-6 w-56 bg-slate-800 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 w-48 bg-slate-800 rounded-xl" />
          <div className="h-8 w-32 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#111322] border border-white/10 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-800 rounded" />
                <div className="h-6 w-20 bg-slate-700 rounded" />
              </div>
              <div className="h-9 w-9 bg-slate-800 rounded-xl" />
            </div>
            <div className="h-3 w-28 bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
          <div className="h-5 w-64 bg-slate-800 rounded" />
          <div className="h-64 w-full bg-slate-800/60 rounded-xl" />
        </div>
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
          <div className="h-5 w-44 bg-slate-800 rounded" />
          <div className="h-64 w-full bg-slate-800/60 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSkeleton
