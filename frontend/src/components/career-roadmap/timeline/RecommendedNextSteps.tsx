import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Clock, Award, Code, BookOpen, Layers, MessageSquareCode } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { recommendedNextStepsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { RecommendedStepData } from '@/types/careerRoadmap'

export interface RecommendedNextStepsProps {
  steps?: RecommendedStepData[]
  onStepAction?: (stepId: string) => void
  className?: string
}

export function RecommendedNextSteps({
  steps = recommendedNextStepsMockData,
  onStepAction,
  className,
}: RecommendedNextStepsProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  const renderStepIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Code className="h-4 w-4 text-purple-400" aria-hidden="true" />
      case 1:
        return <Layers className="h-4 w-4 text-blue-400" aria-hidden="true" />
      case 2:
        return <BookOpen className="h-4 w-4 text-emerald-400" aria-hidden="true" />
      case 3:
      default:
        return <MessageSquareCode className="h-4 w-4 text-amber-400" aria-hidden="true" />
    }
  }

  return (
    <Card className={cn('p-3.5 sm:p-4 bg-[#121426] border border-white/10 rounded-2xl space-y-2.5 shadow-sm text-left hover:border-purple-500/30 transition-all', className)}>
      {/* Title */}
      <div className="space-y-0.5 text-left">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
          <span>Recommended Next Steps</span>
          <Sparkles className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0">
          Based on your current progress &amp; skill gaps
        </p>
      </div>

      {/* 4 Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-2"
      >
        {steps.map((step, idx) => (
          <motion.div key={step.id} variants={itemVariants} className="h-full">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#0b0c14] border border-white/10 space-y-2 flex flex-col justify-between h-full text-left hover:border-purple-500/30 transition-all">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={cn('text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block', step.tagBg)}>
                    {step.type}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                    {renderStepIcon(idx)}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight leading-snug m-0">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed m-0">
                  {step.subtitle}
                </p>
              </div>

              <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                    <span>{step.estimatedTime}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-slate-500" aria-hidden="true" />
                    <span>{step.difficulty}</span>
                  </span>
                </div>

                <Button
                  variant={step.btnVariant}
                  size="sm"
                  onClick={() => onStepAction?.(step.id)}
                  className="w-full justify-center text-xs font-semibold py-1.5 min-h-[38px] sm:min-h-[40px] rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500/50"
                  aria-label={`${step.action} for ${step.title}`}
                >
                  <span>{step.action}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  )
}
export default RecommendedNextSteps
