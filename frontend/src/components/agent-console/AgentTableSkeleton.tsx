import React from 'react'
import { cn } from '@/lib/utils'

export interface AgentTableSkeletonProps {
  className?: string
}

export function AgentTableSkeleton({ className }: AgentTableSkeletonProps) {
  return (
    <div className={cn('space-y-4 animate-pulse text-left', className)} role="status" aria-label="Loading workspace">
      {/* Header & Toolbar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#111322] border border-white/5">
        <div className="h-6 w-48 bg-slate-800 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 w-44 bg-slate-800 rounded-xl" />
          <div className="h-8 w-28 bg-slate-800 rounded-xl" />
          <div className="h-8 w-28 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-[#111322] p-4 space-y-3">
        <div className="h-8 w-full bg-slate-800/80 rounded-lg" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-slate-800 rounded-xl shrink-0" />
              <div className="space-y-1">
                <div className="h-3 w-32 bg-slate-700 rounded" />
                <div className="h-2 w-48 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-5 w-16 bg-slate-800 rounded-full" />
            <div className="h-3 w-12 bg-slate-800 rounded" />
            <div className="h-3 w-24 bg-slate-800 rounded" />
            <div className="h-3 w-12 bg-slate-800 rounded" />
            <div className="h-3 w-12 bg-slate-800 rounded" />
            <div className="h-6 w-6 bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AgentTableSkeleton
