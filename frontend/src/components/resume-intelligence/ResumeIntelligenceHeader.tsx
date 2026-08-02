import React from 'react'
import { Sparkles, Download, ArrowRight, CheckCircle2, ChevronDown, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-100/80 via-slate-50 to-slate-100/60 border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs backdrop-blur-sm dark:bg-transparent dark:bg-none dark:border-0 dark:p-0 dark:shadow-none transition-all duration-200">
        {/* Left Title Block */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Resume Intelligence
            </h1>

            {/* Resume Dropdown Selector */}
            {safeResumesList.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 hover:text-slate-900 hover:border-slate-300 shadow-xs dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                  aria-label={`Selected Resume: ${currentTitle}. Click to change resume.`}
                >
                  <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="max-w-[140px] truncate font-bold">{currentTitle}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {isDropdownOpen && (
                  <div
                    role="listbox"
                    aria-label="Available Resumes"
                    className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-xl dark:bg-[#0f111a] dark:border-slate-800 dark:shadow-2xl rounded-xl z-50 p-1.5 py-2 flex flex-col gap-1"
                  >
                    <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Select Resume
                    </div>
                    {safeResumesList.map((r) => (
                      <button
                        key={r.id}
                        role="option"
                        aria-selected={currentTitle === r.title}
                        onClick={() => {
                          onSelectResume?.(r.id)
                          setIsDropdownOpen(false)
                        }}
                        className={cn(
                          'w-full text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                          currentTitle === r.title
                            ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200 dark:bg-purple-600/20 dark:text-purple-300 dark:border-0'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                        )}
                      >
                        <span className="truncate">{r.title}</span>
                        {currentTitle === r.title && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
            Deep analysis of your resume to help you stand out
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs text-slate-600 dark:text-slate-400 mr-2 font-mono hidden sm:inline-block">
            {lastAnalyzedText}
          </span>

          <Button
            onClick={onReanalyze}
            disabled={isReanalyzing}
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs md:text-sm font-semibold rounded-xl px-4 py-2.5 min-h-[44px] gap-2 transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            {isReanalyzing ? (
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-purple-400" />
            )}
            <span>{isReanalyzing ? 'Re-analyzing...' : 'Re-analyze Resume'}</span>
          </Button>

          <Button
            onClick={onDownloadReport}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs md:text-sm font-semibold rounded-xl px-4 py-2.5 min-h-[44px] gap-2 shadow-lg shadow-purple-950/50 transition-all cursor-pointer border-0 focus-visible:ring-2 focus-visible:ring-purple-500"
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
