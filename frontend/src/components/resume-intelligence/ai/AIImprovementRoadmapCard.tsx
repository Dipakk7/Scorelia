import React from 'react'
import { Card } from '@/components/ui/Card'
import { Compass, CheckCircle2, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import type { AIRoadmapStep } from '@/lib/mock-ai-insights'
import { cn } from '@/lib/utils'

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
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl relative overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 shadow-xs shrink-0">
            <Compass className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Resume Optimization Roadmap
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Prioritized sequence to maximize ATS score & recruiter response rate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            +{totalScoreGain} Total Score Boost
          </span>
        </div>
      </div>

      {/* Steps Action List */}
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            onClick={() => onExecuteStep?.(step.stepNumber)}
            className="p-3.5 rounded-xl bg-[#121424]/90 border border-slate-800/80 shadow-sm hover:border-purple-500/50 hover:bg-[#17192d] hover:-translate-y-0.5 transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer"
          >
            {/* Left Content: Step Indicator & Title/Metadata */}
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Circular Step Indicator */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-300 font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs filter drop-shadow-[0_0_4px_rgba(168,85,247,0.3)]">
                {step.stepNumber}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs md:text-sm font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors truncate">
                    {step.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono shrink-0">
                    {step.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    ~{step.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content: Score Gain Pill & Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1 text-xs font-black text-emerald-400 font-mono bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-xs">
                <TrendingUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                +{step.scoreGain} pts
              </span>

              {/* Circular Ghost Button */}
              <div
                aria-label={`Execute Step ${step.stepNumber}: ${step.title}`}
                className="w-8 h-8 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-500 flex items-center justify-center transition-all duration-200 shadow-xs group-hover:scale-105 shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Est. Completion Time: <strong className="text-white font-mono">{totalTime} mins</strong></span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          Guaranteed ATS Pass Rate
        </span>
      </div>
    </Card>
  )
}

export default AIImprovementRoadmapCard

