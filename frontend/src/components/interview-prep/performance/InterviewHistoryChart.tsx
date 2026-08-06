import React from 'react'
import { motion } from 'framer-motion'
import { Video, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { InterviewHistoryTrendItem } from '@/types/interviewPrep'

export interface InterviewHistoryChartProps {
  historyTrends: InterviewHistoryTrendItem[]
}

export function InterviewHistoryChart({ historyTrends }: InterviewHistoryChartProps) {
  const maxAttempts = 15

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Monthly Interview Frequency & Duration
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Historical view of completed mock rounds and average practice duration
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4 text-xs">
        <div className="grid grid-cols-5 gap-3 h-40 items-end pt-5 pb-2 border-b border-white/10 px-2">
          {historyTrends.map((item, index) => {
            const heightPercent = Math.min(100, Math.max(15, (item.attemptsCount / maxAttempts) * 100))

            return (
              <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <span className="text-[10px] font-bold text-purple-300 font-mono tracking-tight group-hover:text-purple-200 transition-colors">
                  {item.attemptsCount} Mocks
                </span>

                <div className="w-full flex justify-center items-end h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="w-full max-w-[36px] bg-gradient-to-t from-purple-900/80 via-purple-600 to-purple-400 rounded-t-xl group-hover:brightness-125 transition-all shadow-lg shadow-purple-500/10"
                  />
                </div>

                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {item.monthLabel}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] pt-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141627] border border-white/10">
            <Clock className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="text-slate-300 font-medium">Avg Session: <span className="text-white font-bold font-mono">45 Min</span></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141627] border border-white/10">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">Success Rate: <span className="text-emerald-400 font-bold font-mono">88%</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default InterviewHistoryChart
