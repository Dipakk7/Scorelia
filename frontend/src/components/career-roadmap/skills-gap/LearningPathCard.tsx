import React from 'react'
import { ArrowDown, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { learningPathMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { LearningPathStep } from '@/types/careerRoadmap'

export interface LearningPathCardProps {
  steps?: LearningPathStep[]
  className?: string
}

export function LearningPathCard({
  steps = learningPathMockData,
  className,
}: LearningPathCardProps) {
  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-5 shadow-sm text-left', className)}>
      <div className="space-y-0.5 text-left">
        <h3 className="text-base font-bold text-white tracking-tight m-0">
          Recommended Learning Sequence Path
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0">
          Optimal prerequisite order to master skills without missing dependencies
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1
          const isCompleted = step.status === 'completed'
          const isCurrent = step.status === 'current'

          return (
            <div key={step.stepNumber} className="relative flex flex-col justify-between">
              <div
                className={cn(
                  'p-3.5 rounded-xl border space-y-2 h-full flex flex-col justify-between text-left transition-all',
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : isCurrent
                    ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-950/40'
                    : 'bg-[#0b0c14] border-white/10 opacity-75'
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center',
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                      {step.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white tracking-tight m-0 pt-1 flex items-center gap-1">
                    <span>{step.title}</span>
                    {isCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" aria-hidden="true" />}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed m-0">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting Arrow for larger screens */}
              {!isLast && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-500">
                  <ArrowRight className="h-4 w-4 text-purple-400" aria-hidden="true" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
export default LearningPathCard
