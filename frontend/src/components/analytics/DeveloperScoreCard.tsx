import { RadarAnalytics } from '@/components/analytics/RadarAnalytics'
import { Card } from '@/components/ui/Card'
import { Award, Zap, Code, ShieldCheck, HelpCircle } from 'lucide-react'

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
    if (val >= 90) return { label: 'Elite Architect', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' }
    if (val >= 75) return { label: 'Senior Engineer', color: 'text-brand-500 bg-brand-500/10 border-brand-500/20' }
    if (val >= 50) return { label: 'Intermediate Developer', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
    return { label: 'Junior Developer', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' }
  }

  const rank = getRank(score)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Score Gauge Card */}
      <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md flex flex-col justify-between p-6">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Developer Index
          </span>
          <h4 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100 font-display">
            Overall Developer Score
          </h4>
        </div>

        {/* Circular Gauge Ring */}
        <div className="flex flex-col items-center justify-center my-6 relative">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r="62"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100 dark:text-slate-800/50"
              fill="transparent"
            />
            {/* Foreground circle */}
            <circle
              cx="72"
              cy="72"
              r="62"
              stroke="url(#scoreGrad)"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - score / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black font-display tracking-tighter text-slate-800 dark:text-white bg-linear-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent">
              {score}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              / 100
            </span>
          </div>
        </div>

        {/* Rank badge */}
        <div className={`mt-2 py-2 px-4 rounded-xl border text-center text-xs font-bold ${rank.color}`}>
          Rank: {rank.label}
        </div>
      </Card>

      {/* Score Breakdown Radar Chart Card */}
      <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6">
        <div className="space-y-1.5 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Intelligence Breakdown
          </span>
          <h4 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100 font-display">
            Repository Capability Analysis
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <RadarAnalytics data={radarData} colorScheme="brand" height={220} />
          
          {/* Subscores details */}
          <div className="space-y-3 pr-2">
            {[
              { name: 'Code Quality', score: breakdown.code_quality_score, icon: Code, desc: 'Syntax clarity, standard practices compliance.' },
              { name: 'Documentation', score: breakdown.documentation_score, icon: Award, desc: 'Readme sizes, inline comments coverage.' },
              { name: 'Complexity', score: breakdown.complexity_score, icon: Zap, desc: 'Nesting loops logic depth control.' },
              { name: 'Testing Compliance', score: breakdown.testing_score, icon: HelpCircle, desc: 'Assertion frameworks integration.' },
              { name: 'Security Standards', score: breakdown.security_score, icon: ShieldCheck, desc: 'Sensitive values hiding, token safety.' }
            ].map((sub) => {
              const SubIcon = sub.icon
              return (
                <div key={sub.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <SubIcon size={14} className="text-slate-400" />
                      {sub.name}
                    </span>
                    <span className="text-slate-950 dark:text-slate-50 font-bold">{sub.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                    <div
                      className="bg-brand-500 h-1 rounded-full"
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
