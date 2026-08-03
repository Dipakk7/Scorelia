import React from 'react'
import { Sparkles, Download, ArrowRight, CheckCircle2, ChevronDown, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@/components/ui/Dropdown'

export type TabType =
  | 'overview'
  | 'content-analysis'
  | 'keyword-analysis'
  | 'competitor-benchmark'
  | 'score-history'
  | 'detailed-report'

interface ResumeIntelligenceHeaderProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  selectedResumeTitle?: string
  resumesList?: Array<{ id: string; title: string }>
  onSelectResume?: (id: string) => void
  lastAnalyzedText?: string
  isReanalyzing?: boolean
  onReanalyze?: () => void
  onDownloadReport?: () => void
}

export const ResumeIntelligenceHeader: React.FC<ResumeIntelligenceHeaderProps> = ({
  activeTab = 'overview',
  onTabChange,
  selectedResumeTitle = 'Senior AI Engineer Resume.pdf',
  resumesList = [],
  onSelectResume,
  lastAnalyzedText = 'Last analyzed: 2 min ago',
  isReanalyzing = false,
  onReanalyze,
  onDownloadReport,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const currentTab = activeTab || 'overview'
  const currentTitle = selectedResumeTitle || 'Senior AI Engineer Resume.pdf'
  const safeResumesList = Array.isArray(resumesList) ? resumesList : []

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'content-analysis', label: 'Content Analysis' },
    { id: 'keyword-analysis', label: 'Keyword Analysis' },
    { id: 'competitor-benchmark', label: 'Competitor Benchmark' },
    { id: 'score-history', label: 'Score History' },
    { id: 'detailed-report', label: 'Detailed Report' },
  ]

  return (
    <header aria-label="Resume Intelligence Header" className="flex flex-col gap-5 mb-6">
      {/* Top Actions Bar Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 transition-all duration-200">
        {/* Left Title Block */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Resume Intelligence
            </h1>

            {/* Portal-Mounted Floating Resume Dropdown Selector */}
            {safeResumesList.length > 0 && (
              <Dropdown open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-100 hover:bg-slate-800 hover:border-purple-500/40 shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    aria-label={`Selected Resume: ${currentTitle}. Click to change resume.`}
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="max-w-[140px] truncate font-bold text-white">{currentTitle}</span>
                    <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200', isDropdownOpen && 'rotate-180')} />
                  </button>
                </DropdownTrigger>

                <DropdownContent
                  align="start"
                  sideOffset={8}
                  className="w-72 sm:w-80 bg-[#0f111a] border border-slate-800/90 shadow-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl p-3 sm:p-4 flex flex-col gap-2 z-[9999] opacity-100"
                >
                  <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-800/80 mb-0.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Select Target Resume
                    </span>
                    <span className="text-[10px] font-mono font-medium text-slate-500">
                      {safeResumesList.length} Available
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-0.5">
                    {safeResumesList.map((r) => (
                      <DropdownItem
                        key={r.id}
                        title={r.title}
                        onSelect={() => {
                          onSelectResume?.(r.id)
                          setIsDropdownOpen(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2.5 min-h-[46px] rounded-xl text-xs transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer focus:outline-none',
                          currentTitle === r.title
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold shadow-xs'
                            : 'text-slate-200 hover:bg-slate-800/70 hover:text-white border border-transparent font-medium'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText
                            className={cn(
                              'w-4 h-4 shrink-0',
                              currentTitle === r.title ? 'text-purple-400' : 'text-slate-500'
                            )}
                          />
                          <span className="truncate max-w-[190px] sm:max-w-[210px] font-semibold">{r.title}</span>
                        </div>
                        {currentTitle === r.title && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                        )}
                      </DropdownItem>
                    ))}
                  </div>
                </DropdownContent>
              </Dropdown>
            )}
          </div>

          <p className="text-xs md:text-sm text-slate-300 mt-1.5 font-medium">
            Deep analysis of your resume to help you stand out
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-2 font-mono hidden sm:inline-block">
            {lastAnalyzedText}
          </span>

          <Button
            variant="outline"
            onClick={onReanalyze}
            disabled={isReanalyzing}
            className={cn(
              'bg-[#18152e]/90 border border-purple-500/30 text-white text-xs md:text-sm font-bold rounded-xl px-4 py-2.5 min-h-[44px] gap-2 shadow-xs shadow-purple-950/30 backdrop-blur-sm transition-all duration-200 cursor-pointer select-none',
              'bg-gradient-to-r from-purple-950/40 via-[#18152e] to-purple-950/40',
              'hover:bg-[#201c3d] hover:border-purple-500/50 hover:shadow-md hover:shadow-purple-500/15 hover:text-white hover:-translate-y-[1px]',
              'active:bg-[#18152e] active:border-purple-500/60 active:scale-[0.98] active:translate-y-0',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]'
            )}
          >
            {isReanalyzing ? (
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 filter drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
            )}
            <span className="text-white font-bold">{isReanalyzing ? 'Re-analyzing...' : 'Re-analyze Resume'}</span>
          </Button>

          <Button
            onClick={onDownloadReport}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] text-white text-xs md:text-sm font-semibold rounded-xl px-4 py-2.5 min-h-[44px] gap-2 shadow-lg shadow-purple-950/50 transition-all cursor-pointer border-0 focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Download className="w-4 h-4" />
            <span>Download Intelligence Report</span>
          </Button>
        </div>
      </div>

      {/* Primary Module Navigation Tabs */}
      <nav
        aria-label="Resume Intelligence Views"
        className="flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar border-b border-slate-800/80 pb-px"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-4 py-3 min-h-[44px] text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer relative border-b-2 -mb-px flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                isActive
                  ? 'text-white border-purple-500 bg-purple-500/10 rounded-t-xl'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40 rounded-t-xl'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}

export default ResumeIntelligenceHeader
