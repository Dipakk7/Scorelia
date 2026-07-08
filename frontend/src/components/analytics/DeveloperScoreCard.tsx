import { RadarAnalytics } from '@/components/analytics/RadarAnalytics'
import { Card } from '@/components/ui/Card'
import { Award, Zap, Code, ShieldCheck, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScoreBreakdown {
  code_quality_score: number
  documentation_score: number
  testing_score: number
  complexity_score: number
  security_score: number
}

interface DeveloperScoreCardProps {
  score: number
  breakdown: ScoreBreakdown
}

export function DeveloperScoreCard({ score, breakdown }: DeveloperScoreCardProps) {
  // Convert breakdown to chart points
  const radarData = [
    { label: 'Code Quality', value: breakdown.code_quality_score },
    { label: 'Documentation', value: breakdown.documentation_score },
    { label: 'Testing Compliance', value: breakdown.testing_score },
    { label: 'Complexity', value: breakdown.complexity_score },
    { label: 'Security Standards', value: breakdown.security_score },
  ]

  // Determine rank based on score
  const getRank = (val: number) => {
    if (val >= 90) return { label: 'Elite Architect', color: 'text-emerald-650 bg-emerald-500/10 border-emerald-500/20' }
    if (val >= 75) return { label: 'Senior Engineer', color: 'text-brand-655 bg-brand-500/10 border-brand-500/20' }
    if (val >= 50) return { label: 'Intermediate Developer', color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' }
    return { label: 'Junior Developer', color: 'text-rose-650 bg-rose-500/10 border-rose-500/20' }
  }

  const rank = getRank(score)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left font-sans text-xs select-none">
      {/* Overall Score Gauge Card */}
      <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs flex flex-col justify-between p-6">
        <div className="space-y-1.5 text-left">
          <span className="text-slate-455 dark:text-slate-500 text-[8px] font-black uppercase font-mono tracking-widest block leading-none">
            Developer Index
          </span>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0 leading-none">
            Overall Developer Score
          </h4>
        </div>

        {/* Circular Gauge Ring */}
        <div className="flex flex-col items-center justify-center my-6 relative select-none">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r="62"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800/40"
              fill="transparent"
            />
            {/* Foreground circle */}
            <circle
              cx="72"
              cy="72"
              r="62"
              stroke="url(#scoreGrad)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - score / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F9D9A" />
                <stop offset="50%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center leading-none">
            <span className="text-4xl font-black font-display tracking-tighter bg-gradient-to-r from-brand-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent leading-none block">
              {score}
            </span>
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mt-1 block">
              / 100
            </span>
          </div>
        </div>

        {/* Rank badge */}
        <div className={cn('mt-2 py-2.5 px-4 rounded-xl border text-center text-[10px] font-black uppercase tracking-wider leading-none select-none', rank.color)}>
          Rank: {rank.label}
        </div>
      </Card>

      {/* Score Breakdown Radar Chart Card */}
      <Card className="lg:col-span-2 border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs p-6 flex flex-col justify-between">
        <div className="space-y-1.5 mb-2 text-left">
          <span className="text-slate-455 dark:text-slate-500 text-[8px] font-black uppercase font-mono tracking-widest block leading-none">
            Intelligence Breakdown
          </span>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0 leading-none">
            Repository Capability Analysis
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-left">
          <RadarAnalytics data={radarData} colorScheme="brand" height={220} />
          
          {/* Subscores details */}
          <div className="space-y-3.5 pr-2 text-left">
            {[
              { name: 'Code Quality', score: breakdown.code_quality_score, icon: Code },
              { name: 'Documentation', score: breakdown.documentation_score, icon: Award },
              { name: 'Complexity', score: breakdown.complexity_score, icon: Zap },
              { name: 'Testing Compliance', score: breakdown.testing_score, icon: HelpCircle },
              { name: 'Security Standards', score: breakdown.security_score, icon: ShieldCheck }
            ].map((sub) => {
              const SubIcon = sub.icon
              return (
                <div key={sub.name} className="flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between text-[11px] font-bold leading-none select-none">
                    <span className="flex items-center gap-1.5 text-slate-750 dark:text-slate-300 leading-none">
                      <SubIcon size={14} className="text-slate-405" />
                      {sub.name}
                    </span>
                    <span className="text-slate-950 dark:text-slate-50 font-mono font-black leading-none">{sub.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 border border-slate-200/50 dark:border-slate-850/50 overflow-hidden">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full"
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
export default DeveloperScoreCard
