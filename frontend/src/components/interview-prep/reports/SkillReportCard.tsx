import React from 'react'
import { Brain, Code2, Database, Network, MessageSquare, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function SkillReportCard() {
  const skills = [
    { name: 'Behavioral & STAR Method', score: 94, level: 'Expert', icon: MessageSquare, color: 'bg-emerald-500' },
    { name: 'Machine Learning Theory', score: 92, level: 'Expert', icon: Brain, color: 'bg-emerald-500' },
    { name: 'Python Algorithms', score: 88, level: 'Advanced', icon: Code2, color: 'bg-purple-500' },
    { name: 'SQL Query Tuning', score: 76, level: 'Intermediate', icon: Database, color: 'bg-amber-500' },
    { name: 'System Design Architecture', score: 72, level: 'Improving', icon: Network, color: 'bg-blue-500' },
  ]

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="h-4 w-4 text-purple-400" /> Core Competency Audit
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {skills.map((sk, i) => {
          const Icon = sk.icon
          return (
            <div key={i} className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-purple-400 shrink-0" />
                  <span className="font-bold text-white">{sk.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/5 text-slate-300 border-white/10 text-[9px] font-bold">
                    {sk.level}
                  </Badge>
                  <span className="font-extrabold text-white font-mono">{sk.score}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${sk.color}`}
                  style={{ width: `${sk.score}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
export default SkillReportCard
