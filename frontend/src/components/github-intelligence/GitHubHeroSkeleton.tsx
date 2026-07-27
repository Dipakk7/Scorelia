import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const GitHubHeroSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full text-left font-sans">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-96 rounded" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70">
        <Skeleton className="h-10 w-80 rounded-xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      {/* 7 KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 flex flex-col justify-between h-36 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
