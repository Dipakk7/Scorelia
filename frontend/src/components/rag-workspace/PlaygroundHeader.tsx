import React from 'react'
import { Terminal, Database, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PlaygroundHeaderProps {
  currentCollection?: string
  statusText?: string
  className?: string
}

export function PlaygroundHeader({
  currentCollection = 'AI Research Papers',
  statusText = 'Ready',
  className
}: PlaygroundHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
          <Terminal className="w-5 h-5 text-purple-400 shrink-0" />
          Query Playground
        </h2>
        <p className="text-xs text-slate-400">
          Experiment with retrieval settings before running production queries.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Current Collection Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
          <Database size={13} className="shrink-0" />
          <span>{currentCollection}</span>
        </div>

        {/* Search Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  )
}

export default PlaygroundHeader
