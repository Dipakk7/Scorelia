import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const DeveloperPerformanceSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 w-full text-left font-sans animate-pulse">
      {/* Row 1 Skeleton: Code Quality Overview & Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-72 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
        <div className="lg:col-span-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Skeleton className="h-32 w-full rounded-2xl bg-slate-900 border border-white/10" />
            <Skeleton className="h-32 w-full rounded-2xl bg-slate-900 border border-white/10" />
            <Skeleton className="h-32 w-full rounded-2xl bg-slate-900 border border-white/10" />
            <Skeleton className="h-32 w-full rounded-2xl bg-slate-900 border border-white/10" />
          </div>
        </div>
      </div>

      {/* Row 2 Skeleton: Commit Activity Chart & Pull Request Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
      </div>

      {/* Row 3 Skeleton: Code Review Metrics & Issue Resolution Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
      </div>

      {/* Row 4 Skeleton: Merge Statistics & Productivity Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
        <div className="lg:col-span-6 w-full">
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
        </div>
      </div>
    </div>
  )
}

export default DeveloperPerformanceSkeleton
