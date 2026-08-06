import React from 'react'
import { motion } from 'framer-motion'
import {
  UserCheck,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  ShieldCheck,
  Globe,
} from 'lucide-react'
import { mockSectionsList, type ResumeSectionNavItem } from '@/lib/ats-section-mock-data'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ElementType> = {
  'sec-contact': UserCheck,
  'sec-summary': FileText,
  'sec-experience': Briefcase,
  'sec-education': GraduationCap,
  'sec-projects': FolderGit2,
  'sec-skills': Award,
  'sec-certifications': ShieldCheck,
  'sec-languages': Globe,
}

interface SectionNavigationPanelProps {
  selectedSectionId: string
  onSelectSection: (id: string) => void
}

export const SectionNavigationPanel: React.FC<SectionNavigationPanelProps> = ({
  selectedSectionId,
  onSelectSection,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()

  return (
    <nav aria-label="Resume Section Navigation" className="w-full space-y-2.5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-0.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-sm shrink-0 flex items-center justify-center">
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
              Section-by-Section ATS Analysis Navigation
            </h3>
            <p className="text-xs text-slate-400 font-normal leading-normal mt-0.5">
              Select a section to inspect detailed criteria checks, scores, and AI recommendations.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium text-slate-300 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg shadow-sm self-start sm:self-auto shrink-0">
          8 Sections Evaluated
        </span>
      </div>

      {/* 8 Full-Width Equalized Responsive Section Chips */}
      <div className="w-full">
        <div
          role="tablist"
          aria-label="Resume Section Tabs"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 w-full"
        >
          {mockSectionsList.map((sec) => {
            const isSelected = selectedSectionId === sec.id
            const Icon = ICON_MAP[sec.id] || FileText
            const isExcellent = sec.status === 'Excellent'
            const isWarning = sec.status === 'Warning'

            return (
              <motion.button
                key={sec.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => onSelectSection(sec.id)}
                className={cn(
                  'relative flex items-center gap-2.5 px-3 py-2.5 min-h-[52px] rounded-xl border text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none w-full justify-start group select-none',
                  isSelected
                    ? 'bg-gradient-to-r from-purple-950/70 to-slate-900/90 text-white border-purple-500/60 shadow-md shadow-purple-500/10 font-bold'
                    : 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 text-slate-300 border-slate-800/90 hover:border-purple-500/40 hover:bg-slate-900 hover:shadow-md hover:-translate-y-0.5'
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeSectionIndicator"
                    className="absolute inset-0 bg-purple-500/15 rounded-xl border border-purple-400/40 pointer-events-none shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div
                  className={cn(
                    'p-2 rounded-xl shrink-0 relative z-10 flex items-center justify-center transition-colors shadow-inner',
                    isSelected
                      ? 'bg-purple-500/30 border border-purple-400/40 text-purple-200'
                      : 'bg-purple-500/15 border border-purple-500/25 text-purple-300 group-hover:bg-purple-500/25 group-hover:border-purple-400/30'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 text-left relative z-10 min-w-0 flex-1">
                  <div
                    className={cn(
                      'font-bold truncate text-xs transition-colors',
                      isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    )}
                  >
                    {sec.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-purple-300 font-extrabold">{sec.score}%</span>
                    <span className="text-slate-600 font-sans">•</span>
                    <span
                      className={cn(
                        'font-bold',
                        isExcellent
                          ? 'text-emerald-400'
                          : isWarning
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      )}
                    >
                      {sec.status}
                    </span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
