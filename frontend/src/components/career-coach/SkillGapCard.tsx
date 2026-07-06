import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AlertCircle, BookOpen, Clock, BarChart4 } from 'lucide-react'
import type { AISkillGapResponse, AISkillGapItem } from '@/types/roadmap'

interface SkillGapCardProps {
  skillGap: AISkillGapResponse | null
  isLoading?: boolean
}

export function SkillGapCard({ skillGap, isLoading = false }: SkillGapCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="border-slate-200/60 dark:border-slate-800/40 animate-pulse">
            <CardContent className="h-24 bg-slate-100/50 dark:bg-slate-900/50" />
          </Card>
        ))}
      </div>
    )
  }

  if (!skillGap) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <CardContent className="py-12 text-center text-xs text-slate-400 italic">
          No skill gap analysis generated yet. Click "Analyze Skill Gaps" to generate.
        </CardContent>
      </Card>
    )
  }

  const getSeverityBadgeVariant = (severity: string) => {
    const s = severity.toUpperCase()
    if (s === 'HIGH') return 'error'
    if (s === 'MEDIUM') return 'warning'
    return 'info'
  }

  const renderGapItem = (item: AISkillGapItem, idx: number) => {
    return (
      <div
        key={idx}
        className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm hover:shadow-xs transition-all text-left"
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display m-0">
              {item.skill}
            </h4>
            <Badge variant={getSeverityBadgeVariant(item.gap_severity)}>
              {item.gap_severity.toUpperCase()} Priority
            </Badge>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans m-0">
            <strong>Remediation Strategy & AI Reasoning:</strong> {item.remediation_action}
          </p>
        </div>

        {/* Action button / quick link */}
        <div className="flex md:flex-col items-end gap-2 shrink-0 justify-between md:justify-start">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <Clock size={11} />
            <span>Est: 20-40 hrs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <BarChart4 size={11} />
            <span>Diff: Medium</span>
          </div>
        </div>
      </div>
    )
  }

  // Categories helper
  const sections = [
    { title: 'Technical Skill Gaps', items: skillGap.technical_gaps },
    { title: 'Framework & Language Gaps', items: skillGap.framework_gaps },
    { title: 'Tools & Utilities Gaps', items: skillGap.tool_gaps },
    { title: 'Domain Knowledge Gaps', items: skillGap.domain_knowledge_gaps },
    { title: 'Soft Skills Gaps', items: skillGap.soft_skill_gaps },
    { title: 'Communication Gaps', items: skillGap.communication_gaps },
    { title: 'Confidence Gaps', items: skillGap.confidence_gaps },
  ].filter(sec => sec.items && sec.items.length > 0)

  return (
    <div className="space-y-6">
      {/* Skill readiness overview banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800">
        <div className="space-y-1.5 text-left">
          <h3 className="text-base font-extrabold font-display m-0">Skill Coverage Summary</h3>
          <p className="text-xs text-slate-400 max-w-xl font-sans m-0">
            Targeting the <strong className="text-brand-400">{skillGap.target_role}</strong> role. The AI has evaluated your credentials and identified key areas of improvement.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2.5 rounded-xl border border-slate-700/50">
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-slate-400">Readiness Rating</div>
            <div className="text-lg font-black text-amber-500 font-display">{skillGap.readiness_score}%</div>
          </div>
        </div>
      </div>

      {sections.length === 0 ? (
        <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
          <CardContent className="py-12 text-center text-xs text-slate-500 italic">
            Congratulations! The AI found zero skill gaps for your target role.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <div key={i} className="space-y-3 text-left">
              <h3 className="text-sm font-bold font-display text-slate-950 dark:text-slate-100 flex items-center gap-2 pl-1">
                <BookOpen size={15} className="text-brand-500" />
                <span>{sec.title}</span>
              </h3>
              <div className="space-y-3">
                {sec.items.map((item, idx) => renderGapItem(item, idx))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default SkillGapCard
