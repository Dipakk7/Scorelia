import React from 'react'
import { Briefcase, Award, Clock, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface KPICardItem {
  id: string
  label: string
  value: string
  subtext: string
  icon?: React.ReactNode
  customVisual?: React.ReactNode
  actionable?: boolean
}

export function CareerRoadmapKPICards() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const cards = [
    {
      id: 'target-role',
      label: 'Target Role',
      value: 'AI/ML Engineer',
      subtext: 'Edit Goal →',
      actionable: true,
      icon: (
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
      ),
    },
    {
      id: 'experience-level',
      label: 'Experience Level',
      value: 'Entry Level',
      subtext: '0-2 Years',
      icon: (
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
          <Award className="h-5 w-5" />
        </div>
      ),
    },
    {
      id: 'target-timeline',
      label: 'Target Timeline',
      value: '12 Months',
      subtext: 'Recommended',
      icon: (
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <Clock className="h-5 w-5" />
        </div>
      ),
    },
    {
      id: 'current-progress',
      label: 'Current Progress',
      value: '32%',
      subtext: 'On Track',
      customVisual: (
        <div className="relative h-10 w-10 shrink-0 flex items-center justify-center">
          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
            <path
              className="text-white/10"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-400"
              strokeDasharray="32, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 'estimated-readiness',
      label: 'Estimated Readiness',
      value: '78%',
      subtext: 'In 12 Months',
      icon: (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <TrendingUp className="h-5 w-5" />
        </div>
      ),
    },
  ]

  return (
    <section aria-label="Roadmap Summary Key Metrics" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {cards.map((card) => {
          const isSelected = selectedId === card.id
          return (
            <Card
              key={card.id}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-selected={isSelected}
              onClick={() => setSelectedId(card.id)}
              className={cn(
                'p-4 rounded-2xl bg-[#121320] transition-all duration-200 flex flex-col justify-between cursor-pointer select-none',
                'hover:bg-[#16182c] hover:border-purple-500/40 hover:shadow-md',
                'active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
                isSelected
                  ? 'border border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.3)] scale-[1.01]'
                  : 'border border-white/10 shadow-sm'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 text-left">
                  <span className={cn('text-[11px] font-semibold uppercase tracking-wider block truncate transition-colors', isSelected ? 'text-purple-200 font-bold' : 'text-slate-400')}>
                    {card.label}
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight truncate">
                    {card.value}
                  </div>
                </div>
                {card.customVisual || card.icon}
              </div>

              <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-left">
                {card.actionable ? (
                  <button className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors bg-transparent border-none p-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded">
                    {card.subtext}
                  </button>
                ) : card.id === 'current-progress' ? (
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
                    {card.subtext}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400">
                    {card.subtext}
                  </span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
export default CareerRoadmapKPICards
