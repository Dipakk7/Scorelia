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
      <Card className="dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40">
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
            No Skill Gaps Detected
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
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
        className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left font-sans text-xs"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <strong className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              {gap.name}
            </strong>
            <Badge variant={gap.priority === 'HIGH' ? 'error' : 'warning'} className="text-[9px] px-1.5 py-0">
              {gap.priority === 'HIGH' ? 'Required' : 'Preferred'}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-slate-450 text-[11px]">
            <span className="flex items-center gap-1">
              <Award size={12} className="text-slate-400" />
              <span>Difficulty: <strong className="text-slate-600 dark:text-slate-350">{gap.difficulty}</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              <span>Est. Study: <strong className="text-slate-600 dark:text-slate-350">{gap.time}</strong></span>
            </span>
          </div>
        </div>

        {/* Resources list */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 self-center mr-1">Study links:</span>
          {gap.resources.map((res, rIdx) => (
            <a
              key={rIdx}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 border border-slate-250/60 dark:border-slate-700/60 rounded-md transition-colors"
            >
              <span>{res.name}</span>
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="text-brand-500 h-5 w-5" />
          <span>Skill Gap & Learning Path</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        {/* Technical skills gap */}
        {technicalGaps.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-500" />
              <span>Technical Skills to Add</span>
            </h4>
            <div className="space-y-2.5">
              {technicalGaps.map((gap, i) => renderGapItem(gap, i))}
            </div>
          </div>
        )}

        {/* Soft skills gap */}
        {softGaps.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" />
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
