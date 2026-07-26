import React from 'react'
import { Zap, Target, CheckSquare, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { priorityMatrixMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { PriorityMatrixItem } from '@/types/careerRoadmap'

export interface PriorityMatrixProps {
  items?: PriorityMatrixItem[]
  className?: string
}

export function PriorityMatrix({
  items = priorityMatrixMockData,
  className,
}: PriorityMatrixProps) {
  const quickWins = items.filter((i) => i.quadrant === 'quick-wins')
  const strategic = items.filter((i) => i.quadrant === 'strategic')
  const fillIns = items.filter((i) => i.quadrant === 'fill-ins')
  const reevaluate = items.filter((i) => i.quadrant === 'reevaluate')

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="space-y-0.5 text-left">
        <h3 className="text-base font-bold text-white tracking-tight m-0">
          Learning Priority Matrix
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0">
          2×2 matrix evaluating skills by Learning Impact vs Implementation Effort
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Quick Wins (High Impact / Low Effort) */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-purple-400" aria-hidden="true" />
              Quick Wins
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full">
              High Impact / Low Effort
            </span>
          </div>
          <div className="space-y-1.5">
            {quickWins.map((item) => (
              <div key={item.id} className="p-2 rounded-lg bg-[#0b0c14] border border-white/10 flex items-center justify-between text-xs font-semibold text-white">
                <span>{item.name}</span>
                <span className="text-[10px] font-mono text-purple-400">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 2: Strategic Investments (High Impact / High Effort) */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="h-4 w-4 text-blue-400" aria-hidden="true" />
              Strategic Investments
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/20 px-2 py-0.5 rounded-full">
              High Impact / High Effort
            </span>
          </div>
          <div className="space-y-1.5">
            {strategic.map((item) => (
              <div key={item.id} className="p-2 rounded-lg bg-[#0b0c14] border border-white/10 flex items-center justify-between text-xs font-semibold text-white">
                <span>{item.name}</span>
                <span className="text-[10px] font-mono text-blue-400">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Fill-Ins (Low Impact / Low Effort) */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              Fill-Ins / Optional
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
              Low Impact / Low Effort
            </span>
          </div>
          <div className="space-y-1.5">
            {fillIns.map((item) => (
              <div key={item.id} className="p-2 rounded-lg bg-[#0b0c14] border border-white/10 flex items-center justify-between text-xs font-semibold text-white">
                <span>{item.name}</span>
                <span className="text-[10px] font-mono text-emerald-400">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 4: Re-evaluate (Low Impact / High Effort) */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10 space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-slate-500" aria-hidden="true" />
              Re-evaluate
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded-full">
              Low Impact / High Effort
            </span>
          </div>
          <div className="space-y-1.5">
            {reevaluate.map((item) => (
              <div key={item.id} className="p-2 rounded-lg bg-[#0b0c14] border border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{item.name}</span>
                <span className="text-[10px] font-mono text-slate-500">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
export default PriorityMatrix
