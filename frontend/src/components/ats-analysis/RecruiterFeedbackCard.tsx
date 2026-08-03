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
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg space-y-3.5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">
              Recruiter & Hiring Manager Perspective
            </h3>
            <p className="text-xs text-slate-400">
              Simulated feedback based on senior engineering recruiter screening patterns.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <Award className="w-3.5 h-3.5" />
          {safeData?.verdict ?? 'Strong Candidate'}
        </span>
      </div>

      {/* Main Grid: First Impression & Interview Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Strengths & Weaknesses */}
        <div className="md:col-span-8 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-mono text-purple-400 uppercase font-bold">First Impression</span>
            <div className="text-sm font-bold text-white tracking-tight">{safeData?.firstImpression ?? ''}</div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Key Strengths:
            </div>
            <ul className="space-y-1 text-slate-300 pl-5 list-disc">
              {strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Gaps & Areas for Improvement:
            </div>
            <ul className="space-y-1 text-slate-300 pl-5 list-disc">
              {weaknesses.map((weak, idx) => (
                <li key={idx}>{weak}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Recruiter Notes & Readiness Gauge */}
        <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              Recruiter Evaluation Notes
            </span>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              &quot;{safeData?.recruiterNotes ?? ''}&quot;
            </p>
          </div>

          <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Interview Readiness</span>
              <span className="text-emerald-400 font-bold">{safeData?.interviewReadiness ?? 90}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                style={{ width: `${safeData?.interviewReadiness ?? 90}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
