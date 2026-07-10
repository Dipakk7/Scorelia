import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AlertCircle, BookOpen, Clock, BarChart4 } from 'lucide-react'
import type { AISkillGapResponse, AISkillGapItem } from '@/types/roadmap'
import { cn } from '@/lib/utils'

interface SkillGapCardProps {
  skillGap: AISkillGapResponse | null
  isLoading?: boolean
}

export function SkillGapCard({ skillGap, isLoading = false }: SkillGapCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 font-sans text-xs">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="border border-border bg-card/70 animate-pulse">
            <CardContent className="h-24 bg-slate-100/50 dark:bg-slate-900/50" />
          </Card>
        ))}
      </div>
    )
  }

  if (!skillGap) {
    return (
      <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 font-sans text-xs">
        <CardContent className="py-12 text-center text-muted-foreground italic font-medium leading-relaxed">
          No skill gap analysis generated yet. Click "Analyze Skill Gaps" to generate.
        </CardContent>
      </Card>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const s = severity.toUpperCase()
    if (s === 'HIGH') {
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-650 dark:text-rose-450 border border-rose-500/20 text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-lg leading-none shrink-0">
          HIGH PRIORITY
        </Badge>
      )
    }
    if (s === 'MEDIUM') {
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20 text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-lg leading-none shrink-0">
          MEDIUM PRIORITY
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-brand-500/10 text-brand-655 dark:text-brand-400 border border-brand-500/20 text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-lg leading-none shrink-0">
        LOW PRIORITY
      </Badge>
    )
  }

  const renderGapItem = (item: AISkillGapItem, idx: number) => {
    return (
      <div
        key={idx}
        className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 shadow-2xs hover:shadow-sm text-left"
      >
        <div className="space-y-1.5 max-w-2xl text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-extrabold text-foreground font-display m-0 leading-none">
              {item.skill}
            </h4>
            {getSeverityBadge(item.gap_severity)}
          </div>
          <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed font-sans m-0 font-medium">
            <strong className="text-muted-foreground font-extrabold">Remediation Strategy:</strong> {item.remediation_action}
          </p>
        </div>

        {/* Action button / quick link */}
        <div className="flex md:flex-col items-end gap-2 shrink-0 justify-between md:justify-start">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
            <Clock size={11} className="text-slate-400" />
            <span>Est: 20-40 hrs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
            <BarChart4 size={11} className="text-slate-400" />
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
    <div className="space-y-6 font-sans text-xs">
      {/* Skill readiness overview banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 text-white border border-slate-850 shadow-sm text-left">
        <div className="space-y-1.5 text-left">
          <h3 className="text-base font-extrabold font-display m-0 leading-none">Skill Coverage Summary</h3>
          <p className="text-xs text-slate-400 max-w-xl font-sans m-0 leading-relaxed font-medium mt-1">
            Targeting the <strong className="text-brand-400 font-bold">{skillGap.target_role}</strong> role. The AI has evaluated your credentials and identified key areas of improvement.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none">Readiness Rating</div>
            <div className="text-lg font-black text-amber-500 font-display font-mono leading-none mt-1">{skillGap.readiness_score}%</div>
          </div>
        </div>
      </div>

      {sections.length === 0 ? (
        <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
          <CardContent className="py-12 text-center text-muted-foreground italic font-medium leading-relaxed">
            Congratulations! The AI found zero skill gaps for your target role.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <div key={i} className="space-y-3 text-left">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground m-0 leading-none flex items-center gap-2 pl-1">
                <BookOpen size={14} className="text-brand-500" />
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
