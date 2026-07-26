import React from 'react'
import { Bot, CheckCircle2, ShieldCheck, Zap, Database, Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KPICardData {
  id: string
  title: string
  value: string
  subtext?: string
  trend?: string
  trendType?: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconBgClass: string
  iconColorClass: string
  isHighlighted?: boolean
}

export interface AgentKPIContainerProps {
  className?: string
}

export function AgentKPIContainer({ className }: AgentKPIContainerProps) {
  const cards: KPICardData[] = [
    {
      id: 'total-agents',
      title: 'Total Agents',
      value: '8',
      subtext: '2 Active',
      icon: Bot,
      iconBgClass: 'bg-purple-500/10 border-purple-500/20',
      iconColorClass: 'text-purple-400',
    },
    {
      id: 'tasks-completed',
      title: 'Tasks Completed',
      value: '1,248',
      trend: '24% vs last 7 days',
      trendType: 'up',
      icon: CheckCircle2,
      iconBgClass: 'bg-blue-500/10 border-blue-500/20',
      iconColorClass: 'text-blue-400',
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: '96.4%',
      trend: '6.2% vs last 7 days',
      trendType: 'up',
      icon: ShieldCheck,
      iconBgClass: 'bg-emerald-500/10 border-emerald-500/20',
      iconColorClass: 'text-emerald-400',
      isHighlighted: true,
    },
    {
      id: 'avg-response-time',
      title: 'Avg. Response Time',
      value: '1.32s',
      trend: '18% vs last 7 days',
      trendType: 'down',
      icon: Zap,
      iconBgClass: 'bg-amber-500/10 border-amber-500/20',
      iconColorClass: 'text-amber-400',
    },
    {
      id: 'credits-used',
      title: 'Credits Used',
      value: '2,450',
      subtext: '78% of 5,000 monthly limit',
      icon: Database,
      iconBgClass: 'bg-indigo-500/10 border-indigo-500/20',
      iconColorClass: 'text-indigo-400',
    },
    {
      id: 'active-today',
      title: 'Active Today',
      value: '3',
      trend: '1 vs yesterday',
      trendType: 'up',
      icon: Activity,
      iconBgClass: 'bg-teal-500/10 border-teal-500/20',
      iconColorClass: 'text-teal-400',
    },
  ]

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-left', className)}>
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            className={cn(
              'p-4 rounded-2xl bg-[#111322] border transition-all duration-200 flex flex-col justify-between space-y-3 shadow-lg',
              card.isHighlighted
                ? 'border-emerald-500/50 ring-1 ring-emerald-500/20 bg-gradient-to-b from-[#111322] to-emerald-950/20'
                : 'border-white/10 hover:border-white/20'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <span className="text-2xl font-black text-white tracking-tight mt-1">
                  {card.value}
                </span>
              </div>
              <div className={cn('p-2.5 rounded-xl border shrink-0', card.iconBgClass)}>
                <Icon size={18} className={card.iconColorClass} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-medium min-h-[18px]">
              {card.trend && (
                <span
                  className={cn(
                    'flex items-center gap-1 font-semibold',
                    card.trendType === 'up'
                      ? 'text-emerald-400'
                      : card.trendType === 'down'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  )}
                >
                  {card.trendType === 'up' ? (
                    <TrendingUp size={12} className="stroke-[2.5]" />
                  ) : card.trendType === 'down' ? (
                    <TrendingDown size={12} className="stroke-[2.5]" />
                  ) : null}
                  <span>{card.trend}</span>
                </span>
              )}
              {card.subtext && <span className="text-slate-400 truncate">{card.subtext}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AgentKPIContainer
