import React from 'react'
import { AgentRow } from './AgentRow'
import type { AgentConsoleItem } from '@/data/agentConsoleMockData'
import { cn } from '@/lib/utils'

export interface AgentsTableProps {
  agents: AgentConsoleItem[]
  searchQuery?: string
  onOpenDetails: (agent: AgentConsoleItem) => void
  onTogglePause?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
  className?: string
}

export function AgentsTable({
  agents,
  searchQuery = '',
  onOpenDetails,
  onTogglePause,
  onDeleteAgent,
  className,
}: AgentsTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-2xl border border-white/10 shadow-xl bg-[#111322]', className)}>
      <table className="w-full text-left border-collapse font-sans">
        <thead className="sticky top-0 z-10 bg-[#0b0c14] border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
          <tr>
            <th scope="col" className="py-3.5 px-4">Agent</th>
            <th scope="col" className="py-3.5 px-3">Status</th>
            <th scope="col" className="py-3.5 px-3">Tasks</th>
            <th scope="col" className="py-3.5 px-3">Success Rate</th>
            <th scope="col" className="py-3.5 px-3">Avg Response</th>
            <th scope="col" className="py-3.5 px-3">Credits</th>
            <th scope="col" className="py-3.5 px-3">Last Active</th>
            <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-xs text-slate-300">
          {agents.map((agent) => (
            <AgentRow
              key={agent.id}
              agent={agent}
              searchQuery={searchQuery}
              onOpenDetails={onOpenDetails}
              onTogglePause={onTogglePause}
              onDeleteAgent={onDeleteAgent}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AgentsTable
