import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { AIInsightsWorkspace } from './AIInsightsWorkspace'
import { cn } from '@/lib/utils'

export interface GitHubSidebarProps {
  isLoading?: boolean
  className?: string
}

export const GitHubSidebar: React.FC<GitHubSidebarProps> = ({ isLoading = false, className }) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6 text-left font-sans', className)}>
      <AIInsightsWorkspace isLoading={isLoading} />
    </div>
  )
}
