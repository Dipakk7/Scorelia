import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Calendar, AlertCircle, Building2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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
      <Card className="bg-[#10121e] border border-white/10 rounded-2xl p-4 sm:p-4.5 h-full flex flex-col justify-between">
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-20 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="bg-[#10121e] border border-white/10 rounded-2xl p-4 sm:p-4.5">
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load upcoming interview details.</span>
        </div>
      </Card>
    )
  }

  if (isEmpty || !upcomingInterview) {
    return (
      <Card className="bg-[#10121e] border border-white/10 rounded-2xl p-4 sm:p-4.5 text-center text-slate-400 text-xs font-medium h-full flex flex-col items-center justify-center space-y-3">
        <div className="p-2.5 rounded-full bg-purple-500/10 text-purple-400">
          <Calendar className="h-5 w-5" />
        </div>
        <p>No upcoming mock interview scheduled.</p>
        <Button className="h-8 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors">
          Schedule Interview
        </Button>
      </Card>
    )
  }

  return (
    <Card className="bg-[#10121e] border border-white/10 rounded-2xl p-4 sm:p-4.5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-full text-left">
      <CardHeader className="p-0 pb-3.5 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span>Upcoming Mock Interview</span>
          <Badge className="bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
            Next Up
          </Badge>
        </CardTitle>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors">
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col justify-start space-y-3.5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-[#141627] border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between space-y-4"
        >
          {/* Top Section: LEFT (Date Badge) + CENTER (Title, Metadata, Date & Time Stack) */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* Date Badge: Vertically Centered */}
            <div className="flex flex-col items-center justify-center h-13 w-13 sm:h-14 sm:w-14 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-slate-900/40 border border-purple-500/30 rounded-xl shrink-0 text-center shadow-inner my-auto">
              <span className="text-[9px] font-extrabold uppercase text-purple-300 tracking-wider leading-none">
                {upcomingInterview.dateMonth}
              </span>
              <span className="text-lg sm:text-xl font-black text-white leading-none mt-1">
                {upcomingInterview.dateDay}
              </span>
            </div>

            {/* Information Stack */}
            <div className="space-y-2 min-w-0 flex-1">
              {/* 1. Single-Line Interview Title */}
              <h4 className="text-sm sm:text-base font-bold text-white leading-tight tracking-tight whitespace-nowrap truncate">
                {upcomingInterview.title}
              </h4>
              
              {/* 2. Single-Line Metadata Row (Google • Technical • 60 mins) */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-slate-200 font-semibold">{upcomingInterview.companyName}</span>
                <span className="text-slate-600">•</span>
                <span>{upcomingInterview.interviewType}</span>
                <span className="text-slate-600">•</span>
                <span>{upcomingInterview.durationMinutes} mins</span>
              </div>

              {/* 3. Single-Line Date & Time Row */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
                <Clock className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="whitespace-nowrap">{upcomingInterview.scheduleTimeText}</span>
              </div>
            </div>
          </div>

          {/* Bottom-Right Section: Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10 sm:border-t-0 sm:pt-0">
            <Button
              variant="outline"
              className="h-8.5 px-3.5 text-xs font-semibold text-slate-300 border-white/15 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Reschedule
            </Button>
            <Button className="h-8.5 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none shadow-md shadow-purple-900/30 whitespace-nowrap">
              Start Interview
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
export default UpcomingInterviewCard
