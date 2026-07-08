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
        'relative cursor-pointer transition-all duration-300 hover:shadow-lg border border-slate-205 dark:border-slate-855 rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/40 backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-750 font-sans text-xs select-none text-left',
        isActive
          ? 'border-brand-500 shadow-md ring-1 ring-brand-500/20'
          : ''
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

      <CardContent className="p-5 flex flex-col gap-4 text-left">
        {/* Header: Logo and Title */}
        <div className="flex items-start justify-between gap-2 text-left">
          <div className="flex items-center gap-3 text-left">
            <div
              className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0',
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-100 dark:bg-slate-855 text-slate-500 dark:text-slate-405'
              )}
            >
              <Bot size={22} className={isActive ? 'animate-bounce-slow' : ''} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-none font-display m-0">
                {agent.name}
              </h4>
              <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider mt-1.5 leading-none">
                ID: {agent.agent_id}
              </span>
            </div>
          </div>

          <AgentStatusBadge status={!isHealthy ? 'unhealthy' : execCount > 0 && isActive ? 'running' : 'healthy'} />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed m-0 text-left line-clamp-2 font-medium">
          {agent.description}
        </p>

        {/* Quick Analytics Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-55/30 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850/65 text-center font-sans">
          <div className="text-center">
            <span className="text-slate-455 dark:text-slate-500 text-[8px] block uppercase font-black tracking-wider leading-none">Executions</span>
            <span className="font-mono font-black text-xs text-slate-805 dark:text-slate-205 block mt-1 leading-none">
              {execCount}
            </span>
          </div>
          <div className="text-center">
            <span className="text-slate-455 dark:text-slate-500 text-[8px] block uppercase font-black tracking-wider leading-none">Success Rate</span>
            <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-450 block mt-1 leading-none">
              {successRate}%
            </span>
          </div>
          <div className="text-center">
            <span className="text-slate-455 dark:text-slate-500 text-[8px] block uppercase font-black tracking-wider leading-none">Avg Time</span>
            <span className="font-mono font-black text-xs text-slate-805 dark:text-slate-205 block mt-1 leading-none">
              {avgLatency}ms
            </span>
          </div>
        </div>

        {/* Capabilities footer */}
        <div className="flex flex-wrap gap-1 mt-1 text-left">
          {agent.supported_tasks.slice(0, 3).map((task) => (
            <span
              key={task}
              className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-405 rounded-lg border border-slate-200/50 dark:border-dark-border/40 font-sans leading-none"
            >
              {task}
            </span>
          ))}
          {agent.supported_tasks.length > 3 && (
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/60 text-slate-400 rounded-lg font-sans leading-none">
              +{agent.supported_tasks.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
export default AgentCard
