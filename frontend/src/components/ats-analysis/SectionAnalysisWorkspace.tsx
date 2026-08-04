import React from 'react'
import { FileText, UserCheck, Cpu } from 'lucide-react'
import { ScoreRing } from '@/components/ui/ScoreRing'
import type { SectionDetailData } from '@/lib/ats-section-mock-data'
import { cn } from '@/lib/utils'

interface SectionAnalysisWorkspaceProps {
  section: SectionDetailData
}

export const SectionAnalysisWorkspace: React.FC<SectionAnalysisWorkspaceProps> = ({
  section,
}) => {
  if (!section) return null
  const isExcellent = (section.score ?? 0) >= 95
  const isWarning = (section.score ?? 0) < 90

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center mt-0.5 sm:mt-0">
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{section.name}</h2>
              <span
                className={cn(
                  'text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-sm shrink-0',
                  isExcellent
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : isWarning
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                )}
              >
                {section.status}
              </span>
            </div>
            <p className="text-xs text-slate-300/90 font-normal leading-relaxed mt-1">{section.summary}</p>
          </div>
        </div>

        {/* Section ATS Score Gauge */}
        <div className="flex items-center gap-3.5 bg-slate-950/80 p-3 sm:p-3.5 rounded-xl border border-slate-800/90 shadow-inner shrink-0 self-start sm:self-auto">
          <ScoreRing
            value={section.score}
            max={100}
            size={68}
            strokeWidth={6}
            color={isExcellent ? '--success' : isWarning ? '--warning' : '--primary'}
            trackColor="--border"
          />
          <div className="space-y-0.5 font-mono">
            <span className="text-xs text-slate-400 font-sans block font-medium">Section ATS Rating</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{section.score}</span>
              <span className="text-xs text-slate-400 font-mono font-medium">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter & ATS Notes Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Recruiter Perspective Notes */}
        <div className="p-4 sm:p-4.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-sm space-y-2.5 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shrink-0 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span>Recruiter Perspective</span>
          </div>
          <p className="text-xs text-slate-300/90 leading-relaxed italic flex-1 pl-0.5">
            &quot;{section.recruiterNotes}&quot;
          </p>
        </div>

        {/* ATS Parser Notes */}
        <div className="p-4 sm:p-4.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-sm space-y-2.5 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span>ATS Parser Simulation Notes</span>
          </div>
          <p className="text-xs text-slate-300/90 leading-relaxed flex-1 pl-0.5">
            {section.atsNotes}
          </p>
        </div>
      </div>
    </div>
  )
}
