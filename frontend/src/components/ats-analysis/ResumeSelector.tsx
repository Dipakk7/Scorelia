import React, { useState, useCallback, memo } from 'react'
import { FileText, ChevronDown, Check, Clock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ResumeOption {
  id: string
  name: string
  version: string
  lastUpdated: string
  status: 'Not Analyzed' | 'Ready' | 'In Progress'
}

const MOCK_RESUMES: ResumeOption[] = [
  {
    id: 'res-1',
    name: 'Software_Engineer_Resume.pdf',
    version: 'v1.0',
    lastUpdated: 'Select a resume to analyze',
    status: 'Not Analyzed',
  },
  {
    id: 'res-2',
    name: 'FullStack_Developer_Resume.pdf',
    version: 'v2.1',
    lastUpdated: 'Updated 3 days ago',
    status: 'Ready',
  },
  {
    id: 'res-3',
    name: 'Data_Scientist_Resume.pdf',
    version: 'v1.2',
    lastUpdated: 'Updated 1 week ago',
    status: 'Not Analyzed',
  },
]

interface ResumeSelectorProps {
  selectedId?: string
  onSelectResume?: (resume: ResumeOption) => void
}

export const ResumeSelector: React.FC<ResumeSelectorProps> = memo(({
  selectedId = 'res-1',
  onSelectResume,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState<ResumeOption>(
    MOCK_RESUMES.find((r) => r.id === selectedId) || MOCK_RESUMES[0]
  )

  const currentResume = selectedResume || MOCK_RESUMES.find((r) => r.id === selectedId) || MOCK_RESUMES[0]

  const handleSelect = useCallback((resume: ResumeOption) => {
    setSelectedResume(resume)
    setIsOpen(false)
    if (onSelectResume) {
      onSelectResume(resume)
    }
  }, [onSelectResume])

  const subtitleText =
    currentResume?.lastUpdated && currentResume.lastUpdated !== 'Select a resume to analyze'
      ? `Last updated: ${currentResume.lastUpdated}`
      : 'Resume ready for ATS analysis • Choose a resume to begin AI-powered compatibility scoring'

  return (
    <section aria-label="Resume Selector" className="mb-6">
      <div className="group relative overflow-hidden rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-6 shadow-xl shadow-purple-950/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/25 hover:border-purple-500/30 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-purple-400/30 before:to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Active Resume Details */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-purple-500/5 border border-purple-500/30 text-purple-300 shadow-md shadow-purple-950/40 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-purple-200" />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Target Resume Badge */}
                <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs">
                  Target Resume
                </span>

                {/* Version Badge */}
                <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-mono font-bold text-slate-300 bg-slate-800/80 border border-slate-700/60">
                  {currentResume?.version ?? 'v1.0'}
                </span>

                {/* Status Badge */}
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-bold border shadow-xs',
                    currentResume?.status === 'Ready'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : currentResume?.status === 'In Progress'
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      currentResume?.status === 'Ready'
                        ? 'bg-emerald-400'
                        : currentResume?.status === 'In Progress'
                        ? 'bg-purple-400 animate-ping'
                        : 'bg-amber-400 animate-pulse'
                    )}
                  />
                  <span>{currentResume?.status ?? 'Not Analyzed'}</span>
                </span>
              </div>

              {/* Resume Title */}
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight font-sans break-all drop-shadow-xs">
                {currentResume?.name ?? 'Software_Engineer_Resume.pdf'}
              </h2>

              {/* Subtitle / Timestamp */}
              <p className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-purple-400/80 shrink-0" />
                <span className="truncate">{subtitleText}</span>
              </p>
            </div>
          </div>

          {/* Selector Dropdown Trigger */}
          <div className="relative w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              className="flex items-center justify-between gap-3 w-full md:w-72 px-4 py-2.5 min-h-[44px] bg-[#16182c]/90 hover:bg-[#1c1f38] border border-white/10 hover:border-purple-500/40 rounded-xl text-xs font-bold text-slate-100 shadow-md shadow-purple-950/20 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
            >
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-purple-400 shrink-0 filter drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]" />
                <span className="truncate font-bold text-white text-xs">{currentResume?.name ?? 'Software_Engineer_Resume.pdf'}</span>
              </div>
              <ChevronDown
                className={cn('w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0', isOpen && 'rotate-180')}
              />
            </button>

            {/* Dropdown Menu Overlay */}
            {isOpen && (
              <div
                role="listbox"
                aria-label="Available Resumes"
                className="absolute right-0 mt-2 w-full md:w-80 bg-[#0f111a] border border-slate-800/90 rounded-2xl shadow-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-40 overflow-hidden divide-y divide-slate-800/60 animate-in fade-in zoom-in-95 duration-150 p-1.5"
              >
                <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Select Target Resume</span>
                  <span className="text-slate-500 font-mono">{MOCK_RESUMES.length} Available</span>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 pt-1">
                  {MOCK_RESUMES.map((resume) => {
                    const isSelected = resume.id === selectedResume.id
                    return (
                      <button
                        key={resume.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(resume)}
                        className={cn(
                          'flex items-center justify-between w-full px-3.5 py-2.5 min-h-[44px] text-left text-xs rounded-xl transition-all duration-150 cursor-pointer',
                          isSelected
                            ? 'bg-purple-500/20 text-white font-extrabold border border-purple-500/40 shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        )}
                      >
                        <div className="space-y-0.5 truncate pr-2">
                          <div className="font-bold text-xs truncate text-white">{resume.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span className="font-mono text-slate-400">{resume.version}</span>
                            <span>•</span>
                            <span className={cn(resume.status === 'Ready' ? 'text-emerald-400' : 'text-amber-400')}>
                              {resume.status}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

ResumeSelector.displayName = 'ResumeSelector'
