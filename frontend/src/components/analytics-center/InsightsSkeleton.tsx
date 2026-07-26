import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function InsightsSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse text-left" aria-label="Loading intelligence workspace">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <Skeleton className="h-5 w-32 rounded bg-white/5" />
        <Skeleton className="h-4 w-16 rounded bg-white/5" />
      </div>

      {/* 4 Insight Cards Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#0f101c] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded bg-white/5" />
              <Skeleton className="h-4 w-14 rounded-full bg-white/5" />
            </div>
            <Skeleton className="h-3 w-full rounded bg-white/5" />
            <Skeleton className="h-3 w-3/4 rounded bg-white/5" />
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <Skeleton className="h-3 w-20 rounded bg-white/5" />
              <Skeleton className="h-3 w-16 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Skeleton */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <Skeleton className="h-4 w-28 rounded bg-white/5" />
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-[#0f101c] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-7 rounded-lg bg-white/5" />
              <Skeleton className="h-4 w-32 rounded bg-white/5" />
            </div>
            <Skeleton className="h-3 w-12 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsightsSkeleton
