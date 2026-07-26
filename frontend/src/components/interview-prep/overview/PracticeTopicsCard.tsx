import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Cpu, Code2, Database, Boxes, Network, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { PracticeTopicItem } from '@/types/interviewPrep'

export interface PracticeTopicsCardProps {
  topics?: PracticeTopicItem[]
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function PracticeTopicsCard({
  topics = [],
  isLoading = false,
  isEmpty = false,
  isError = false,
}: PracticeTopicsCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return Brain
      case 'Cpu':
        return Cpu
      case 'Code2':
        return Code2
      case 'Database':
        return Database
      case 'Boxes':
        return Boxes
      case 'Network':
        return Network
      default:
        return Brain
    }
  }

  const getColorTheme = (colorTheme: string) => {
    switch (colorTheme) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-400'
      case 'cyan':
        return 'bg-cyan-500/20 text-cyan-400'
      case 'purple':
        return 'bg-purple-500/20 text-purple-400'
      case 'indigo':
        return 'bg-indigo-500/20 text-indigo-400'
      case 'amber':
        return 'bg-amber-500/20 text-amber-400'
      case 'blue':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-purple-500/20 text-purple-400'
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between">
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
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
          <span>Failed to load practice topics.</span>
        </div>
      </Card>
    )
  }

  if (isEmpty || !topics || topics.length === 0) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 text-center text-slate-400 text-xs font-medium">
        No practice topics available.
      </Card>
    )
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-full">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-white tracking-tight">
          Practice by Topic
        </CardTitle>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer whitespace-nowrap">
          <span>View all topics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-2">
          {topics.map((topic, index) => {
            const Icon = getIcon(topic.iconName)
            const iconBg = getColorTheme(topic.colorTheme)

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#141627] border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {topic.title}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-medium">
                    {topic.totalQuestions} Questions
                  </span>
                  <Badge
                    className={
                      topic.priorityVariant === 'high'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold rounded-lg py-0.5 px-2 w-16 justify-center'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-bold rounded-lg py-0.5 px-2 w-16 justify-center'
                    }
                  >
                    {topic.priority}
                  </Badge>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
export default PracticeTopicsCard
