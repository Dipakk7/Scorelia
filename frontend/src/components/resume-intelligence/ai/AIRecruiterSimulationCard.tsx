import React from 'react'
import { Card } from '@/components/ui/Card'
import { UserCheck, Clock, Award, CheckCircle2, AlertTriangle, ThumbsUp } from 'lucide-react'
import type { AIRecruiterSimulation } from '@/lib/mock-ai-insights'

interface AIRecruiterSimulationCardProps {
  simulation?: AIRecruiterSimulation
}

const defaultSimulation: AIRecruiterSimulation = {
  overallRating: 4.8,
  wouldInterviewPercentage: 88,
  readingTimeSeconds: 22,
  toneRating: 'Senior Executive',
  sentiment: 'Very Positive',
  strengths: [
    'Immediate clarity on ML engineering stack',
    'Demonstrated ownership of high-scale systems',
    'Strong academic baseline with clear project proof',
  ],
  concerns: [
    'Lacks explicit mention of cross-functional team leadership',
    'Could highlight budget or revenue impact more clearly',
  ],
}

export const AIRecruiterSimulationCard: React.FC<AIRecruiterSimulationCardProps> = ({
  simulation = defaultSimulation,
}) => {
  const currentSim = simulation || defaultSimulation
  const strengthsList = currentSim?.strengths || defaultSimulation.strengths
  const concernsList = currentSim?.concerns || defaultSimulation.concerns

  return (
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl relative overflow-hidden select-none">
      {/* Subtle Glow background highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 relative z-10 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/35 text-purple-300 shadow-xs shrink-0 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.35)]">
            <UserCheck className="w-4.5 h-4.5 text-purple-300" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-white tracking-tight">
              AI Recruiter Simulation
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Simulated evaluation by Fortune 500 tech recruiters
            </p>
          </div>
        </div>

        {/* AI Verdict Chip */}
        <span className="flex items-center gap-1.5 text-xs font-black text-emerald-300 font-mono bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 rounded-full shadow-md shadow-emerald-950/30 shrink-0 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]">
          <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
          {currentSim.sentiment || 'Very Positive'}
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-3 gap-3.5 mb-4 relative z-10">
        {/* Recruiter Rating */}
        <div className="p-4 rounded-xl bg-[#121424]/95 border border-slate-800/90 flex flex-col items-center justify-center text-center shadow-sm hover:border-slate-700/90 hover:bg-[#16182c] hover:-translate-y-0.5 transition-all duration-200 group">
          <span className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight leading-none">
            {currentSim.overallRating || 4.8}
            <span className="text-xs text-slate-400 font-normal ml-0.5">/5.0</span>
          </span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono mt-1.5">
            Recruiter Rating
          </span>
        </div>

        {/* Interview Likelihood */}
        <div className="p-4 rounded-xl bg-[#121424]/95 border border-slate-800/90 flex flex-col items-center justify-center text-center shadow-sm hover:border-slate-700/90 hover:bg-[#16182c] hover:-translate-y-0.5 transition-all duration-200 group">
          <span className="text-2xl md:text-3xl font-black text-emerald-400 font-mono tracking-tight leading-none">
            {currentSim.wouldInterviewPercentage || 88}%
          </span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono mt-1.5">
            Interview Likelihood
          </span>
        </div>

        {/* Reading Time */}
        <div className="p-4 rounded-xl bg-[#121424]/95 border border-slate-800/90 flex flex-col items-center justify-center text-center shadow-sm hover:border-slate-700/90 hover:bg-[#16182c] hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center gap-1.5 leading-none">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
              {currentSim.readingTimeSeconds || 22}s
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono mt-1.5">
            Avg Skim Speed
          </span>
        </div>
      </div>

      {/* Perceived Seniority Classification Ribbon */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#141228] via-[#1a1735] to-[#141228] border border-purple-500/35 flex items-center justify-between mb-4 relative z-10 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300">
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-extrabold text-slate-200">Perceived Seniority Level:</span>
        </div>
        <span className="text-xs font-black text-white font-mono bg-purple-600/30 border border-purple-500/50 px-3 py-1 rounded-full shadow-xs">
          {currentSim.toneRating || 'Senior Executive'}
        </span>
      </div>

      {/* Recruiter Feedback Strengths & Concerns Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Strengths */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#121424]/95 border border-slate-800/90 border-l-4 border-l-emerald-500 shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <span className="text-xs font-extrabold text-emerald-400 block uppercase tracking-wider font-mono mb-3">
            Recruiter Highlights
          </span>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-200 font-medium">
            {strengthsList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concerns */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#121424]/95 border border-slate-800/90 border-l-4 border-l-amber-500 shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <span className="text-xs font-extrabold text-amber-400 block uppercase tracking-wider font-mono mb-3">
            Recruiter Flags
          </span>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-200 font-medium">
            {concernsList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default AIRecruiterSimulationCard

