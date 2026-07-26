import React from 'react'
import PlaceholderCard from './PlaceholderCard'
import { Award, CheckCircle2, AlertCircle } from 'lucide-react'
import { mockScoreBreakdown } from '@/lib/cover-letter-mock-data'

export const CoverLetterScoreCardComponent: React.FC = () => {
  const {
    overallScore,
    readability,
    professionalTone,
    atsCompatibility,
    grammar,
    structure,
    keywordsMatch,
    benchmarkText,
  } = mockScoreBreakdown

  const metrics = [
    { label: 'ATS Compatibility', score: atsCompatibility, color: 'bg-emerald-500' },
    { label: 'Professional Tone', score: professionalTone, color: 'bg-purple-500' },
    { label: 'Readability', score: readability, color: 'bg-blue-500' },
    { label: 'Grammar & Mechanics', score: grammar, color: 'bg-teal-500' },
    { label: 'Structure & Flow', score: structure, color: 'bg-indigo-500' },
    { label: 'Keyword Matching', score: keywordsMatch, color: 'bg-amber-500' },
  ]

  return (
    <PlaceholderCard
      title={
        <div className="flex items-center gap-2">
          <Award size={16} className="text-purple-400" />
          <span className="font-extrabold text-sm text-[var(--heading)]">Cover Letter Score</span>
        </div>
      }
      badge={
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Strong Match
        </span>
      }
    >
      <div className="space-y-4 text-left">
        {/* Main Gauge Ring */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-lg shadow-md">
              <span>{overallScore}</span>
              <span className="absolute -bottom-1 text-[9px] font-extrabold bg-slate-900 px-1.5 py-0.2 rounded-full border border-slate-700">
                /100
              </span>
            </div>

            <div>
              <span className="block font-extrabold text-xs text-[var(--heading)]">
                Excellent Match
              </span>
              <span className="block text-[11px] text-[var(--muted)] font-medium">
                {benchmarkText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Ready</span>
          </div>
        </div>

        {/* 6 Sub-Metric Progress Bars */}
        <div className="space-y-2.5 pt-1">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[var(--muted)]">{m.label}</span>
                <span className="text-[var(--heading)]">{m.score}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--surface-hover)] overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.color}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlaceholderCard>
  )
}

export const CoverLetterScoreCard = React.memo(CoverLetterScoreCardComponent)
export default CoverLetterScoreCard
