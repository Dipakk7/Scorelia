import React from 'react'
import { Sparkles, Gauge, Target, BookOpen, ShieldCheck } from 'lucide-react'
import SidebarCard from './SidebarCard'

export const PersonalizationInsightsCardComponent: React.FC = () => {
  const metrics = [
    {
      label: 'Personalization Score',
      value: '94/100',
      description: 'High company alignment',
      icon: <Sparkles size={14} className="text-purple-400" />,
      colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      label: 'Formality Score',
      value: '88/100',
      description: 'Corporate professional',
      icon: <Gauge size={14} className="text-blue-400" />,
      colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      label: 'Keyword Density',
      value: '4.2%',
      description: '12 matched competencies',
      icon: <Target size={14} className="text-emerald-400" />,
      colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      label: 'Readability',
      value: 'Grade 11',
      description: 'Flesch score 68.4',
      icon: <BookOpen size={14} className="text-amber-400" />,
      colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      label: 'Tone Consistency',
      value: '92/100',
      description: 'High tone harmony',
      icon: <ShieldCheck size={14} className="text-teal-400" />,
      colorClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    },
  ]

  return (
    <SidebarCard
      title={
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-purple-400" />
          <span className="font-extrabold text-sm text-[var(--heading)]">Personalization Insights</span>
        </div>
      }
      action={
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Optimal Match
        </span>
      }
    >
      <div className="space-y-3 text-left">
        <div className="grid grid-cols-1 gap-2.5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg border ${m.colorClass} shrink-0`}>
                  {m.icon}
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-[var(--heading)] leading-tight truncate">
                    {m.label}
                  </span>
                  <span className="block text-[11px] text-[var(--muted)] font-medium leading-tight truncate mt-0.5">
                    {m.description}
                  </span>
                </div>
              </div>

              <span className="font-black text-xs text-[var(--heading)] shrink-0">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SidebarCard>
  )
}

export const PersonalizationInsightsCard = React.memo(PersonalizationInsightsCardComponent)
export default PersonalizationInsightsCard
