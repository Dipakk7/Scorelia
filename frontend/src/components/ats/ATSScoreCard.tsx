import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

interface ATSBreakdown {
  contact: number
  skills: number
  education: number
  experience: number
  projects: number
  certifications: number
}

interface ATSScoreCardProps {
  breakdown: ATSBreakdown
  overallScore: number
  grade: string
}

export function ATSScoreCard({ breakdown, overallScore: _overallScore, grade: _grade }: ATSScoreCardProps) {
  // Define maximum points for each category based on ATS standard scoring mapping
  const categoryMeta = [
    { key: 'skills', label: 'Skills Match', val: breakdown.skills, max: 20, desc: 'Technical and core competency matching' },
    { key: 'experience', label: 'Experience Match', val: breakdown.experience, max: 20, desc: 'Years and depth of experience match' },
    { key: 'education', label: 'Education Match', val: breakdown.education, max: 15, desc: 'Degree rank and field compliance' },
    { key: 'projects', label: 'Projects & Work', val: breakdown.projects, max: 15, desc: 'Project portfolios and practical proof' },
    { key: 'certifications', label: 'Certifications', val: breakdown.certifications, max: 15, desc: 'Relevant credentials and certifications' },
    { key: 'contact', label: 'Contact & Formatting', val: breakdown.contact, max: 15, desc: 'Completeness of social links and email/phone' },
  ]

  const getProgressColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getPercentageString = (score: number, max: number) => {
    return `${Math.round((score / max) * 100)}%`
  }

  return (
    <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm overflow-hidden font-sans rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 text-left">
      <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-slate-150 m-0">ATS Score Breakdown</CardTitle>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Version 1.0
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        {categoryMeta.map((item) => (
          <div key={item.key} className="space-y-1.5 text-left">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 font-display font-bold">
                {item.label}
              </span>
              <span className="text-slate-900 dark:text-white font-mono text-[11px] font-bold">
                {item.val} / {item.max} ({getPercentageString(item.val, item.max)})
              </span>
            </div>
            
            {/* Progress Track */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(item.val, item.max)} transition-all duration-700`}
                style={{ width: `${(item.val / item.max) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-sans leading-tight m-0 font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ATSScoreCard
