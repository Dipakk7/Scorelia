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
      <div className="flex items-center justify-between p-1 bg-muted border border-border rounded-xl">
        <button
          onClick={() => {
            onChangeMode('auto')
            onSelectAgent(null)
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer focus:outline-none border-none bg-transparent',
            orchestrationMode === 'auto'
              ? 'bg-card text-brand-500 shadow-xs border border-border'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Cpu size={14} />
          <span>Auto Orchestrator</span>
        </button>

        <button
          onClick={() => onChangeMode('manual')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer focus:outline-none border-none bg-transparent',
            orchestrationMode === 'manual'
              ? 'bg-card text-brand-500 shadow-xs border border-border'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Settings size={14} />
          <span>Manual Dispatcher</span>
        </button>
      </div>

      {/* Mode Details Context Banner */}
      <div className="text-[10px] p-3 rounded-xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/10 dark:border-brand-500/10 text-muted-foreground leading-normal font-sans font-medium text-left select-none">
        {orchestrationMode === 'auto' ? (
          <p className="m-0 leading-relaxed">
            <strong className="text-brand-600 dark:text-brand-405 font-black uppercase tracking-wider block mb-1">Autonomous Planning Mode</strong> The multi-agent orchestrator dynamically parses your task request, creates a Directed Acyclic Graph (DAG) workflow, and dispatches tasks to appropriate sub-agents in sequential or parallel mode.
          </p>
        ) : (
          <p className="m-0 leading-relaxed">
            <strong className="text-brand-600 dark:text-brand-405 font-black uppercase tracking-wider block mb-1">Single-Agent Targeting</strong> Skip natural language intent matching and execute a specific target agent directly. Select an agent card below to assign your command.
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
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-2xl text-muted-foreground bg-card/70 backdrop-blur-md">
            <ShieldAlert size={24} className="text-slate-400 mb-2 animate-bounce" />
            <span className="text-xs font-bold leading-none">No registered agents detected</span>
          </div>
        )}
      </div>
    </div>
  )
}
export default AgentSelector
