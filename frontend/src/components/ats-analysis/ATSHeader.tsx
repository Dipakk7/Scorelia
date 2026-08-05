import React, { memo } from 'react'
import {
  RefreshCw,
  Download,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Search,
  SlidersHorizontal,
  Cpu,
  FileText,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ATSTab =
  | 'overview'
  | 'keyword-match'
  | 'format-check'
  | 'content-optimization'
  | 'ats-simulation'
  | 'detailed-report'

interface ATSHeaderProps {
  activeTab: ATSTab
  onTabChange: (tab: ATSTab) => void
  onRefresh: () => void
  onExportClick?: () => void
  isRefreshing?: boolean
  showTabs?: boolean
  analyzeButtonText?: string
  statusText?: string
  onAnalyzeClick?: () => void
}

const TABS: { id: ATSTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: FileCheck },
  { id: 'keyword-match', label: 'Keyword Match', icon: Search },
  { id: 'format-check', label: 'Format Check', icon: SlidersHorizontal },
  { id: 'content-optimization', label: 'Content Optimization', icon: Sparkles },
  { id: 'ats-simulation', label: 'ATS Simulation', icon: Cpu },
  { id: 'detailed-report', label: 'Detailed Report', icon: FileText },
]

export const ATSHeader: React.FC<ATSHeaderProps> = memo(({
  activeTab,
  onTabChange,
  onRefresh,
  onExportClick,
  isRefreshing = false,
  showTabs = true,
  analyzeButtonText = 'Analyze Resume',
  statusText = 'Status: Ready for Analysis',
  onAnalyzeClick,
}) => {
  const handlePrimaryClick = onAnalyzeClick || onRefresh

  return (
    <header className="flex flex-col gap-6 mb-6">
      {/* Top Title & Actions Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 transition-all duration-200">
        {/* Left Title Block */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              ATS Analysis
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {statusText}
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-300/80 max-w-2xl leading-relaxed mt-1.5">
            Analyze your resume for Applicant Tracking System compatibility and improve your chances of getting shortlisted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh analysis layout"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={cn('w-4 h-4 text-slate-400', isRefreshing && 'animate-spin text-purple-400')} />
            <span>Refresh</span>
          </button>

          {/* Export Report Button */}
          {showTabs && (
            <button
              type="button"
              onClick={onExportClick}
              aria-label="Export ATS analysis report"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Export Report</span>
            </button>
          )}

          {/* Primary CTA: Analyze Resume / Analyze Again */}
          <button
            type="button"
            onClick={handlePrimaryClick}
            disabled={isRefreshing}
            aria-label={analyzeButtonText}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={cn('w-4 h-4 text-purple-200', isRefreshing && 'animate-spin')} />
            <span>{analyzeButtonText}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      {showTabs && (
        <div className="overflow-x-auto pb-1 scrollbar-none">
        <nav
          role="tablist"
          aria-label="ATS Analysis Workspace Sections"
          className="flex items-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800/80 rounded-xl w-max min-w-full sm:min-w-0"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-controls={`panel-${tab.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none z-10',
                  isActive
                    ? 'text-white font-bold bg-purple-600/40 border border-purple-500/50 shadow-md shadow-purple-950/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
                )}
              >
                <Icon className={cn('w-4 h-4 relative z-10 transition-colors duration-200 pointer-events-none', isActive ? 'text-purple-200' : 'text-slate-400')} />
                <span className={cn('relative z-10 transition-colors duration-200 pointer-events-none', isActive ? 'text-white font-bold' : 'text-slate-400')}>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
      )}
    </header>
  )
})

ATSHeader.displayName = 'ATSHeader'
