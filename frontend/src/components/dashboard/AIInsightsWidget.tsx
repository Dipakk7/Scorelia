import React from 'react'
import { Zap, Sparkles, Clock, Target } from 'lucide-react'

export interface AIInsightItem {
  text: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
}

const DEFAULT_INSIGHTS: AIInsightItem[] = [
  {
    text: 'Your resume is stronger than 81% of applicants for AI Engineer roles.',
    icon: Zap,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    text: 'You gained +6 ATS points after adding TensorFlow to your skills.',
    icon: Sparkles,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    text: 'Recruiters spend ~8 sec on resumes. Yours is estimated at 11.4 sec.',
    icon: Clock,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    text: 'You are 78% ready to apply for ML Engineer positions.',
    icon: Target,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
]

interface AIInsightsWidgetProps {
  insights?: AIInsightItem[]
  onViewAll?: () => void
}

export const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = React.memo(({
  insights = DEFAULT_INSIGHTS,
  onViewAll,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/90 border border-white/10 backdrop-blur-md space-y-4 shadow-xl select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight">AI Insights</h3>
        <button
          onClick={onViewAll}
          className="text-[10px] font-mono text-purple-400 hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          View all
        </button>
      </div>

      <div className="space-y-2.5">
        {insights.map((ins, idx) => {
          const Icon = ins.icon
          return (
            <div
              key={idx}
              className="flex gap-3 items-start text-xs p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
            >
              <div className={`p-1.5 rounded-lg border shrink-0 ${ins.color}`}>
                <Icon size={14} />
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">{ins.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
})
export default AIInsightsWidget
