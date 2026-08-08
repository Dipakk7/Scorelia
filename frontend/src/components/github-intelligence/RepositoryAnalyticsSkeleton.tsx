import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const RepositoryAnalyticsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 w-full text-left animate-pulse">
      {/* Heatmap Skeleton (5 cols) */}
      <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900 flex flex-col justify-between h-64 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44 rounded-lg bg-slate-800" />
          <Skeleton className="h-6 w-24 rounded-lg bg-slate-800" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl bg-slate-800" />
        <Skeleton className="h-4 w-32 rounded bg-slate-800" />
      </div>

      {/* Donut Chart Skeleton (4 cols) */}
      <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900 flex flex-col justify-between h-64 space-y-4">
        <Skeleton className="h-6 w-36 rounded-lg bg-slate-800" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-28 w-28 rounded-full shrink-0 bg-slate-800" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full rounded bg-slate-800" />
            <Skeleton className="h-4 w-full rounded bg-slate-800" />
            <Skeleton className="h-4 w-full rounded bg-slate-800" />
            <Skeleton className="h-4 w-full rounded bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-4 w-48 rounded mx-auto bg-slate-800" />
      </div>

      {/* Languages Skeleton (3 cols) */}
      <div className="lg:col-span-3 p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900 flex flex-col justify-between h-64 space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg bg-slate-800" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded bg-slate-800" />
          <Skeleton className="h-4 w-full rounded bg-slate-800" />
          <Skeleton className="h-4 w-full rounded bg-slate-800" />
          <Skeleton className="h-4 w-full rounded bg-slate-800" />
        </div>
        <Skeleton className="h-4 w-36 rounded mx-auto bg-slate-800" />
      </div>
    </div>
  )
}

export default RepositoryAnalyticsSkeleton
