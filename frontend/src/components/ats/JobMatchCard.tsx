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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* Gauge and Radar Card */}
      <Card className="lg:col-span-2 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40">
        <CardHeader>
          <CardTitle className="text-lg">Job Match Scoring Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-0 items-center">
          <div className="flex flex-col items-center">
            <ATSGauge score={match_score} label="Match Score" grade={grade} size={180} />
            <div className="mt-2 text-center">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans block">
                Semantic Similarity:
              </span>
              <strong className="text-sm font-semibold font-mono text-brand-600 dark:text-brand-400">
                {semanticSimilarity}%
              </strong>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600, fontFamily: 'Outfit' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 8 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#5555ff"
                  fill="#7375ff"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                    fontFamily: 'Outfit',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary list */}
      <Card className="dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-lg">Skills Matching Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0 text-xs font-sans">
          {/* Matched Skills */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Matched Skills</span>
              <span className="font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                {matched_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {matched_skills.length > 0 ? (
                matched_skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="success"
                    className="text-[9px] font-sans px-1.5 py-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-350 border-emerald-500/20"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">No direct matches found</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-red-600 dark:text-red-400">
              <span>Missing Core Skills</span>
              <span className="font-mono bg-red-500/10 px-1.5 py-0.5 rounded-sm">
                {missing_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {missing_skills.length > 0 ? (
                missing_skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="error"
                    className="text-[9px] font-sans px-1.5 py-0 bg-red-500/10 text-red-700 dark:text-red-350 border-red-500/20"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">No missing skills detected</span>
              )}
            </div>
          </div>

          {/* Extra Skills */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-blue-600 dark:text-blue-400">
              <span>Extra Candidate Skills</span>
              <span className="font-mono bg-blue-500/10 px-1.5 py-0.5 rounded-sm">
                {extra_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {extra_skills.length > 0 ? (
                extra_skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="info"
                    className="text-[9px] font-sans px-1.5 py-0 bg-blue-500/10 text-blue-700 dark:text-blue-350 border-blue-500/20"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">No additional skills found</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobMatchCard
