import React from 'react'
import { StatusBadge } from './StatusBadge'
import { SuccessProgress } from './SuccessProgress'
import { RowActionsMenu } from './RowActionsMenu'
import { HighlightText } from './SearchAgents'
import type { AgentConsoleItem } from '@/data/agentConsoleMockData'
import { Bot, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentGridViewProps {
  agents: AgentConsoleItem[]
  searchQuery?: string
  onOpenDetails: (agent: AgentConsoleItem) => void
  onTogglePause?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
  className?: string
}

export function AgentGridView({
  agents,
  searchQuery = '',
  onOpenDetails,
  onTogglePause,
  onDeleteAgent,
  className,
}: AgentGridViewProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-left',
        className
      )}
    >
      {agents.map((agent) => (
        <div
          key={agent.id}
          tabIndex={0}
          onClick={() => onOpenDetails(agent)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpenDetails(agent)
            }
          }}
          className="p-5 rounded-2xl bg-[#111322] border border-white/10 hover:border-purple-500/40 shadow-xl space-y-4 transition-all hover:-translate-y-1 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform',
                  agent.iconBg
                )}
              >
                <Bot size={20} />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <h3 className="font-bold text-white text-xs tracking-tight truncate">
                  <HighlightText text={agent.name} highlight={searchQuery} />
                </h3>
                <span className="text-[11px] font-semibold text-purple-400 font-mono">
                  {agent.category}
                </span>
              </div>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <RowActionsMenu
                agent={agent}
                onOpenDetails={onOpenDetails}
                onTogglePause={onTogglePause}
                onDeleteAgent={onDeleteAgent}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">
            <HighlightText text={agent.description} highlight={searchQuery} />
          </p>

          {/* Status Badge */}
          <div>
            <StatusBadge status={agent.status} />
          </div>

          {/* Stats Bar */}
          <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 font-medium block">Tasks</span>
              <div className="flex items-center gap-1 font-bold text-white">
                <CheckCircle2 size={13} className="text-blue-400" />
                <span>{agent.tasksCompleted}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 font-medium block">Avg Response</span>
              <div className="flex items-center gap-1 font-mono text-slate-300">
                <Clock size={13} className="text-amber-400" />
                <span>{agent.avgResponseTime}</span>
              </div>
            </div>
          </div>

          {/* Success Progress */}
          <div className="pt-1">
            <SuccessProgress rate={agent.successRate} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AgentGridView
