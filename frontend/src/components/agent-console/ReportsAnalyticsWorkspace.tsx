import React, { useState } from 'react'
import { PerformanceAnalyticsWorkspace } from './PerformanceAnalyticsWorkspace'
import { ReportsWorkspace } from './ReportsWorkspace'
import { BarChart2, FileText, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReportsAnalyticsWorkspaceProps {
  className?: string
}

export function ReportsAnalyticsWorkspace({ className }: ReportsAnalyticsWorkspaceProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'reports'>('analytics')

  return (
    <div className={cn('space-y-6 text-left font-sans', className)}>
      {/* Sub-Section Navigation Bar */}
      <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-[#111322] border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('analytics')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
              activeSubTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <TrendingUp size={15} />
            <span>Performance & Telemetry Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('reports')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
              activeSubTab === 'reports'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <FileText size={15} />
            <span>Executive Reports & Export Center</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-purple-300 hidden sm:inline-block pr-2">
          {activeSubTab === 'analytics' ? 'Live Telemetry Active' : 'Report Engine Ready'}
        </span>
      </div>

      {/* Render Selected View */}
      {activeSubTab === 'analytics' ? (
        <PerformanceAnalyticsWorkspace />
      ) : (
        <ReportsWorkspace />
      )}
    </div>
  )
}

export default ReportsAnalyticsWorkspace
