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
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
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

      <CardContent className="p-0 space-y-3 text-xs">
        <div className="grid grid-cols-5 gap-3 h-36 items-end pt-4 pb-2 border-b border-white/5 px-2">
          {historyTrends.map((item, index) => {
            const heightPercent = (item.attemptsCount / maxAttempts) * 100

            return (
              <div key={index} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-purple-300 font-mono">
                  {item.attemptsCount} Mocks
                </span>

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-purple-900/60 to-purple-500 rounded-t-xl hover:brightness-125 transition-all cursor-pointer"
                />

                <span className="text-[10px] font-semibold text-slate-400">
                  {item.monthLabel}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Clock className="h-3.5 w-3.5 text-purple-400" />
            <span>Avg Session: <span className="text-white font-bold">45 Min</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Success Rate: <span className="text-emerald-400 font-bold">88%</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default InterviewHistoryChart
