import React from 'react'
import { Card } from '@/components/ui/Card'
import { Compass, CheckCircle2, ArrowRight, Clock } from 'lucide-react'
import type { AIRoadmapStep } from '@/lib/mock-ai-insights'

interface AIImprovementRoadmapCardProps {
  steps?: AIRoadmapStep[]
  onExecuteStep?: (stepNumber: number) => void
}

const defaultSteps: AIRoadmapStep[] = [
  {
    stepNumber: 1,
    title: 'Optimize Professional Summary',
    scoreGain: 6,
    estimatedMinutes: 3,
    category: 'Summary',
  },
  {
    stepNumber: 2,
    title: 'Insert Critical Cloud & MLOps Keywords',
    scoreGain: 4,
    estimatedMinutes: 2,
    category: 'Keywords',
  },
  {
    stepNumber: 3,
    title: 'Quantify Work Experience Achievements',
    scoreGain: 5,
    estimatedMinutes: 5,
    category: 'Experience',
  },
  {
    stepNumber: 4,
    title: 'Refine Project Technical Descriptions',
    scoreGain: 3,
    estimatedMinutes: 4,
    category: 'Projects',
  },
]

export const AIImprovementRoadmapCard: React.FC<AIImprovementRoadmapCardProps> = ({
  steps = defaultSteps,
  onExecuteStep,
}) => {
  const totalScoreGain = steps.reduce((acc, curr) => acc + curr.scoreGain, 0)
  const totalTime = steps.reduce((acc, curr) => acc + curr.estimatedMinutes, 0)

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
            <Compass className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
              Resume Optimization Roadmap
            </h3>
            <p className="text-[11px] text-slate-400">
              Prioritized sequence to maximize ATS score & recruiter response rate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            +{totalScoreGain} Total Score Boost
          </span>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700/80 transition-all group"
          >
            <div className="flex items-center gap-3">
              {/* Step Number Circle */}
              <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 font-extrabold text-xs flex items-center justify-center font-mono shrink-0">
                {step.stepNumber}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100 tracking-tight">
                    {step.title}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {step.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    ~{step.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                +{step.scoreGain} pts
              </span>

              <button
                onClick={() => onExecuteStep?.(step.stepNumber)}
                className="p-1.5 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white hover:bg-purple-600/30 transition-all cursor-pointer"
                title="Execute Step"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span>Estimated completion time: <strong className="text-slate-200">{totalTime} mins</strong></span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Guaranteed ATS Pass Rate
        </span>
      </div>
    </Card>
  )
}

export default AIImprovementRoadmapCard
