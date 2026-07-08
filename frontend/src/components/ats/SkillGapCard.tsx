import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BookOpen, ExternalLink, Award, CheckCircle, Lightbulb, Clock } from 'lucide-react'

interface SkillGapCardProps {
  missingSkills: string[]
  preferredSkills?: string[] // Optional to differentiate priority
}

// Common Soft Skills list for classification heuristics
const SOFT_SKILLS_LIST = [
  'communication', 'teamwork', 'leadership', 'collaboration', 'problem solving',
  'time management', 'adaptability', 'critical thinking', 'conflict resolution',
  'active listening', 'interpersonal', 'creativity', 'organization', 'negotiation',
  'work ethic', 'emotional intelligence', 'mentoring', 'management', 'presentation',
]

// Difficulty & Learning Time estimates map
const SKILL_METADATA: Record<string, { difficulty: 'Easy' | 'Medium' | 'Hard'; time: string }> = {
  // Languages
  python: { difficulty: 'Easy', time: '2-3 weeks' },
  javascript: { difficulty: 'Medium', time: '3-4 weeks' },
  typescript: { difficulty: 'Medium', time: '3-4 weeks' },
  html: { difficulty: 'Easy', time: '1 week' },
  css: { difficulty: 'Easy', time: '1-2 weeks' },
  sql: { difficulty: 'Easy', time: '1-2 weeks' },
  java: { difficulty: 'Hard', time: '2-3 months' },
  c: { difficulty: 'Hard', time: '3 months' },
  rust: { difficulty: 'Hard', time: '3 months' },
  go: { difficulty: 'Medium', time: '4-6 weeks' },
  // Frameworks
  react: { difficulty: 'Medium', time: '4-6 weeks' },
  angular: { difficulty: 'Hard', time: '2 months' },
  vue: { difficulty: 'Easy', time: '2-3 weeks' },
  fastapi: { difficulty: 'Easy', time: '2 weeks' },
  django: { difficulty: 'Medium', time: '3-4 weeks' },
  spring: { difficulty: 'Hard', time: '2-3 months' },
  node: { difficulty: 'Medium', time: '3-4 weeks' },
  next: { difficulty: 'Medium', time: '3-4 weeks' },
  // DevOps & Cloud
  docker: { difficulty: 'Medium', time: '2-3 weeks' },
  kubernetes: { difficulty: 'Hard', time: '2 months' },
  aws: { difficulty: 'Hard', time: '2 months' },
  azure: { difficulty: 'Hard', time: '2 months' },
  git: { difficulty: 'Easy', time: '3-5 days' },
  terraform: { difficulty: 'Medium', time: '3-4 weeks' },
}

export function SkillGapCard({ missingSkills, preferredSkills = [] }: SkillGapCardProps) {
  const preferredSet = useMemo(() => new Set(preferredSkills.map((s) => s.toLowerCase())), [preferredSkills])

  // Process missing skills into structured gaps
  const skillGaps = useMemo(() => {
    return missingSkills.map((skill) => {
      const lowerSkill = skill.toLowerCase()
      const isSoft = SOFT_SKILLS_LIST.some((s) => lowerSkill.includes(s) || s.includes(lowerSkill))
      const isPreferred = preferredSet.has(lowerSkill)

      // Get metadata or fallback
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
      let time = '3-4 weeks'

      if (SKILL_METADATA[lowerSkill]) {
        difficulty = SKILL_METADATA[lowerSkill].difficulty
        time = SKILL_METADATA[lowerSkill].time
      } else if (isSoft) {
        difficulty = 'Easy'
        time = '1-2 weeks'
      }

      // Generate learning resources URLs
      const resources = [
        {
          name: 'Coursera',
          url: `https://www.coursera.org/courses?query=${encodeURIComponent(skill)}`,
        },
        {
          name: 'Udemy',
          url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
        },
        {
          name: 'MDN / Docs',
          url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation')}`,
        },
      ]

      return {
        name: skill,
        isSoft,
        priority: isPreferred ? 'MEDIUM' : 'HIGH',
        difficulty,
        time,
        resources,
      }
    })
  }, [missingSkills, preferredSet])

  // Split into Technical and Soft
  const { technicalGaps, softGaps } = useMemo(() => {
    const technicalGaps = skillGaps.filter((g) => !g.isSoft)
    const softGaps = skillGaps.filter((g) => g.isSoft)
    return { technicalGaps, softGaps }
  }, [skillGaps])

  if (!missingSkills || missingSkills.length === 0) {
    return (
      <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 text-left">
        <CardContent className="py-12 flex flex-col items-center justify-center text-center p-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle size={22} className="stroke-[1.75]" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 m-0">
            No Skill Gaps Detected
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-455 mt-1.5 max-w-sm font-sans leading-normal m-0 font-medium">
            Your resume perfectly matches all candidate skills requested in the job description!
          </p>
        </CardContent>
      </Card>
    )
  }

  const renderGapItem = (gap: typeof skillGaps[0], i: number) => {
    return (
      <div
        key={i}
        className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left font-sans text-xs hover:border-slate-300 dark:hover:border-slate-800 transition-colors duration-200"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <strong className="font-extrabold text-slate-900 dark:text-slate-200 text-sm">
              {gap.name}
            </strong>
            <Badge variant={gap.priority === 'HIGH' ? 'error' : 'warning'} className="text-[9px] px-1.5 py-0 font-bold uppercase tracking-wider">
              {gap.priority === 'HIGH' ? 'Required' : 'Preferred'}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-slate-450 dark:text-slate-500 text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <Award size={12} className="text-slate-400" />
              <span>Difficulty: <strong className="text-slate-700 dark:text-slate-300">{gap.difficulty}</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              <span>Est. Study: <strong className="text-slate-700 dark:text-slate-300">{gap.time}</strong></span>
            </span>
          </div>
        </div>

        {/* Resources list */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center mr-1 font-bold uppercase tracking-wider">Study links:</span>
          {gap.resources.map((res, rIdx) => (
            <a
              key={rIdx}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-655 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors font-semibold"
            >
              <span>{res.name}</span>
              <ExternalLink size={9} />
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 text-left">
      <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
        <CardTitle className="text-sm font-extrabold flex items-center gap-1.5 m-0">
          <BookOpen className="text-brand-500" size={14} />
          <span>Skill Gap & Learning Path</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Technical skills gap */}
        {technicalGaps.length > 0 && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-250 flex items-center gap-1.5 m-0 uppercase tracking-wider">
              <Lightbulb size={13} className="text-amber-500" />
              <span>Technical Skills to Add</span>
            </h4>
            <div className="space-y-2.5">
              {technicalGaps.map((gap, i) => renderGapItem(gap, i))}
            </div>
          </div>
        )}

        {/* Soft skills gap */}
        {softGaps.length > 0 && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-250 flex items-center gap-1.5 m-0 uppercase tracking-wider">
              <CheckCircle size={13} className="text-emerald-500" />
              <span>Soft Skills & Professional Gaps</span>
            </h4>
            <div className="space-y-2.5">
              {softGaps.map((gap, i) => renderGapItem(gap, i))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SkillGapCard
