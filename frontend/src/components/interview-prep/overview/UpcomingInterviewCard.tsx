import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import type { UpcomingInterview } from '@/types/interviewPrep'

export interface UpcomingInterviewCardProps {
  upcomingInterview?: UpcomingInterview
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function UpcomingInterviewCard({
  upcomingInterview,
  isLoading = false,
  isEmpty = false,
  isError = false,
}: UpcomingInterviewCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between">
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Failed to load upcoming interview details.</span>
        </div>
      </Card>
    )
  }

  if (isEmpty || !upcomingInterview) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 text-center text-slate-400 text-xs font-medium h-full flex flex-col items-center justify-center">
        No upcoming mock interview scheduled.
        <Button className="mt-3 px-4 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-xl">
          Schedule Interview
        </Button>
      </Card>
    )
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-full">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-white tracking-tight">
          Upcoming Mock Interview
        </CardTitle>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer whitespace-nowrap">
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#141627] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            {/* Date Badge */}
            <div className="flex flex-col items-center justify-center h-16 w-16 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-purple-500/30 rounded-xl shrink-0 text-center">
              <span className="text-[10px] font-extrabold uppercase text-purple-300 tracking-wider">
                {upcomingInterview.dateMonth}
              </span>
              <span className="text-2xl font-black text-white leading-none mt-0.5">
                {upcomingInterview.dateDay}
              </span>
            </div>

            {/* Event Info */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white leading-tight">
                {upcomingInterview.title}
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                {upcomingInterview.companyName} • {upcomingInterview.durationMinutes} min • {upcomingInterview.interviewType}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold pt-0.5">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>{upcomingInterview.scheduleTimeText}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:shrink-0">
            <Button
              variant="outline"
              className="px-4 py-2 text-xs font-semibold text-slate-300 border-white/15 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              Reschedule
            </Button>
            <Button className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none shadow-md shadow-purple-900/30">
              Start Interview
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
export default UpcomingInterviewCard
