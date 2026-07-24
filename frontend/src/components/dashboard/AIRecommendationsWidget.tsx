import React from 'react'

export interface RecommendationItem {
  title: string
  subtitle?: string
  priority: 'High' | 'Medium' | 'Low'
  impact: string
  time: string
  color: string
}

const DEFAULT_RECOMMENDATIONS: RecommendationItem[] = [
  {
    title: 'Learn LangGraph',
    subtitle: 'High impact',
    priority: 'High',
    impact: '+5% ATS',
    time: '2h',
    color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
  },
  {
    title: 'Improve SQL Skills',
    subtitle: 'Recommended',
    priority: 'Medium',
    impact: '+4% ATS',
    time: '3h',
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
  },
  {
    title: 'Build ML Project',
    subtitle: 'Strongly recommended',
    priority: 'High',
    impact: '+8% Profile',
    time: '4h',
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
  },
  {
    title: 'Apply to Top Jobs',
    subtitle: 'Great match',
    priority: 'High',
    impact: '92% Match',
    time: '5m',
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
  },
]

interface AIRecommendationsWidgetProps {
  items?: RecommendationItem[]
  onViewAll?: () => void
}

export const AIRecommendationsWidget: React.FC<AIRecommendationsWidgetProps> = React.memo(({
  items = DEFAULT_RECOMMENDATIONS,
  onViewAll,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/90 border border-white/10 backdrop-blur-md space-y-3.5 shadow-xl select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight">AI Recommendations</h3>
        <button
          onClick={onViewAll}
          className="text-[10px] font-mono text-purple-400 hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-1.5 rounded-lg border shrink-0 ${item.color}`}>
                <span className="h-2 w-2 rounded-full bg-current block" />
              </div>
              <div className="min-w-0 truncate">
                <span className="font-semibold text-slate-200 block truncate leading-tight">{item.title}</span>
                <span className="text-[10px] text-slate-500 font-mono block leading-tight">{item.subtitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono">
              <span className="text-slate-400">{item.time}</span>
              <span className={`px-2 py-0.5 rounded-md font-bold border ${item.color}`}>
                {item.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
export default AIRecommendationsWidget
