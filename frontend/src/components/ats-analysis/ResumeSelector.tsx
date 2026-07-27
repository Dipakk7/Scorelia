import React, { useState, useCallback, memo } from 'react'
import { FileText, ChevronDown, Check, Clock, AlertCircle } from 'lucide-react'
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

  return (
    <section aria-label="Resume Selector" className="mb-6">
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Active Resume Details */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                  Target Resume
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                  {currentResume?.version ?? 'v1.0'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <AlertCircle className="w-3 h-3" />
                  {currentResume?.status ?? 'Not Analyzed'}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-tight break-all">
                {currentResume?.name ?? 'Software_Engineer_Resume.pdf'}
              </h2>

              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentResume?.lastUpdated ?? 'Select a resume to analyze'}</span>
              </p>
            </div>
          </div>

          {/* Selector Dropdown Trigger */}
          <div className="relative w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              className="flex items-center justify-between md:justify-start gap-3 w-full md:w-64 px-4 py-2.5 min-h-[44px] bg-slate-900/90 hover:bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">{currentResume?.name ?? 'Software_Engineer_Resume.pdf'}</span>
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
                className="absolute right-0 mt-2 w-full md:w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-800/60 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Resume for ATS Scan
                </div>
                <div className="max-h-60 overflow-y-auto">
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
                          'flex items-center justify-between w-full px-3.5 py-3 min-h-[44px] text-left text-xs transition-colors hover:bg-purple-500/10 cursor-pointer',
                          isSelected ? 'bg-purple-500/15 text-purple-300 font-semibold' : 'text-slate-300'
                        )}
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="font-mono text-xs truncate">{resume.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{resume.version}</span>
                            <span>•</span>
                            <span>{resume.status}</span>
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
