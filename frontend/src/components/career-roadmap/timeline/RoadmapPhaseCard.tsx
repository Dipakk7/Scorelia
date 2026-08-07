import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Award, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChecklistItem } from './ChecklistItem'
import { getCardVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, PhaseStatus } from '@/types/careerRoadmap'

export interface RoadmapPhaseCardProps {
  phase: RoadmapPhase
  onExpandDetails?: (phaseId: string) => void
  className?: string
}

const STATUS_BADGE_STYLES: Record<PhaseStatus, { label: string; badgeClass: string; textClass: string; borderClass: string }> = {
  completed: {
    label: 'Completed',
    badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/20 hover:border-purple-500/40',
  },
  'in-progress': {
    label: 'In Progress',
    badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30 hover:border-blue-500/50 shadow-lg shadow-blue-950/20',
  },
  upcoming: {
    label: 'Upcoming',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    textClass: 'text-cyan-400',
    borderClass: 'border-white/10 hover:border-cyan-500/30',
  },
  planned: {
    label: 'Planned',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    textClass: 'text-slate-400',
    borderClass: 'border-white/5 opacity-85',
  },
}

export const RoadmapPhaseCard = memo(function RoadmapPhaseCard({
  phase,
  onExpandDetails,
  className,
}: RoadmapPhaseCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const cardVariants = getCardVariants(shouldReduceMotion)
  const statusStyle = STATUS_BADGE_STYLES[phase.status] || STATUS_BADGE_STYLES.planned

  return (
    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="h-full">
      <Card
        className={cn(
          'p-4.5 sm:p-5 bg-[#121426] border rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full text-left',
          statusStyle.borderClass,
          className
        )}
      >
        <div className="space-y-4">
          {/* Header Row: Phase Number Pill & Months Range */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={cn('text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border', statusStyle.badgeClass)}>
                Phase {phase.phaseNumber}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                {statusStyle.label}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>{phase.months}</span>
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1 text-left">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 m-0">
              <span>{phase.title}</span>
              {phase.status === 'completed' && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 m-0">
              {phase.description}
            </p>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Progress</span>
              <span className={cn('font-bold font-mono', statusStyle.textClass)}>{phase.progress}% Complete</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={phase.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 w-full bg-[#0b0c14] border border-white/10 rounded-full overflow-hidden p-0.5"
            >
              <motion.div
                initial={shouldReduceMotion ? { width: `${phase.progress}%` } : { width: '0%' }}
                animate={{ width: `${phase.progress}%` }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  phase.status === 'completed'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                    : phase.status === 'in-progress'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                    : 'bg-gradient-to-r from-cyan-600 to-teal-500'
                )}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Key Learning Milestones
            </span>
            <div className="space-y-1">
              {phase.checklist.map((item) => (
                <ChecklistItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Skill Tags */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {phase.skillTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#0b0c14] border border-white/10 text-[10px] font-mono font-medium text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Meta & View Details Button */}
        <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
              <span>Est: {phase.estimatedHours}</span>
            </span>
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3 text-slate-500" aria-hidden="true" />
              <span>Difficulty: {phase.difficulty}</span>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onExpandDetails?.(phase.id)}
            className="w-full justify-center text-xs font-semibold text-slate-200 border-white/15 bg-[#0b0c14] hover:bg-white/10 hover:text-white rounded-xl py-2.5 min-h-[44px] cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-purple-500/50"
            aria-label={`View details for Phase ${phase.phaseNumber}: ${phase.title}`}
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-slate-400 shrink-0" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
})
export default RoadmapPhaseCard
