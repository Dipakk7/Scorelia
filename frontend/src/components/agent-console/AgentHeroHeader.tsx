import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentHeroHeaderProps {
  className?: string
}

export function AgentHeroHeader({ className }: AgentHeroHeaderProps) {
  return (
    <div className={cn('flex flex-col text-left space-y-1', className)}>
      <div className="flex items-center gap-2.5 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Agent Console</span>
          <span className="inline-flex items-center justify-center p-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-sm">
            <Sparkles size={16} className="animate-pulse" />
          </span>
        </h1>
      </div>
      <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-normal">
        Manage, monitor, and optimize your autonomous AI agent fleet and execution queue.
      </p>
    </div>
  )
}

export default AgentHeroHeader
