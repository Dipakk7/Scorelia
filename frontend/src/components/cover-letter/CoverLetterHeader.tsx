import React, { memo, useRef, useEffect } from 'react'
import {
  RefreshCw,
  Download,
  Sparkles,
  CheckCircle2,
  FileText,
  Building,
  Briefcase,
  SlidersHorizontal,
  Edit3,
  Target,
  Award,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type CoverLetterTab = 'setup' | 'editor' | 'optimization' | 'review'

export interface CoverLetterHeaderProps {
  activeTab: CoverLetterTab
  onTabChange: (tab: CoverLetterTab) => void
  onGenerateClick?: () => void
  onExportClick?: () => void
  onRefreshClick?: () => void
  isGenerating?: boolean
  selectedResumeTitle?: string
  companyName?: string
  jobTitle?: string
}

const TABS: { id: CoverLetterTab; label: string; icon: React.ElementType }[] = [
  { id: 'setup', label: '1. Setup & Job', icon: SlidersHorizontal },
  { id: 'editor', label: '2. Writing Studio', icon: Edit3 },
  { id: 'optimization', label: '3. AI Optimization', icon: Target },
  { id: 'review', label: '4. Review & Export', icon: Award },
]

export const CoverLetterHeader: React.FC<CoverLetterHeaderProps> = memo(({
  activeTab,
  onTabChange,
  onGenerateClick,
  onExportClick,
  onRefreshClick,
  isGenerating = false,
  selectedResumeTitle = 'Dipak_Khandagale_AI_Engineer.pdf',
  companyName = 'Google',
  jobTitle = 'Senior AI Engineer',
}) => {
  const activeTabRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeTab])

  return (
    <header className="flex flex-col gap-4 mb-4 text-left">
      {/* Top Title & Actions Hero Section matching ATS Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 transition-all duration-200">
        {/* Left Title & Integrated Target Context Pills */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs m-0">
              Cover Letter Generator
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Status: Generating...' : 'Status: Ready'}</span>
            </span>
          </div>

          {/* Target Metadata Context Pills */}
          <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
            <span className="font-semibold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate max-w-[180px]">{selectedResumeTitle}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-semibold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{companyName}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-semibold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{jobTitle}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons (Single Entry Point) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          {/* Refresh / Reset Action */}
          <button
            type="button"
            onClick={onRefreshClick}
            disabled={isGenerating}
            aria-label="Refresh cover letter draft"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={cn('w-4 h-4 text-slate-400', isGenerating && 'animate-spin text-purple-400')} />
            <span>Reset Draft</span>
          </button>

          {/* Export Action */}
          <button
            type="button"
            onClick={onExportClick}
            aria-label="Export Cover Letter Document"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export Document</span>
          </button>

          {/* Primary CTA: Generate */}
          <button
            type="button"
            onClick={onGenerateClick}
            disabled={isGenerating}
            aria-label="Generate AI Cover Letter"
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer disabled:opacity-60"
          >
            <Sparkles className={cn('w-4 h-4 text-purple-200', isGenerating && 'animate-pulse')} />
            <span>{isGenerating ? 'Generating...' : 'Generate Cover Letter'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sticky Workspace Tabs Bar matching ATS Analysis */}
      <div className="sticky top-2 z-30 backdrop-blur-md bg-slate-950/85 border border-slate-800/80 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none">
        <nav
          role="tablist"
          aria-label="Cover Letter Workspace Sections"
          className="flex items-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800/80 rounded-xl w-max min-w-full sm:min-w-0"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                type="button"
                role="tab"
                id={`cover-tab-${tab.id}`}
                aria-controls={`cover-panel-${tab.id}`}
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
                    layoutId="activeCoverTabIndicator"
                    className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
})

CoverLetterHeader.displayName = 'CoverLetterHeader'

export default CoverLetterHeader
