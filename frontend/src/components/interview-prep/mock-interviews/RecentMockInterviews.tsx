import React from 'react'
import { motion } from 'framer-motion'
import { Award, Clock, ArrowRight, AlertCircle, FileSpreadsheet } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import type { MockInterviewHistoryItem } from '@/types/interviewPrep'

export interface RecentMockInterviewsProps {
  historyList?: MockInterviewHistoryItem[]
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function RecentMockInterviews({
  historyList = [],
  isLoading = false,
  isEmpty = false,
  isError = false,
}: RecentMockInterviewsProps) {
  if (isLoading) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5">
        <CardHeader className="p-0 pb-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Failed to load recent mock interviews history.</span>
        </div>
      </Card>
    )
  }

  if (isEmpty || !historyList || historyList.length === 0) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 text-center text-slate-400 text-xs font-medium space-y-2">
        <FileSpreadsheet className="h-8 w-8 text-slate-500 mx-auto" />
        <p>No completed mock interview history found.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div>
          <CardTitle className="text-base font-bold text-white tracking-tight">
            Recent Mock Rounds History
          </CardTitle>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Review your past mock sessions, AI evaluations, and STAR breakdown reports
          </p>
        </div>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer whitespace-nowrap">
          <span>View all history</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0 space-y-2.5">
        {historyList.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#141627] border border-white/5 hover:border-white/15 transition-all gap-3"
          >
            {/* Left Info */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white leading-tight">{item.role}</span>
                  <Badge className="bg-white/5 text-slate-300 border-white/10 text-[9px] font-semibold px-1.5 py-0.5">
                    {item.company}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span>{item.interviewType}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    {item.durationMinutes} min
                  </span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>

            {/* Right Actions & Score */}
            <div className="flex items-center gap-3 sm:shrink-0 justify-between sm:justify-end">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-emerald-400 font-mono text-base leading-none">
                  {item.scorePercent}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Overall Score</span>
              </div>

              <Button
                variant="outline"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 border-white/15 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                View Report
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
export default RecentMockInterviews
