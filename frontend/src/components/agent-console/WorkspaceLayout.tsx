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
  const isFullWidthTab = activeTab === 'reports' || activeTab === 'analytics' || activeTab === 'settings'
  const isAgentsTab = activeTab === 'agents'

  return (
    <div className={cn('space-y-6 text-left font-sans', className)}>
      {isFullWidthTab ? (
        /* Full Width 12-Column Layout for Reports & Settings */
        <main className="w-full">
          <MainWorkspace activeTab={activeTab} />
        </main>
      ) : (
        /* Dynamic 12-Column Responsive Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Content Workspace */}
          <main
            className={cn(
              isAgentsTab
                ? 'lg:col-span-8 xl:col-span-9 space-y-6'
                : 'lg:col-span-7 xl:col-span-8 space-y-6'
            )}
          >
            <MainWorkspace activeTab={activeTab} />
          </main>

          {/* Right Sidebar Column */}
          <div
            className={cn(
              isAgentsTab
                ? 'lg:col-span-4 xl:col-span-3 space-y-6'
                : 'lg:col-span-5 xl:col-span-4 space-y-6'
            )}
          >
            <RightSidebar />
          </div>
        </div>
      )}

      {/* Bottom Metrics Bar */}
      <section aria-label="System Operational Metrics" className="pt-2">
        <BottomMetricsBar />
      </section>
    </div>
  )
}

export default WorkspaceLayout
