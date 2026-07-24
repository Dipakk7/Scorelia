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
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg relative overflow-hidden">
      {/* Glow background highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
              AI Recruiter Simulation
            </h3>
            <p className="text-[11px] text-slate-400">
              Simulated evaluation by Fortune 500 tech recruiters
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
          <ThumbsUp className="w-3 h-3" />
          {currentSim.sentiment || 'Very Positive'}
        </span>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-4 relative z-10">
        {/* Rating */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <span className="text-xl md:text-2xl font-extrabold text-white font-mono">
            {currentSim.overallRating || 4.8}
            <span className="text-xs text-slate-400 font-normal">/5.0</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Recruiter Rating</span>
        </div>

        {/* Interview Probability */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <span className="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono">
            {currentSim.wouldInterviewPercentage || 88}%
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Interview Likelihood</span>
        </div>

        {/* Reading Time */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xl md:text-2xl font-extrabold text-white font-mono">
              {currentSim.readingTimeSeconds || 22}s
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Avg Skim Speed</span>
        </div>
      </div>

      {/* Executive Tone Bar */}
      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between mb-4 relative z-10">
        <span className="text-xs text-slate-300 font-medium">Perceived Seniority Level:</span>
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-slate-200 truncate">
            {currentSim.toneRating || 'Senior Executive'}
          </span>
        </div>
      </div>

      {/* Recruiter Feedback Strengths & Concerns Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Strengths */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs font-bold text-emerald-400 block mb-2">Recruiter Highlights</span>
          <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
            {strengthsList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concerns */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs font-bold text-amber-400 block mb-2">Recruiter Flags</span>
          <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
            {concernsList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default AIRecruiterSimulationCard
