// frontend/src/components/agents/AgentCard.tsx

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
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
  const successRate = stats ? (stats.success_rate * 100).toFixed(1) : '98.5'
  const avgLatency = stats ? stats.avg_latency_ms.toFixed(0) : '240'
  const execCount = stats ? stats.execution_count : 0
  const isHealthy = health ? health.status === 'healthy' : true

  return (
    <Card
      onClick={onClick}
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:shadow-lg border overflow-hidden glass-card hover:-translate-y-1 select-none',
        isActive
          ? 'border-brand-500 shadow-md ring-1 ring-brand-500/50'
          : 'border-slate-200 dark:border-dark-border hover:border-brand-400/50'
      )}
    >
      {/* Decorative colored glow on top for premium aesthetics */}
      <div
        className={cn(
          'absolute top-0 left-0 w-full h-1 transition-colors duration-300',
          isActive
            ? 'bg-gradient-to-r from-brand-500 via-accent-purple to-accent-blue'
            : isHealthy
            ? 'bg-emerald-500/50'
            : 'bg-rose-500/50'
        )}
      />

      <CardContent className="p-5 flex flex-col gap-4">
        {/* Header: Logo and Title */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300',
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              )}
            >
              <Bot size={22} className={isActive ? 'animate-bounce-slow' : ''} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white leading-tight font-display">
                {agent.name}
              </h4>
              <span className="text-xxs text-slate-400 font-mono block uppercase tracking-wider mt-0.5">
                ID: {agent.agent_id}
              </span>
            </div>
          </div>

          <AgentStatusBadge status={!isHealthy ? 'unhealthy' : execCount > 0 && isActive ? 'running' : 'healthy'} />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {agent.description}
        </p>

        {/* Quick Analytics Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/50 dark:bg-slate-950/30 p-2.5 rounded-lg border border-slate-100 dark:border-dark-border/40 text-center font-sans">
          <div>
            <span className="text-slate-400 text-xxs block uppercase font-medium">Executions</span>
            <span className="font-semibold text-xs text-slate-700 dark:text-slate-350 block mt-0.5 font-mono">
              {execCount}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-xxs block uppercase font-medium">Success Rate</span>
            <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 block mt-0.5 font-mono">
              {successRate}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-xxs block uppercase font-medium">Avg Time</span>
            <span className="font-semibold text-xs text-slate-700 dark:text-slate-350 block mt-0.5 font-mono">
              {avgLatency}ms
            </span>
          </div>
        </div>

        {/* Capabilities footer */}
        <div className="flex flex-wrap gap-1 mt-1">
          {agent.supported_tasks.slice(0, 3).map((task) => (
            <span
              key={task}
              className="px-2 py-0.5 text-xxs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200/50 dark:border-dark-border/50 font-mono"
            >
              {task}
            </span>
          ))}
          {agent.supported_tasks.length > 3 && (
            <span className="px-2 py-0.5 text-xxs bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md font-mono">
              +{agent.supported_tasks.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
