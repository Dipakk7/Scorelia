import React from 'react'
import { UserCheck, CheckCircle2, AlertCircle, Award, MessageSquare } from 'lucide-react'
import { mockRecruiterFeedback, type RecruiterFeedbackData } from '@/lib/ats-ai-mock-data'

interface RecruiterFeedbackCardProps {
  data?: RecruiterFeedbackData
}

export const RecruiterFeedbackCard: React.FC<RecruiterFeedbackCardProps> = ({
  data = mockRecruiterFeedback,
}) => {
  const safeData = data || mockRecruiterFeedback
  const strengths = safeData?.strengths ?? []
  const weaknesses = safeData?.weaknesses ?? []

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-3.5 sm:p-4 shadow-xl space-y-3 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
              Recruiter & Hiring Manager Perspective
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Simulated feedback based on senior engineering recruiter screening patterns.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shrink-0 self-start sm:self-auto">
          <Award className="w-3.5 h-3.5" />
          {safeData?.verdict ?? 'Strong Candidate'}
        </span>
      </div>

      {/* Main Grid: First Impression & Interview Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
        {/* Left Column: Strengths & Weaknesses */}
        <div className="md:col-span-8 space-y-3.5 flex flex-col justify-between h-full">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider block">First Impression</span>
            <div className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight leading-snug">{safeData?.firstImpression ?? ''}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 shadow-sm flex-1">
            <div className="font-bold text-xs text-emerald-400 flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Key Strengths:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <span className="flex-1">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 shadow-sm">
            <div className="font-bold text-xs text-amber-400 flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <span>Gaps & Areas for Improvement:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              {weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                  <span className="flex-1">{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Recruiter Notes & Readiness Gauge */}
        <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between space-y-3.5 h-full shadow-inner">
          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-100 tracking-tight">Recruiter Evaluation Notes</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex-1 leading-relaxed text-xs text-slate-300 italic shadow-sm flex items-center">
              &quot;{safeData?.recruiterNotes ?? ''}&quot;
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans font-medium">Interview Readiness</span>
              <span className="text-emerald-400 font-bold font-mono">{safeData?.interviewReadiness ?? 90}%</span>
            </div>
            <div className="h-2 w-full bg-slate-950 border border-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full shadow-sm transition-all duration-500"
                style={{ width: `${safeData?.interviewReadiness ?? 90}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
