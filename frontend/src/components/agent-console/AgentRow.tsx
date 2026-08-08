import React, { memo } from 'react'
import { StatusBadge } from './StatusBadge'
import { SuccessProgress } from './SuccessProgress'
import { RowActionsMenu } from './RowActionsMenu'
import { HighlightText } from './SearchAgents'
import type { AgentConsoleItem } from '@/data/agentConsoleMockData'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentRowProps {
  agent: AgentConsoleItem
  searchQuery?: string
  onOpenDetails: (agent: AgentConsoleItem) => void
  onTogglePause?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
  className?: string
}

function AgentRowComponent({
  agent,
  searchQuery = '',
  onOpenDetails,
  onTogglePause,
  onDeleteAgent,
  className,
}: AgentRowProps) {
  return (
    <tr
      tabIndex={0}
      onClick={() => onOpenDetails(agent)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetails(agent)
        }
      }}
      className={cn(
        'hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors cursor-pointer border-b border-white/5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 select-none min-h-[44px]',
        className
      )}
    >
      {/* 1. Agent Name & Description */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md transition-transform group-hover:scale-105',
              agent.iconBg
            )}
          >
            <Bot size={18} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-white text-xs tracking-tight">
              <HighlightText text={agent.name || ''} highlight={searchQuery} />
            </span>
            <span className="text-[11px] text-slate-300 truncate max-w-[220px]">
              <HighlightText text={agent.description || ''} highlight={searchQuery} />
            </span>
          </div>
        </div>
      </td>

      {/* 2. Status Badge */}
      <td className="py-3.5 px-3">
        <StatusBadge status={agent.status || 'active'} />
      </td>

      {/* 3. Tasks Completed */}
      <td className="py-3.5 px-3 font-mono font-bold text-white text-xs">
        {(agent.tasksCompleted ?? 0).toLocaleString()}
      </td>

      {/* 4. Success Rate % Bar */}
      <td className="py-3.5 px-3 min-w-[130px]">
        <SuccessProgress rate={agent.successRate ?? 0} />
      </td>

      {/* 5. Avg Response Time */}
      <td className="py-3.5 px-3 font-mono text-xs text-amber-300 font-semibold">
        {agent.avgResponseTime || '0.5s'}
      </td>

      {/* 6. Category */}
      <td className="py-3.5 px-3">
        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[10px] font-semibold tracking-wide">
          <HighlightText text={agent.category || 'General'} highlight={searchQuery} />
        </span>
      </td>

      {/* 7. Last Active */}
      <td className="py-3.5 px-3 text-[11px] text-slate-300 whitespace-nowrap">
        {agent.lastActive || 'Just now'}
      </td>

      {/* 8. Quick Actions Menu */}
      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <RowActionsMenu
          agent={agent}
          onOpenDetails={() => onOpenDetails(agent)}
          onTogglePause={onTogglePause}
          onDeleteAgent={onDeleteAgent}
        />
      </td>
    </tr>
  )
}

export const AgentRow = memo(AgentRowComponent)
export default AgentRow
