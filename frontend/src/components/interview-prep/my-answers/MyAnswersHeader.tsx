import React from 'react'
import { Edit3, Download, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface MyAnswersHeaderProps {
  totalAnswers?: number
  lastPracticeDate?: string
}

export function MyAnswersHeader({
  totalAnswers = 38,
  lastPracticeDate = 'May 20, 2026',
}: MyAnswersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10121e]/90 border border-white/10 p-5 rounded-2xl hover:border-purple-500/30 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Edit3 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            My Answers & Feedback
          </h2>
          <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs font-bold font-mono px-2.5 py-0.5">
            {totalAnswers} Answers Recorded
          </Badge>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Review your previous mock interview & question bank attempts, compare against model answers, and track AI feedback score trends.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Clock className="h-3.5 w-3.5 text-purple-400" />
          <span>Last active: {lastPracticeDate}</span>
        </div>

        <Button
          disabled
          className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed opacity-60 flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export History</span>
        </Button>
      </div>
    </div>
  )
}
export default MyAnswersHeader
