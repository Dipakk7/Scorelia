import React from 'react'
import { Card } from '@/components/ui/Card'
import {
  FileText,
  Briefcase,
  Code,
  FolderGit2,
  GraduationCap,
  Award,
  Globe,
  Trophy,
  BookOpen,
  UserCheck,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SectionAnalysisData } from '@/lib/mock-section-analysis'

interface SectionNavPanelProps {
  sections: SectionAnalysisData[]
  activeSectionId: string
  onSelectSection: (id: string) => void
}

const getSectionIcon = (id: string) => {
  switch (id) {
    case 'professional-summary':
      return FileText
    case 'work-experience':
      return Briefcase
    case 'skills':
      return Code
    case 'projects':
      return FolderGit2
    case 'education':
      return GraduationCap
    case 'certifications':
      return Award
    case 'languages':
      return Globe
    case 'achievements':
      return Trophy
    case 'custom-sections':
      return BookOpen
    case 'references':
    default:
      return UserCheck
  }
}

export const SectionNavPanel: React.FC<SectionNavPanelProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
}) => {
  const completedCount = sections.filter((s) => s.score >= 80).length

  return (
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-4 sm:p-5 rounded-2xl flex flex-col gap-4 backdrop-blur-md shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div>
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Section Navigator
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            {completedCount} of {sections.length} Sections Optimized
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {Math.round((completedCount / sections.length) * 100)}% Complete
        </span>
      </div>

      {/* Nav Items List */}
      <nav aria-label="Resume Sections Navigation" className="flex flex-col gap-1.5 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
        {sections.map((section) => {
          const Icon = getSectionIcon(section.id)
          const isActive = activeSectionId === section.id

          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectSection(section.id)
                }
              }}
              className={cn(
                'w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer select-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
                isActive
                  ? 'bg-purple-600/20 text-white font-extrabold border border-purple-500/50 shadow-md shadow-purple-950/40 scale-[1.01]'
                  : 'text-slate-300 hover:bg-slate-900/80 hover:text-white hover:border-slate-700/80 border border-transparent hover:translate-x-0.5'
              )}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                <span className="truncate">{section.sectionName}</span>
              </div>

              <span
                className={cn(
                  'text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full shrink-0 border transition-colors',
                  section.score >= 90
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : section.score >= 80
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                )}
              >
                {section.score}
              </span>
            </button>
          )
        })}
      </nav>
    </Card>
  )
}

export default SectionNavPanel
