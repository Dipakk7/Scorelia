import React from 'react'
import { cn } from '@/lib/utils'

export interface AdministrationSkeletonProps {
  className?: string
}

export function AdministrationSkeleton({ className }: AdministrationSkeletonProps) {
  return (
    <div className={cn('space-y-6 animate-pulse text-left', className)} role="status" aria-label="Loading administration workspace">
      {/* Header & Tabs Skeleton */}
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <div className="h-6 w-64 bg-slate-800 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 w-32 bg-slate-800 rounded-xl" />
          <div className="h-8 w-32 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-12 w-full bg-[#111322] border border-white/10 rounded-2xl" />

      {/* Table Skeleton */}
      <div className="p-6 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
        <div className="h-6 w-full bg-slate-800 rounded-lg" />
        <div className="h-6 w-full bg-slate-800/80 rounded-lg" />
        <div className="h-6 w-full bg-slate-800/60 rounded-lg" />
        <div className="h-6 w-full bg-slate-800/40 rounded-lg" />
      </div>
    </div>
  )
}

export default AdministrationSkeleton
