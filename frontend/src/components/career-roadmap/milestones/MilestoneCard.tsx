import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Code, Award, Sliders, Zap, Cpu, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SkillProgressBar } from '../skills-gap/SkillProgressBar'
import { getCardVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { MilestoneItem, PhaseStatus } from '@/types/careerRoadmap'

export interface MilestoneCardProps {
  milestone: MilestoneItem
  onViewDetails?: (id: string) => void
  className?: string
}

export const MilestoneCard = memo(function MilestoneCard({
  milestone,
  onViewDetails,
  className,
}: MilestoneCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const cardVariants = getCardVariants(shouldReduceMotion)

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="h-4 w-4 text-emerald-400" aria-hidden="true" />
      case 'award':
        return <Award className="h-4 w-4 text-blue-400" aria-hidden="true" />
      case 'sliders':
        return <Sliders className="h-4 w-4 text-purple-400" aria-hidden="true" />
      case 'zap':
        return <Zap className="h-4 w-4 text-cyan-400" aria-hidden="true" />
      case 'cpu':
      default:
        return <Cpu className="h-4 w-4 text-amber-400" aria-hidden="true" />
    }
  }

  const getStatusBadgeStyle = (status: PhaseStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'upcoming':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
      case 'planned':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700'
    }
  }

  const getPriorityBadgeStyle = (priority: MilestoneItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      case 'High':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      case 'Medium':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700'
    }
  }

  return (
    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="h-full">
      <Card
        className={cn(
          'p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm hover:border-purple-500/30 transition-all text-left flex flex-col justify-between h-full',
          className
        )}
      >
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/10 shrink-0">
                {renderIcon(milestone.iconName)}
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                {milestone.phaseName}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border', getPriorityBadgeStyle(milestone.priority))}>
                {milestone.priority}
              </span>
              <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border', getStatusBadgeStyle(milestone.status))}>
                {milestone.status.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
              <span>{milestone.title}</span>
              {milestone.status === 'completed' && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 m-0">
              {milestone.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Milestone Completion</span>
              <span className="font-bold text-white font-mono">{milestone.progress}%</span>
            </div>
            <SkillProgressBar value={milestone.progress} status={milestone.status === 'completed' ? 'completed' : 'in-progress'} height="h-2" />
          </div>
        </div>

        {/* Footer Meta & Action */}
        <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-500" aria-hidden="true" />
              <span>Target: {milestone.targetDate}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
              <span>Est: {milestone.estimatedEffort}</span>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(milestone.id)}
            className="w-full justify-center text-xs font-semibold text-slate-200 border-white/10 bg-[#0b0c14] hover:bg-white/10 hover:text-white py-1.5 rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500/50"
            aria-label={`View details for milestone: ${milestone.title}`}
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1 text-slate-400 shrink-0" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
})
export default MilestoneCard
