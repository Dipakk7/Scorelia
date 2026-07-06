// frontend/src/components/agents/AgentSelector.tsx

import React from 'react'
import { AgentCard } from './AgentCard'
import { Cpu, Settings, ShieldAlert } from 'lucide-react'
import type { AgentMetadata, AgentHealthStatus, AgentExecutionStats } from '@/types/agent'
import { cn } from '@/lib/utils'

interface AgentSelectorProps {
  agents: AgentMetadata[]
  healthMap: Record<string, AgentHealthStatus>
  statsMap: Record<string, AgentExecutionStats>
  selectedAgentId: string | null
  onSelectAgent: (agentId: string | null) => void
  orchestrationMode: 'auto' | 'manual'
  onChangeMode: (mode: 'auto' | 'manual') => void
  className?: string
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  healthMap,
  statsMap,
  selectedAgentId,
  onSelectAgent,
  orchestrationMode,
  onChangeMode,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border/80 rounded-xl">
        <button
          onClick={() => {
            onChangeMode('auto')
            onSelectAgent(null)
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-250 cursor-pointer focus:outline-none',
            orchestrationMode === 'auto'
              ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-xs border border-slate-200 dark:border-dark-border/50'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Cpu size={14} />
          <span>Auto Orchestrator</span>
        </button>

        <button
          onClick={() => onChangeMode('manual')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-250 cursor-pointer focus:outline-none',
            orchestrationMode === 'manual'
              ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-xs border border-slate-200 dark:border-dark-border/50'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Settings size={14} />
          <span>Manual Dispatcher</span>
        </button>
      </div>

      {/* Mode Details Context Banner */}
      <div className="text-xxs p-3 rounded-lg bg-brand-50/50 dark:bg-brand-950/10 border border-brand-100/40 dark:border-brand-900/10 text-slate-500 dark:text-slate-400 leading-normal font-sans">
        {orchestrationMode === 'auto' ? (
          <p>
            <strong className="text-brand-600 dark:text-brand-400 font-semibold">Autonomous Planning Mode:</strong> The multi-agent orchestrator dynamically parses your task request, creates a Directed Acyclic Graph (DAG) workflow, and dispatches tasks to appropriate sub-agents in sequential or parallel mode.
          </p>
        ) : (
          <p>
            <strong className="text-brand-600 dark:text-brand-400 font-semibold">Single-Agent Targeting:</strong> Skip natural language intent matching and execute a specific target agent directly. Select an agent card below to assign your command.
          </p>
        )}
      </div>

      {/* Agents Card List */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[calc(100vh-320px)]">
        {agents.map((agent) => {
          const isSelected = orchestrationMode === 'manual' && selectedAgentId === agent.agent_id
          const health = healthMap[agent.agent_id]
          const stats = statsMap[agent.agent_id]

          return (
            <AgentCard
              key={agent.agent_id}
              agent={agent}
              health={health}
              stats={stats}
              isActive={isSelected || (orchestrationMode === 'auto')}
              onClick={() => {
                if (orchestrationMode === 'manual') {
                  onSelectAgent(isSelected ? null : agent.agent_id)
                }
              }}
            />
          )}
        )}

        {agents.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 dark:border-dark-border rounded-xl text-slate-400">
            <ShieldAlert size={28} className="text-slate-300 mb-2" />
            <span className="text-xs">No registered agents detected</span>
          </div>
        )}
      </div>
    </div>
  )
}
