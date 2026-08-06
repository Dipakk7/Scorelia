import React from 'react'
import { Sparkles, Target, ShieldCheck, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react'

export const PersonalizationInsightsCardComponent: React.FC = () => {
  const readinessMetrics = [
    {
      label: 'Job Description Completeness',
      value: '1,240 chars',
      status: 'Optimal Details',
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      label: 'Company Alignment Score',
      value: '94%',
      status: 'High Match',
      colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      label: 'Skill Keywords Detected',
      value: '12 Extracted',
      status: 'High Coverage',
      colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: <Target className="w-3.5 h-3.5 text-indigo-400" />,
    },
    {
      label: 'Tone & Style Harmony',
      value: 'Executive',
      status: 'Aligned',
      colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />,
    },
  ]

  const quickTips = [
    'Specifying the hiring manager name increases recruiter callback rates by 22%.',
    'Executive tone works best for Senior (5+ yrs) leadership positions.',
  ]

  return (
    <div className="rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-br from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-5 shadow-lg shadow-purple-950/10 space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          <h3 className="font-extrabold text-sm text-white tracking-tight m-0">
            Target Readiness & Analysis
          </h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Ready to Generate
        </span>
      </div>

      {/* Metrics List */}
      <div className="space-y-2.5">
        {readinessMetrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1 rounded-md bg-slate-800 shrink-0">{m.icon}</div>
              <div className="min-w-0">
                <span className="block font-bold text-xs text-slate-200 leading-tight truncate">
                  {m.label}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium leading-tight truncate mt-0.5">
                  {m.status}
                </span>
              </div>
            </div>

            <span className={`text-xs font-black px-2 py-0.5 rounded-md border shrink-0 ${m.colorClass}`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actionable Executive Tips */}
      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1.5">
        <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Pro Optimization Tips</span>
        </span>
        <ul className="text-[11px] text-slate-300 space-y-1 pl-4 m-0 list-disc font-medium leading-relaxed">
          {quickTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const PersonalizationInsightsCard = React.memo(PersonalizationInsightsCardComponent)
export default PersonalizationInsightsCard
