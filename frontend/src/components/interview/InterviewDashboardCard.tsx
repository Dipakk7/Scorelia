import { CheckCircle2, Award, ShieldCheck, Smile, Clock, BarChart3 } from 'lucide-react'
import { StatisticCard } from '@/components/ui/StatisticCard'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 animate-pulse">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800" />
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
      title: 'Mock Interviews',
      value: defaultStats.total_interviews,
      desc: 'Sessions completed',
      icon: CheckCircle2,
    },
    {
      title: 'Average Score',
      value: `${defaultStats.average_overall_score}%`,
      desc: 'Across all rounds',
      icon: Award,
    },
    {
      title: 'STAR Score',
      value: `${defaultStats.average_star_score}%`,
      desc: 'STAR response layout',
      icon: ShieldCheck,
    },
    {
      title: 'Communication',
      value: `${defaultStats.average_communication_score}%`,
      desc: 'Expression delivery rating',
      icon: BarChart3,
    },
    {
      title: 'Technical Score',
      value: `${defaultStats.average_technical_score}%`,
      desc: 'Concept coverage accuracy',
      icon: Clock,
    },
    {
      title: 'Confidence Rate',
      value: `${defaultStats.average_confidence_score}%`,
      desc: 'Linguistic tone assurance',
      icon: Smile,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {cards.map((item, idx) => (
        <StatisticCard
          key={idx}
          title={item.title}
          value={item.value}
          description={item.desc}
          icon={item.icon}
          className="border-slate-205 dark:border-slate-855"
        />
      ))}
    </div>
  )
}
