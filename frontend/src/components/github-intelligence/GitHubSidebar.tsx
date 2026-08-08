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
      <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 w-full', className)}>
        <Skeleton className="h-48 rounded-2xl w-full" />
        <Skeleton className="h-48 rounded-2xl w-full" />
        <Skeleton className="h-36 rounded-2xl w-full" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 text-left font-sans w-full', className)}>
      <AIInsightsWorkspace isLoading={isLoading} />
    </div>
  )
}
