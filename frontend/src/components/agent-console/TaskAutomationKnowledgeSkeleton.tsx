import React from 'react'
import { cn } from '@/lib/utils'

export interface TaskAutomationKnowledgeSkeletonProps {
  className?: string
}

export function TaskAutomationKnowledgeSkeleton({ className }: TaskAutomationKnowledgeSkeletonProps) {
  return (
    <div className={cn('space-y-6 animate-pulse text-left', className)} role="status" aria-label="Loading section workspace">
      {/* Tabs Skeleton */}
      <div className="flex gap-3 pb-2 border-b border-white/10">
        <div className="h-10 w-36 bg-slate-800 rounded-xl" />
        <div className="h-10 w-36 bg-slate-800 rounded-xl" />
        <div className="h-10 w-44 bg-slate-800 rounded-xl" />
      </div>

      {/* Hero / Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-slate-800 rounded-xl" />
              <div className="h-5 w-20 bg-slate-800 rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-slate-700 rounded" />
            <div className="h-3 w-full bg-slate-800 rounded" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-12 bg-slate-800 rounded-xl" />
              <div className="h-12 bg-slate-800 rounded-xl" />
              <div className="h-12 bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskAutomationKnowledgeSkeleton
