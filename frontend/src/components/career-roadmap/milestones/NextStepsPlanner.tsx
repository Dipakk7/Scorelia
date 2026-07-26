import React from 'react'
import { motion } from 'framer-motion'
import { Box, Cloud, Globe, Code, Video, Briefcase, Clock, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { nextStepsPlannerMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { NextStepPlannerItem } from '@/types/careerRoadmap'

export interface NextStepsPlannerProps {
  items?: NextStepPlannerItem[]
  onActionClick?: (id: string) => void
  className?: string
}

export function NextStepsPlanner({
  items = nextStepsPlannerMockData,
  onActionClick,
  className,
}: NextStepsPlannerProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'box':
        return <Box className="h-4 w-4 text-purple-400" aria-hidden="true" />
      case 'cloud':
        return <Cloud className="h-4 w-4 text-cyan-400" aria-hidden="true" />
      case 'globe':
        return <Globe className="h-4 w-4 text-emerald-400" aria-hidden="true" />
      case 'code':
        return <Code className="h-4 w-4 text-blue-400" aria-hidden="true" />
      case 'video':
        return <Video className="h-4 w-4 text-amber-400" aria-hidden="true" />
      case 'briefcase':
      default:
        return <Briefcase className="h-4 w-4 text-rose-400" aria-hidden="true" />
    }
  }

  const getPriorityBadgeStyle = (priority: NextStepPlannerItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      case 'High':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      case 'Medium':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    }
  }

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <ArrowRight className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Next Steps Action Planner</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Prioritized tactical steps to maintain high momentum towards your AI Engineer target
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          6 Next Actions
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={itemVariants} className="h-full">
            <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-3 flex flex-col justify-between h-full text-left hover:border-purple-500/30 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border', getPriorityBadgeStyle(item.priority))}>
                    {item.priority}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                    {renderIcon(item.iconName)}
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug m-0">
                  {item.title}
                </h4>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                    <span>Est: {item.estimatedDuration}</span>
                  </span>
                  <span className="font-mono text-purple-400 font-bold">{item.category}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onActionClick?.(item.id)}
                  className="w-full justify-center text-xs font-semibold py-1.5 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500/50"
                  aria-label={`Action for ${item.title}`}
                >
                  <span>{item.actionText}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  )
}
export default NextStepsPlanner
