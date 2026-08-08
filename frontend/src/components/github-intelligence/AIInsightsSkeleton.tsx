import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const AIInsightsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 w-full text-left font-sans animate-pulse">
      {/* Row 1 Skeleton: AI Insights (7 cols) & Recommendations (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-7 w-full">
          <Skeleton className="h-80 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
        <div className="lg:col-span-5 w-full">
          <Skeleton className="h-80 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
      </div>

      {/* Row 2 Skeleton: Weekly Summary (6 cols) & Goals Progress (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
      </div>

      {/* Row 3 Skeleton: Activity Feed (7 cols) & Achievements (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-7 w-full">
          <Skeleton className="h-72 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
        <div className="lg:col-span-5 w-full">
          <Skeleton className="h-72 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
      </div>
    </div>
  )
}

export default AIInsightsSkeleton
