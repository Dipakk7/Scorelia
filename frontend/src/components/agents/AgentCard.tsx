import React from 'react'
import { AgentStatusBadge } from './AgentStatusBadge'
import { Bot } from 'lucide-react'
import type { AgentMetadata, AgentHealthStatus, AgentExecutionStats } from '@/types/agent'
import { cn } from '@/lib/utils'

interface AgentCardProps {
  agent: AgentMetadata
  health?: AgentHealthStatus
  stats?: AgentExecutionStats
  isActive?: boolean
  onClick?: () => void
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  health,
  stats,
  isActive = false,
  onClick,
}) => {
  const execCount = stats ? stats.execution_count : 0
  const isHealthy = health ? health.status === 'healthy' : true

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative cursor-pointer transition-all duration-200 border-b border-[var(--border)]/40 p-3 select-none text-left flex flex-col gap-2 hover:bg-[var(--surface-hover)]',
        isActive
          ? 'bg-[var(--surface-hover)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[var(--primary)]'
          : ''
      )}
    >
      {/* Header: Name and Status */}
      <div className="flex items-center justify-between gap-2 text-left">
        <div className="flex items-center gap-2 text-left min-w-0">
          <div
            className={cn(
              'h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 shrink-0 border',
              isActive
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-muted text-muted-foreground border-[var(--border)]/60'
            )}
          >
            <Bot size={15} className={isActive ? 'animate-pulse' : ''} />
          </div>
          <div className="text-left min-w-0">
            <h4 className="text-xs font-bold text-[var(--heading)] leading-tight truncate m-0 font-sans">
              {agent.name}
            </h4>
            <span className="text-[8px] text-[var(--muted)] font-mono block uppercase tracking-wider mt-0.5 leading-none">
              {agent.agent_id}
            </span>
          </div>
        </div>

        <AgentStatusBadge status={!isHealthy ? 'unhealthy' : execCount > 0 && isActive ? 'running' : 'healthy'} className="scale-90 origin-right" />
      </div>

      {/* Description */}
      <p className="text-[10px] text-[var(--muted)] leading-relaxed m-0 text-left line-clamp-2 font-sans font-medium">
        {agent.description}
      </p>

      {/* Supported Tasks Badges */}
      <div className="flex flex-wrap gap-1 mt-0.5 text-left">
        {agent.supported_tasks.slice(0, 2).map((task) => (
          <span
            key={task}
            className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--muted)] rounded border border-[var(--border)]/60 font-sans leading-none"
          >
            {task}
          </span>
        ))}
        {agent.supported_tasks.length > 2 && (
          <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--muted)] rounded border border-[var(--border)]/40 font-sans leading-none">
            +{agent.supported_tasks.length - 2}
          </span>
        )}
      </div>
    </div>
  )
}
export default AgentCard
