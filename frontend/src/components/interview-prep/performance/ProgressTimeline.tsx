import React from 'react'
import { motion } from 'framer-motion'
import { History, Award, CheckCircle2, Flame, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { ProgressTimelineEvent } from '@/types/interviewPrep'

export interface ProgressTimelineProps {
  events: ProgressTimelineEvent[]
}

export function ProgressTimeline({ events }: ProgressTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Streak Milestone':
        return Flame
      case 'Score Achievement':
        return Sparkles
      case 'Question Bank Milestone':
        return CheckCircle2
      default:
        return Award
    }
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <History className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Milestone Timeline & Achievements
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Chronological log of completed rounds, question bank milestones, and streaks
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3 text-xs">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
          {events.map((ev, i) => {
            const Icon = getIcon(ev.type)

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative space-y-1"
              >
                {/* Timeline Dot Icon */}
                <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-purple-600 border-2 border-[#10121e] text-white">
                  <Icon className="h-3 w-3" />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white leading-tight">{ev.title}</h4>
                  <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] font-bold px-2 py-0.5">
                    {ev.badgeText}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {ev.description}
                </p>

                <span className="text-[10px] text-slate-500 font-mono block">
                  {ev.date}
                </span>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
export default ProgressTimeline
