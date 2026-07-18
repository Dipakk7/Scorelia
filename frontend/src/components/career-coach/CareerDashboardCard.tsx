import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ProgressTracker } from './ProgressTracker'
import { Badge } from '@/components/ui/Badge'
import { StatisticCard } from '@/components/ui/StatisticCard'
import { Award, Compass, CheckCircle2, Circle, GraduationCap, Flame } from 'lucide-react'
import type { RoadmapAnalyticsResponse } from '@/types/roadmap'

interface CareerDashboardCardProps {
  analytics: RoadmapAnalyticsResponse | null
  targetRole: string
  estimatedDuration: number
}

export function CareerDashboardCard({ analytics, targetRole, estimatedDuration }: CareerDashboardCardProps) {
  if (!analytics) {
    return (
      <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 text-left font-sans text-xs">
        <CardContent className="py-12 text-center text-sm text-muted-foreground italic font-medium leading-relaxed">
          No analytics data available.
          Generate or select a roadmap to get started.
        </CardContent>
      </Card>
    )
  }

  const { metrics, readiness, skills, timeline } = analytics
  const score = readiness?.overall_score ?? metrics?.current_readiness_score ?? 0
  const completionPercentage = metrics?.overall_progress ?? metrics?.roadmap_completion_percentage ?? 0
  const completedMilestones = timeline?.completed_milestones?.length ?? metrics?.completed_milestones_count ?? 0
  const remainingMilestones = timeline?.upcoming_milestones?.length ?? metrics?.remaining_milestones_count ?? 0
  const skillsCompleted = skills?.skills_completed?.length ?? 0
  const skillsInProgress = skills?.skills_in_progress?.length ?? 0
  const upcomingMilestones = timeline?.upcoming_milestones || []

  // Color selection based on Readiness Score
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-500 stroke-emerald-500'
    if (val >= 50) return 'text-amber-500 stroke-amber-500'
    return 'text-red-500 stroke-red-500'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
      {/* Radial Score Card */}
      <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 md:col-span-1 text-left">
        <CardHeader className="text-left pb-4 border-b border-[var(--border)]/60">
          <CardTitle className="text-sm font-black font-display text-foreground flex items-center gap-2 m-0 leading-none">
            <Award className="text-brand-500 h-5 w-5" />
            <span>Career Readiness Score</span>
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed font-sans max-w-sm m-0 mt-1.5 font-medium">
            Overall AI score based on skills coverage and milestones.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-6 pb-6 text-center">
          <div className="relative h-32 w-32 flex items-center justify-center">
            {/* SVG circle loader */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="8"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800/60"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
                strokeLinecap="round"
                fill="transparent"
                className={`transition-all duration-500 ${getScoreColor(score)}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center select-none font-display">
              <span className="text-3xl font-black font-mono text-slate-950 dark:text-white leading-none">
                {Math.round(score)}
              </span>
              <span className="text-[7px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mt-1.5 leading-none">Readiness</span>
            </div>
          </div>
          
          <div className="mt-4 w-full border-t border-[var(--border)]/60 pt-4 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 leading-none">Readiness Breakdown</h4>
            <div className="space-y-2 text-[10px] text-muted-foreground font-sans">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-muted-foreground uppercase tracking-widest text-[9px]">ATS Optimization</span>
                <span className="font-mono font-black text-foreground">{Math.round(readiness?.breakdown?.ats_score ?? 0)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-muted-foreground uppercase tracking-widest text-[9px]">Interview Mastery</span>
                <span className="font-mono font-black text-foreground">{Math.round(readiness?.breakdown?.interview_readiness ?? 0)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-muted-foreground uppercase tracking-widest text-[9px]">Skill Coverage</span>
                <span className="font-mono font-black text-foreground">{Math.round(readiness?.breakdown?.skill_gap ?? 0)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal & Progress Card */}
      <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 md:col-span-2 flex flex-col justify-between text-left">
        <CardHeader className="text-left pb-4 border-b border-[var(--border)]/60">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 text-left">
              <CardTitle className="text-sm font-black font-display text-foreground flex items-center gap-2 m-0 leading-none">
                <Compass className="text-brand-500 h-5 w-5" />
                <span>Active Career Goal</span>
              </CardTitle>
              <h3 className="text-lg font-black text-foreground mt-3 mb-0.5 leading-none">
                {targetRole}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed font-sans max-w-sm m-0 font-medium">
                Learning pathway mapped for {estimatedDuration} months.
              </p>
            </div>
            <Badge variant="outline" className="bg-brand-500/5 text-brand-650 border border-brand-500/10 text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-[var(--radius-sm)] leading-none shrink-0">
              {completionPercentage >= 100 ? 'Achieved' : 'In Progress'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5 pb-5 text-left">
          {/* StatisticCard Grids */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatisticCard
              title="Milestones Completed"
              value={completedMilestones}
              description="Tasks accomplished"
              icon={CheckCircle2}
              className="border-[var(--border)] p-3.5"
            />
            <StatisticCard
              title="Upcoming Left"
              value={remainingMilestones}
              description="Awaiting completion"
              icon={Circle}
              className="border-[var(--border)] p-3.5"
            />
            <StatisticCard
              title="Skills Verified"
              value={skillsCompleted}
              description="Verified in profile"
              icon={GraduationCap}
              className="border-[var(--border)] p-3.5"
            />
            <StatisticCard
              title="Skills Active"
              value={skillsInProgress}
              description="Acquisitions active"
              icon={Flame}
              className="border-[var(--border)] p-3.5"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-350">
              <span className="font-extrabold text-slate-500 dark:text-slate-450 uppercase tracking-widest text-[9px]">Overall Roadmap Completion</span>
              <span className="font-mono font-black text-foreground">{Math.round(completionPercentage)}%</span>
            </div>
            <ProgressTracker value={completionPercentage} />
          </div>

          {/* Upcoming milestones snapshot */}
          <div className="border-t border-[var(--border)]/60 pt-4 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 leading-none">Upcoming Milestones</h4>
            {upcomingMilestones.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No upcoming milestones.</p>
            ) : (
              <div className="space-y-2">
                {upcomingMilestones.slice(0, 2).map((ms) => (
                  <div key={ms.id} className="flex items-center justify-between gap-3 text-xs bg-[var(--surface-hover)]/30 p-2.5 rounded-[var(--radius-card)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all duration-200">
                    <span className="font-semibold text-slate-800 dark:text-slate-205 truncate text-left">{ms.title}</span>
                    <Badge variant="outline" className="shrink-0 text-[9px] font-bold py-0.5 px-2 bg-[var(--divider)]/50 text-[var(--muted)] rounded-[var(--radius-sm)] border-none leading-none">{ms.duration || 'Flexible'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default CareerDashboardCard
