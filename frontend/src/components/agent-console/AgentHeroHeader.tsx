import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentHeroHeaderProps {
  className?: string
}

export function AgentHeroHeader({ className }: AgentHeroHeaderProps) {
  return (
    <div className={cn('flex flex-col text-left space-y-1.5', className)}>
      <div className="flex items-center gap-2.5 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <span>Agent Console</span>
          <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-sm shadow-purple-950/50">
            <Sparkles size={18} className="animate-pulse" />
          </span>
        </h1>
      </div>
      <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-normal leading-relaxed">
        Manage, monitor, and optimize your AI agents to automate your workflow.
      </p>
    </div>
  )
}

export default AgentHeroHeader
