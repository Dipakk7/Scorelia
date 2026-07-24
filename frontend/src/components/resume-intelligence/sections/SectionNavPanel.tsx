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
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-4 rounded-2xl flex flex-col gap-3 backdrop-blur-md shadow-lg sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Section Navigator
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {completedCount}/{sections.length} Sections Optimized
          </p>
        </div>

        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
          <CheckCircle2 className="w-3 h-3" />
          {Math.round((completedCount / sections.length) * 100)}% Complete
        </span>
      </div>

      {/* Nav Items List */}
      <nav aria-label="Resume Sections Navigation" className="flex flex-col gap-1 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
        {sections.map((section) => {
          const Icon = getSectionIcon(section.id)
          const isActive = activeSectionId === section.id

          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500',
                isActive
                  ? 'bg-purple-600/20 text-white font-bold border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
              )}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={cn(
                    'w-3.5 h-3.5 shrink-0',
                    isActive ? 'text-purple-400' : 'text-slate-500'
                  )}
                />
                <span className="truncate">{section.sectionName}</span>
              </div>

              <span
                className={cn(
                  'text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shrink-0 border',
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
