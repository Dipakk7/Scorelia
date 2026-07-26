import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Code2, Database, Network, Cpu, MessageSquare } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { SkillBreakdownItem } from '@/types/interviewPrep'

export interface SkillBreakdownChartProps {
  skills: SkillBreakdownItem[]
}

export function SkillBreakdownChart({ skills }: SkillBreakdownChartProps) {
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Expert':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30'
      case 'Advanced':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      case 'Intermediate':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    }
  }

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Engineering':
        return Code2
      case 'Databases':
        return Database
      case 'Soft Skills':
        return MessageSquare
      default:
        return Brain
    }
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Skill Proficiency & Capability Matrix
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Granular breakdown of technical & communication competencies
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((s, i) => {
            const Icon = getIcon(s.category)
            const badgeStyle = getBadgeStyle(s.proficiencyBadge)

            return (
              <div key={i} className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-bold text-white truncate">{s.skillName}</span>
                  </div>

                  <Badge className={`text-[10px] font-bold py-0.5 px-2 rounded ${badgeStyle}`}>
                    {s.proficiencyBadge}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">{s.trendText}</span>
                    <span className="font-bold text-white font-mono">{s.scorePercent}%</span>
                  </div>

                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.scorePercent}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
export default SkillBreakdownChart
