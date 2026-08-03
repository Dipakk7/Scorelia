import React from 'react'
import { Card } from '@/components/ui/Card'
import { Compass, CheckCircle2, ArrowRight, Clock, TrendingUp, ShieldCheck } from 'lucide-react'
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
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/35 text-purple-300 shadow-xs shrink-0 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
            <Compass className="w-4.5 h-4.5 text-purple-300" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-white tracking-tight">
              Resume Optimization Roadmap
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Prioritized sequence to maximize ATS score & recruiter response rate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-xs font-black text-emerald-300 font-mono bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 rounded-full shadow-md shadow-emerald-950/30 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            +{totalScoreGain} Total Score Boost
          </span>
        </div>
      </div>

      {/* Steps Action Timeline List */}
      <div className="relative flex flex-col gap-3.5 flex-1 justify-center">
        {/* Subtle Vertical Timeline Connector Line */}
        <div className="absolute left-[33px] md:left-[37px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-500/40 via-purple-600/20 to-slate-800/40 pointer-events-none opacity-50 z-0" />

        {steps.map((step) => (
          <div
            key={step.stepNumber}
            onClick={() => onExecuteStep?.(step.stepNumber)}
            className="relative z-10 p-4 rounded-2xl bg-[#121424]/95 border border-slate-800/90 shadow-sm hover:border-purple-500/50 hover:bg-[#16182c] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 group flex items-center justify-between gap-3.5 cursor-pointer"
          >
            {/* Left Content: Step Indicator Node & Title/Metadata */}
            <div className="flex items-center gap-3.5 min-w-0">
              {/* 40px Circular Step Indicator Node */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/30 via-purple-700/20 to-indigo-700/30 border border-purple-500/40 text-purple-300 font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-sm filter drop-shadow-[0_0_6px_rgba(168,85,247,0.4)] group-hover:scale-105 group-hover:border-purple-400 group-hover:text-white transition-all">
                {step.stepNumber}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm md:text-base font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors truncate">
                    {step.title}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono shrink-0">
                    {step.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono font-medium mt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ~{step.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content: Score Gain Pill & Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-300 font-mono bg-emerald-950/40 border border-emerald-500/35 px-3 py-1 rounded-full shadow-xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                +{step.scoreGain} pts
              </span>

              {/* Circular Action Button */}
              <div
                aria-label={`Execute Step ${step.stepNumber}: ${step.title}`}
                className="w-9 h-9 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-400 flex items-center justify-center transition-all duration-200 shadow-xs group-hover:scale-105 group-hover:rotate-6 shrink-0"
              >
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Est. Completion Time: <strong className="text-white font-mono text-xs">{totalTime} mins</strong></span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          Guaranteed ATS Pass Rate
        </span>
      </div>
    </Card>
  )
}

export default AIImprovementRoadmapCard


