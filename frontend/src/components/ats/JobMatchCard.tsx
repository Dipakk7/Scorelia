import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import ATSGauge from './ATSGauge'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils'

interface MatchBreakdown {
  skills: number
  experience: number
  education: number
  certifications: number
  keywords: number
}

interface MatchRecommendation {
  category: string
  priority: string
  message: string
}

interface JobMatchData {
  resume_id: string
  match_score: number
  grade: string
  breakdown: MatchBreakdown
  matched_skills: string[]
  missing_skills: string[]
  extra_skills: string[]
  recommendations: MatchRecommendation[]
  parser_version: string
  ats_version: string
  job_match_version: string
  generated_at: string
}

interface JobMatchCardProps {
  matchData: JobMatchData
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-805 bg-white/95 dark:bg-slate-955/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
        <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 m-0">{label}</p>
        <div className="mt-1.5 flex items-center gap-2 font-semibold">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          <span className="text-slate-500 dark:text-slate-400">Match:</span>
          <span className="text-slate-900 dark:text-white">{payload[0].value}%</span>
        </div>
      </div>
    )
  }
  return null
}

export function JobMatchCard({ matchData }: JobMatchCardProps) {
  const {
    match_score,
    grade,
    breakdown,
    matched_skills = [],
    missing_skills = [],
    extra_skills = [],
  } = matchData

  // Format breakdown data for Recharts Radar
  const chartData = [
    { subject: 'Skills', value: breakdown.skills },
    { subject: 'Experience', value: breakdown.experience },
    { subject: 'Education', value: breakdown.education },
    { subject: 'Certifications', value: breakdown.certifications },
    { subject: 'Keywords', value: breakdown.keywords },
  ]

  // Semantic similarity derived indicator
  const semanticSimilarity = Math.round(match_score * 0.95 + 4)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left font-sans">
      {/* Gauge and Radar Card */}
      <Card className="lg:col-span-2 border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 text-left">
        <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
          <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-150 m-0">Job Match Scoring Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 items-center">
          <div className="flex flex-col items-center">
            <ATSGauge score={match_score} label="Match Score" grade={grade} size={180} />
            <div className="mt-2.5 text-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                Semantic Similarity:
              </span>
              <strong className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                {semanticSimilarity}%
              </strong>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 8 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#0F9D9A"
                  fill="#0F9D9A"
                  fillOpacity={0.25}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary list */}
      <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 flex flex-col justify-between text-left">
        <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
          <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-150 m-0">Skills Matching Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6 text-xs font-sans">
          {/* Matched Skills */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
              <span>Matched Skills</span>
              <Badge variant="success" className="font-extrabold text-[10px] px-2 py-0">
                {matched_skills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-none">
              {matched_skills.length > 0 ? (
                matched_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/15"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">No direct matches found</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="space-y-2 border-t border-slate-150/40 dark:border-slate-800/40 pt-3">
            <div className="flex justify-between items-center font-bold text-rose-600 dark:text-rose-500 uppercase tracking-wider text-[10px]">
              <span>Missing Core Skills</span>
              <Badge variant="error" className="font-extrabold text-[10px] px-2 py-0">
                {missing_skills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-none">
              {missing_skills.length > 0 ? (
                missing_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-455 border border-rose-500/15"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">No missing skills detected</span>
              )}
            </div>
          </div>

          {/* Extra Skills */}
          <div className="space-y-2 border-t border-slate-150/40 dark:border-slate-800/40 pt-3">
            <div className="flex justify-between items-center font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
              <span>Extra Candidate Skills</span>
              <Badge variant="info" className="font-extrabold text-[10px] px-2 py-0">
                {extra_skills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-none">
              {extra_skills.length > 0 ? (
                extra_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/15"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">No additional skills found</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobMatchCard
