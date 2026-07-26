import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function AnalyticsHeroSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse" aria-label="Loading hero dashboard">
      {/* Hero Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-56 rounded-xl bg-white/5" />
            <Skeleton className="h-7 w-7 rounded-lg bg-white/5" />
          </div>
          <Skeleton className="h-4 w-80 rounded-md bg-white/5" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-44 rounded-xl bg-white/5" />
          <Skeleton className="h-10 w-32 rounded-xl bg-white/5" />
          <Skeleton className="h-10 w-32 rounded-xl bg-white/5" />
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="hidden md:flex items-center justify-between p-3 rounded-xl bg-[#0f101c] border border-white/5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32 rounded bg-white/5" />
          <Skeleton className="h-5 w-64 rounded-full bg-white/5" />
        </div>
        <Skeleton className="h-5 w-24 rounded bg-white/5" />
      </div>

      {/* 6 KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/5 min-h-[148px]"
          >
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-9 w-9 rounded-xl bg-white/5 shrink-0" />
              <Skeleton className="h-4 w-24 rounded bg-white/5" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg bg-white/5 my-2" />
            <div className="flex items-end justify-between pt-2 border-t border-white/5">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16 rounded-full bg-white/5" />
                <Skeleton className="h-3 w-20 rounded bg-white/5" />
              </div>
              <Skeleton className="h-7 w-16 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnalyticsHeroSkeleton
