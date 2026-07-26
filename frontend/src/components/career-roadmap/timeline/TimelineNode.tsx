import React from 'react'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PhaseStatus } from '@/types/careerRoadmap'

export interface TimelineNodeProps {
  phaseNumber: number
  status: PhaseStatus
  className?: string
}

export function TimelineNode({ phaseNumber, status, className }: TimelineNodeProps) {
  const renderNodeContent = () => {
    if (status === 'completed') {
      return (
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-950/60 ring-4 ring-[#121320] z-10 shrink-0">
          <Check className="h-5 w-5 stroke-[3]" aria-hidden="true" />
        </div>
      )
    }

    if (status === 'in-progress') {
      return (
        <div className="relative flex items-center justify-center z-10 shrink-0">
          <span className="absolute h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/40 animate-ping" />
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-blue-950/60 ring-4 ring-blue-500/30">
            {phaseNumber}
          </div>
        </div>
      )
    }

    if (status === 'upcoming') {
      return (
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-800 border-2 border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center ring-4 ring-[#121320] z-10 shrink-0">
          {phaseNumber}
        </div>
      )
    }

    return (
      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#0b0c14] border border-white/10 text-slate-500 font-medium text-xs flex items-center justify-center ring-4 ring-[#121320] z-10 shrink-0">
        <Lock className="h-4 w-4 text-slate-500" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={cn('relative flex items-center justify-center select-none', className)}>
      {renderNodeContent()}
      <span className="sr-only">Phase {phaseNumber} node status: {status}</span>
    </div>
  )
}
export default TimelineNode
