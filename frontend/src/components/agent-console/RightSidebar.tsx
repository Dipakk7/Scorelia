import React from 'react'
import { InsightsActivityWorkspace } from './InsightsActivityWorkspace'
import { cn } from '@/lib/utils'

export interface RightSidebarProps {
  className?: string
}

export function RightSidebar({ className }: RightSidebarProps) {
  return (
    <aside aria-label="Agent Console Sidebar" className={cn('space-y-6 text-left', className)}>
      <InsightsActivityWorkspace />
    </aside>
  )
}

export default RightSidebar
