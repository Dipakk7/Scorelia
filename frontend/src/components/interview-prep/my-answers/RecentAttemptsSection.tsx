import React from 'react'
import { motion } from 'framer-motion'
import { History, TrendingUp, ArrowRight, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { RecentAttemptItem } from '@/types/interviewPrep'

export interface RecentAttemptsSectionProps {
  attempts: RecentAttemptItem[]
  onSelectAttempt: (item: RecentAttemptItem) => void
}

export function RecentAttemptsSection({ attempts, onSelectAttempt }: RecentAttemptsSectionProps) {
  if (!attempts || attempts.length === 0) return null

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <History className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Recent Attempt Gains & Trajectory
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Score improvements over consecutive attempts
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        {attempts.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#141627] border border-white/5 hover:border-white/15 transition-all gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block leading-tight">
                  {item.questionTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Attempted on {item.attemptDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {item.scorePercent}% Score
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +{item.improvementPercent}% gain
                </span>
              </div>

              <Button
                variant="outline"
                onClick={() => onSelectAttempt(item)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 border-white/15 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Continue Practice</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
export default RecentAttemptsSection
