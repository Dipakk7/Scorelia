import React from 'react'
import {
  Users,
  PieChart,
  Activity,
  FileText,
  TrendingUp,
  LayoutGrid,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import type { AnalyticsTabId } from './AnalyticsTabs'

interface InsightCardsSectionProps {
  onNavigateTab?: (tab: AnalyticsTabId) => void
  className?: string
}

const insightCards: {
  id: AnalyticsTabId
  title: string
  desc: string
  icon: React.ElementType
  iconBg: string
}[] = [
  {
    id: 'user_analytics',
    title: 'User Analytics',
    desc: 'Dive deep into user behavior & demographics',
    icon: Users,
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'feature_usage',
    title: 'Feature Usage',
    desc: 'Track feature adoption & engagement',
    icon: PieChart,
    iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'performance',
    title: 'Performance',
    desc: 'Monitor system health & performance',
    icon: Activity,
    iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  {
    id: 'reports',
    title: 'Reports',
    desc: 'Generate & manage custom reports',
    icon: FileText,
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 'trends',
    title: 'Trends',
    desc: 'Identify patterns & future opportunities',
    icon: TrendingUp,
    iconBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
  {
    id: 'custom_reports',
    title: 'Custom Reports',
    desc: 'Build your own custom dashboards',
    icon: LayoutGrid,
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
]

export function InsightCardsSection({
  onNavigateTab,
  className = '',
}: InsightCardsSectionProps) {
  return (
    <div className={`space-y-3 text-left ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1 font-mono">
          <Sparkles size={12} className="animate-pulse" />
          Deep Analytics Workspaces
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4">
        {insightCards.map((card) => {
          const Icon = card.icon
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigateTab?.(card.id)}
              className="group flex flex-col justify-between p-3.5 rounded-2xl bg-[#0f101c] border border-white/10 hover:border-purple-500/40 hover:bg-[#131424] transition-all duration-200 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`p-2 rounded-xl border flex items-center justify-center ${card.iconBg}`}
                  >
                    <Icon size={16} className="stroke-[2]" />
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors m-0">
                  {card.title}
                </h4>
                <p className="text-[11px] text-slate-400 group-hover:text-slate-300 font-medium mt-1 leading-snug m-0 line-clamp-2">
                  {card.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 flex justify-end border-t border-white/5">
                <div className="p-1 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default InsightCardsSection
