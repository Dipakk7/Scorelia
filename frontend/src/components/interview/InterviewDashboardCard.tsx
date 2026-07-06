import { CheckCircle2, Award, ShieldCheck, Smile, Clock, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface InterviewDashboardCardProps {
  stats: {
    total_interviews: number
    average_overall_score: number
    average_technical_score: number
    average_communication_score: number
    average_star_score: number
    average_confidence_score: number
  } | null
  isLoading?: boolean
}

export default function InterviewDashboardCard({ stats, isLoading }: InterviewDashboardCardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border">
              <CardContent className="p-5 space-y-3">
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-6 w-20 bg-slate-350 dark:bg-slate-700 rounded-md" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  const defaultStats = {
    total_interviews: stats?.total_interviews || 0,
    average_overall_score: stats?.average_overall_score || 0,
    average_technical_score: stats?.average_technical_score || 0,
    average_communication_score: stats?.average_communication_score || 0,
    average_star_score: stats?.average_star_score || 0,
    average_confidence_score: stats?.average_confidence_score || 0,
  }

  const cards = [
    {
      title: 'Completions',
      value: defaultStats.total_interviews,
      desc: 'Mock sessions completed',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Overall Score',
      value: `${defaultStats.average_overall_score}%`,
      desc: 'Average across all drills',
      icon: Award,
      color: 'text-brand-500 bg-brand-500/10 border-brand-500/20',
    },
    {
      title: 'STAR Score',
      value: `${defaultStats.average_star_score}%`,
      desc: 'Behavioral response structure',
      icon: ShieldCheck,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Communication',
      value: `${defaultStats.average_communication_score}%`,
      desc: 'Grammar and expression delivery',
      icon: BarChart3,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Technical Core',
      value: `${defaultStats.average_technical_score}%`,
      desc: 'Concept coverage accuracy',
      icon: Clock,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Confidence',
      value: `${defaultStats.average_confidence_score}%`,
      desc: 'Linguistic tone assurance',
      icon: Smile,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((item, idx) => {
        const Icon = item.icon
        return (
          <Card
            key={idx}
            className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-xs transition-all duration-200"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={cn('p-1.5 rounded-lg border shrink-0', item.color)}>
                  <Icon size={12} />
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-bold font-display text-slate-900 dark:text-white block">
                  {item.value}
                </span>
                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-sans block leading-snug">
                  {item.desc}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
