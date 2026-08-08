import React from 'react'
import { InsightsHeader } from './InsightsHeader'
import { AIInsightsPanel } from './AIInsightsPanel'
import { ActivityTimeline } from './ActivityTimeline'
import { cn } from '@/lib/utils'

export interface IntelligenceAuditWorkspaceProps {
  className?: string
}

export function IntelligenceAuditWorkspace({ className }: IntelligenceAuditWorkspaceProps) {
  return (
    <div className={cn('space-y-4 sm:space-y-5 text-left font-sans w-full max-w-full min-w-0', className)}>
      {/* 1. Header Row */}
      <InsightsHeader />

      {/* 2. Primary AI Insights Recommendations & Execution Activity Log */}
      <div className="space-y-5 sm:space-y-6 w-full max-w-full">
        <AIInsightsPanel />
        <ActivityTimeline />
      </div>
    </div>
  )
}

export default IntelligenceAuditWorkspace
