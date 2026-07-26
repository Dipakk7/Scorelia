import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function ReportsSkeleton() {
  return (
    <div className="space-y-8 w-full animate-pulse text-left" aria-label="Loading reports workspace">
      {/* 6 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#0f101c] border border-white/5 space-y-2">
            <Skeleton className="h-8 w-8 rounded-xl bg-white/5" />
            <Skeleton className="h-6 w-20 rounded bg-white/5" />
            <Skeleton className="h-3 w-28 rounded bg-white/5" />
          </div>
        ))}
      </div>

      {/* Templates Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-44 rounded bg-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0f101c] border border-white/5 space-y-3 h-40">
              <Skeleton className="h-5 w-32 rounded bg-white/5" />
              <Skeleton className="h-3 w-full rounded bg-white/5" />
              <Skeleton className="h-8 w-24 rounded-xl bg-white/5 ml-auto mt-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Saved Reports Table Skeleton */}
      <div className="p-4 rounded-2xl bg-[#0f101c] border border-white/5 space-y-3 h-64">
        <Skeleton className="h-6 w-48 rounded bg-white/5" />
        <Skeleton className="h-44 w-full rounded-xl bg-white/5" />
      </div>
    </div>
  )
}

export default ReportsSkeleton
