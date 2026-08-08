import React from 'react'
import { MainWorkspace } from './MainWorkspace'
import { RightSidebar } from './RightSidebar'
import { BottomMetricsBar } from './BottomMetricsBar'
import { cn } from '@/lib/utils'

export interface WorkspaceLayoutProps {
  activeTab?: string
  className?: string
}

export function WorkspaceLayout({ activeTab = 'overview', className }: WorkspaceLayoutProps) {
  return (
    <div className={cn('space-y-6 sm:space-y-8 text-left', className)}>
      {/* 12-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Workspace (8 Columns on Desktop, 12 Columns on Tablet/Mobile) */}
        <main className="lg:col-span-8 space-y-6 sm:space-y-8">
          <MainWorkspace activeTab={activeTab} />
        </main>

        {/* Right Sidebar (4 Columns on Desktop, 12 Columns on Tablet/Mobile) */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          <RightSidebar />
        </div>
      </div>

      {/* Bottom Metrics Bar (Full Width across bottom) */}
      <section aria-label="System Operational Metrics" className="pt-2">
        <BottomMetricsBar />
      </section>
    </div>
  )
}

export default WorkspaceLayout
