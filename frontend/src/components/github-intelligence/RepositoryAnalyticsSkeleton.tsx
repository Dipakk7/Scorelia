import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const RepositoryAnalyticsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-left">
      {/* Heatmap Skeleton (5 cols) */}
      <div className="lg:col-span-5 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 flex flex-col justify-between h-64 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>

      {/* Donut Chart Skeleton (4 cols) */}
      <div className="lg:col-span-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 flex flex-col justify-between h-64 space-y-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-28 w-28 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>
        <Skeleton className="h-4 w-48 rounded mx-auto" />
      </div>

      {/* Languages Skeleton (3 cols) */}
      <div className="lg:col-span-3 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 flex flex-col justify-between h-64 space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
        <Skeleton className="h-4 w-36 rounded mx-auto" />
      </div>
    </div>
  )
}
