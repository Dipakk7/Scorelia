import React from 'react'
import { FileText, Award, UserCheck, Cpu, Sparkles, CheckCircle2 } from 'lucide-react'
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
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{section.name}</h2>
              <span
                className={cn(
                  'text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border',
                  isExcellent
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : isWarning
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                )}
              >
                {section.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{section.summary}</p>
          </div>
        </div>

        {/* Section ATS Score Gauge */}
        <div className="flex items-center gap-4 self-start sm:self-auto bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <ScoreRing
            value={section.score}
            max={100}
            size={72}
            strokeWidth={6}
            color={isExcellent ? '--success' : isWarning ? '--warning' : '--primary'}
            trackColor="--border"
          />
          <div className="space-y-0.5 font-mono">
            <span className="text-xs text-slate-400 font-sans block">Section ATS Rating</span>
            <span className="text-xl font-extrabold text-white">{section.score} / 100</span>
          </div>
        </div>
      </div>

      {/* Recruiter & ATS Notes Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Recruiter Perspective Notes */}
        <div className="p-4.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
            <UserCheck className="w-4 h-4 text-purple-400" />
            Recruiter Perspective
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic flex-1">
            &quot;{section.recruiterNotes}&quot;
          </p>
        </div>

        {/* ATS Parser Notes */}
        <div className="p-4.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Cpu className="w-4 h-4 text-emerald-400" />
            ATS Parser Simulation Notes
          </div>
          <p className="text-xs text-slate-300 leading-relaxed flex-1">
            {section.atsNotes}
          </p>
        </div>
      </div>
    </div>
  )
}
