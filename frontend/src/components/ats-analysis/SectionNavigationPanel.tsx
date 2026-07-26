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
    <nav aria-label="Resume Section Navigation" className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          Section-by-Section ATS Analysis Navigation
        </h3>
        <span className="text-xs text-slate-400 font-mono">8 Sections Evaluated</span>
      </div>

      {/* Responsive Horizontal Scrollable Container */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div
          role="tablist"
          aria-label="Resume Section Tabs"
          className="flex items-center gap-2.5 min-w-max p-1"
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
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                onClick={() => onSelectSection(sec.id)}
                className={cn(
                  'relative flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] rounded-xl border text-xs font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none',
                  isSelected
                    ? 'bg-purple-600/30 text-white border-purple-500/60 shadow-md font-semibold'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-purple-500/30 hover:bg-slate-800/60'
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeSectionIndicator"
                    className="absolute inset-0 bg-purple-500/10 rounded-xl border border-purple-400/30 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div
                  className={cn(
                    'p-1.5 rounded-lg shrink-0 relative z-10',
                    isSelected
                      ? 'bg-purple-500/30 text-purple-200'
                      : 'bg-purple-500/10 text-purple-400'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 text-left relative z-10">
                  <div className="font-semibold text-slate-100">{sec.name}</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-purple-300 font-bold">{sec.score}%</span>
                    <span>•</span>
                    <span
                      className={cn(
                        isExcellent
                          ? 'text-emerald-400'
                          : isWarning
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      )}
                    >
                      {sec.status}
                    </span>
                    {sec.issueCount > 0 && (
                      <span className="text-amber-400 bg-amber-500/10 px-1 rounded">
                        {sec.issueCount} issue
                      </span>
                    )}
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
