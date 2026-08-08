import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const GitHubHeroSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-5 w-full text-left font-sans animate-pulse">
      {/* 1. Master Executive Hero Card Banner Skeleton */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[#121426] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        {/* Left Title & Metadata Skeleton */}
        <div className="space-y-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-56 rounded-xl bg-slate-800/80" />
            <Skeleton className="h-6 w-24 rounded-full bg-emerald-500/20" />
          </div>
          <Skeleton className="h-4 w-full max-w-xl rounded-md bg-slate-800/60" />
          <div className="flex items-center gap-3 pt-1">
            <Skeleton className="h-5 w-24 rounded-md bg-slate-900" />
            <Skeleton className="h-4 w-28 rounded-md bg-slate-800/50" />
            <Skeleton className="hidden sm:block h-4 w-32 rounded-md bg-slate-800/50" />
          </div>
        </div>

        {/* Right Primary Actions Skeleton */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
          <Skeleton className="h-11 w-28 rounded-xl bg-slate-900 border border-slate-700/60" />
          <Skeleton className="h-11 w-32 rounded-xl bg-purple-950/40 border border-purple-500/20" />
          <Skeleton className="h-11 w-36 rounded-xl bg-purple-600/30 border border-purple-500/30" />
        </div>
      </div>

      {/* 2. Controls Toolbar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#121426]/90 border border-white/10">
        <Skeleton className="h-10 w-full md:max-w-md rounded-xl bg-slate-900 border border-slate-700/50" />
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap justify-end">
          <Skeleton className="h-10 w-32 rounded-xl bg-slate-900 border border-slate-700/50" />
          <Skeleton className="h-10 w-28 rounded-xl bg-slate-900 border border-slate-700/50" />
          <Skeleton className="h-10 w-20 rounded-xl bg-slate-900 border border-slate-700/50" />
          <Skeleton className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-700/50" />
        </div>
      </div>

      {/* 3. 7 KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 lg:gap-4 w-full">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-white/10 bg-[#121426]/70 flex flex-col justify-between h-36 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded-xl bg-slate-800" />
              <Skeleton className="h-4 w-12 rounded bg-slate-800/60" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg bg-slate-800" />
            <Skeleton className="h-8 w-full rounded-lg bg-slate-800/50" />
          </div>
        ))}
      </div>
    </div>
  )
}
