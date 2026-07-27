import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { GitHubKPIGrid } from './GitHubKPIGrid'
import { GitHubWorkspace } from './GitHubWorkspace'
import { GitHubSidebar } from './GitHubSidebar'
import { GitHubBottomStatusBar } from './GitHubBottomStatusBar'

export const GitHubSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full text-left">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-48 rounded" />
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

      {/* KPI Grid Skeleton */}
      <GitHubKPIGrid isLoading={true} />

      {/* Navigation Tabs Skeleton */}
      <div className="flex gap-4 border-b border-[var(--border)] pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg shrink-0" />
        ))}
      </div>

      {/* Executive Layout: Workspace + Sidebar Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <GitHubWorkspace isLoading={true} />
        </div>
        <div className="lg:col-span-3">
          <GitHubSidebar isLoading={true} />
        </div>
      </div>

      {/* Bottom Status Bar Skeleton */}
      <GitHubBottomStatusBar isLoading={true} />
    </div>
  )
}
