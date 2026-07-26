import React from 'react'
import { Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SkillProgressBar } from '../skills-gap/SkillProgressBar'
import { skillCategoriesMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { SkillCategoryItem } from '@/types/careerRoadmap'

export interface SkillsReportProps {
  categories?: SkillCategoryItem[]
  className?: string
}

export function SkillsReport({
  categories = skillCategoriesMockData,
  className,
}: SkillsReportProps) {
  const strongSkills = categories.filter((c) => c.completion >= 70)
  const weakSkills = categories.filter((c) => c.completion < 40)

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Award className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Skills Audit &amp; Proficiency Report</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Categorized breakdown of technical proficiencies and learning velocity
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">
          9 Skills Tracked
        </span>
      </div>

      {/* Category Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1.5 text-left"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{cat.name}</span>
              <span className="font-mono font-bold text-slate-300">{cat.completion}%</span>
            </div>
            <SkillProgressBar value={cat.completion} status={cat.status} height="h-2" />
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium pt-0.5">
              <span>{cat.difficulty}</span>
              <span className="capitalize">{cat.status.replace('-', ' ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths vs Gaps Footer Pill Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
        {/* Strongest Skills */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            Top Core Strengths (70%+)
          </span>
          <div className="flex flex-wrap gap-1">
            {strongSkills.map((s) => (
              <span key={s.id} className="px-2 py-0.5 rounded-md bg-[#0b0c14] text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
                {s.name} ({s.completion}%)
              </span>
            ))}
          </div>
        </div>

        {/* Priority Gaps */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            Priority Focus Gaps (&lt;40%)
          </span>
          <div className="flex flex-wrap gap-1">
            {weakSkills.map((w) => (
              <span key={w.id} className="px-2 py-0.5 rounded-md bg-[#0b0c14] text-[10px] font-medium text-rose-300 border border-rose-500/30">
                {w.name} ({w.completion}%)
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
export default SkillsReport
