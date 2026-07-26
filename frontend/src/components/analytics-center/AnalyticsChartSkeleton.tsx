import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function AnalyticsChartSkeleton() {
  return (
    <div className="space-y-4 w-full animate-pulse" aria-label="Loading charts workspace">
      {/* Chart Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0f101c] border border-white/5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-xl bg-white/5" />
          <Skeleton className="h-8 w-20 rounded-xl bg-white/5" />
          <Skeleton className="h-8 w-20 rounded-xl bg-white/5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-xl bg-white/5" />
          <Skeleton className="h-8 w-20 rounded-xl bg-white/5" />
        </div>
      </div>

      {/* Top 3 Charts Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-5 rounded-2xl bg-[#0f101c] border border-white/5 h-72"
          >
            <div className="space-y-2 mb-4">
              <Skeleton className="h-5 w-40 rounded bg-white/5" />
              <Skeleton className="h-3 w-56 rounded bg-white/5" />
            </div>
            <Skeleton className="h-44 w-full rounded-xl bg-white/5 my-auto" />
            <div className="flex justify-end pt-2 border-t border-white/5">
              <Skeleton className="h-4 w-28 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnalyticsChartSkeleton
