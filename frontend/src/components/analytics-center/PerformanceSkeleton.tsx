import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function PerformanceSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse" aria-label="Loading performance dashboard">
      {/* 8-Card Metric Overview Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/5 min-h-[140px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 rounded-xl bg-white/5" />
                <Skeleton className="h-4 w-28 rounded bg-white/5" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
            </div>
            <Skeleton className="h-7 w-24 rounded-lg bg-white/5 my-2" />
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <Skeleton className="h-4 w-16 rounded bg-white/5" />
              <Skeleton className="h-6 w-16 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>

      {/* 2 Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <div className="p-5 rounded-2xl bg-[#0f101c] border border-white/5 h-64 flex flex-col justify-between">
          <Skeleton className="h-5 w-44 rounded bg-white/5" />
          <Skeleton className="h-40 w-full rounded-xl bg-white/5 my-auto" />
          <Skeleton className="h-4 w-32 rounded bg-white/5" />
        </div>
        <div className="p-5 rounded-2xl bg-[#0f101c] border border-white/5 h-64 flex flex-col justify-between">
          <Skeleton className="h-5 w-44 rounded bg-white/5" />
          <Skeleton className="h-40 w-full rounded-xl bg-white/5 my-auto" />
          <Skeleton className="h-4 w-32 rounded bg-white/5" />
        </div>
      </div>

      {/* 6 System Health Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#0f101c] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded-xl bg-white/5" />
              <Skeleton className="h-4 w-16 rounded-full bg-white/5" />
            </div>
            <Skeleton className="h-4 w-28 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PerformanceSkeleton
