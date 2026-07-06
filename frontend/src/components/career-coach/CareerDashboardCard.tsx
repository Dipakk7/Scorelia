import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ProgressTracker } from './ProgressTracker'
import { Badge } from '@/components/ui/Badge'
import { Award, Compass } from 'lucide-react'
import type { RoadmapAnalyticsResponse } from '@/types/roadmap'

interface CareerDashboardCardProps {
  analytics: RoadmapAnalyticsResponse | null
  targetRole: string
  estimatedDuration: number
}

export function CareerDashboardCard({ analytics, targetRole, estimatedDuration }: CareerDashboardCardProps) {
  if (!analytics) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <CardContent className="py-12 text-center text-sm text-slate-500 italic">
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Radial Score Card */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md md:col-span-1">
        <CardHeader className="text-left">
          <CardTitle className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="text-purple-500 h-5 w-5" />
            <span>Career Readiness Score</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Overall AI score based on skills coverage and milestones.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pb-6">
          <div className="relative h-32 w-32 flex items-center justify-center">
            {/* SVG circle loader */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="10"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
                strokeLinecap="round"
                fill="transparent"
                className={`transition-all duration-500 ${getScoreColor(score)}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold font-display text-slate-950 dark:text-white">
                {Math.round(score)}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Readiness</span>
            </div>
          </div>
          
          <div className="mt-4 w-full border-t border-slate-100 dark:border-slate-800 pt-4 text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-2">Readiness Breakdown</h4>
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>ATS Optimization</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.round(readiness?.breakdown?.ats_score ?? 0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Interview Mastery</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.round(readiness?.breakdown?.interview_readiness ?? 0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Skill Coverage</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.round(readiness?.breakdown?.skill_gap ?? 0)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal & Progress Card */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md md:col-span-2 flex flex-col justify-between">
        <CardHeader className="text-left pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="text-brand-500 h-5 w-5" />
                <span>Active Career Goal</span>
              </CardTitle>
              <h3 className="text-lg font-extrabold text-brand-600 dark:text-brand-400 mt-2 mb-1">
                {targetRole}
              </h3>
              <p className="text-xs text-slate-500">
                Learning pathway mapped for {estimatedDuration} months.
              </p>
            </div>
            <Badge variant={completionPercentage >= 100 ? 'success' : 'warning'}>
              {completionPercentage >= 100 ? 'Achieved' : 'In Progress'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50">
            <div>
              <div className="text-xs text-slate-400 font-medium">Milestones Done</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{completedMilestones}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Remaining</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{remainingMilestones}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Skills Verified</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{skillsCompleted}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Skills In Progress</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{skillsInProgress}</div>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-350">
              <span>Overall Roadmap Completion</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <ProgressTracker value={completionPercentage} />
          </div>

          {/* Upcoming milestones snapshot */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-2">Upcoming Milestones</h4>
            {upcomingMilestones.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No upcoming milestones.</p>
            ) : (
              <div className="space-y-2">
                {upcomingMilestones.slice(0, 2).map((ms) => (
                  <div key={ms.id} className="flex items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{ms.title}</span>
                    <Badge variant="secondary" className="shrink-0">{ms.duration || 'Flexible'}</Badge>
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
