import React from 'react'
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { StrengthWeaknessData } from '@/types/interviewPrep'

export interface StrengthWeaknessPanelProps {
  data: StrengthWeaknessData
}

export function StrengthWeaknessPanel({ data }: StrengthWeaknessPanelProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Strengths & Areas Requiring Focus
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Empirical assessment based on recent evaluation responses
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Strengths Column */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 border-b border-emerald-500/20 pb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Core Superpowers (High Score)
          </span>

          <div className="space-y-2">
            {data.strengths.map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{st.title}</span>
                  <span className="font-mono text-emerald-400 font-bold">{st.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${st.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses Column */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-3">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 border-b border-amber-500/20 pb-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Focus Needed (Growth Areas)
          </span>

          <div className="space-y-2">
            {data.weaknesses.map((wk, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{wk.title}</span>
                  <span className="font-mono text-amber-300 font-bold">{wk.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${wk.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default StrengthWeaknessPanel
