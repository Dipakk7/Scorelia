import React from 'react'
import { useAgents } from '@/hooks/useAgents'
import { useTasks } from '@/hooks/useTasks'
import { Bot, Play, CheckCircle2, AlertCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OverviewSummaryCardProps {
  onNavigateTab?: (tabId: string) => void
  className?: string
}

export function OverviewSummaryCard({ className }: OverviewSummaryCardProps) {
  const { agents } = useAgents()
  const { tasks } = useTasks()

  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'running')
  const runningTasks = tasks.filter((t) => t.status === 'running')
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'queued')

  return (
    <div className={cn('space-y-5 sm:space-y-6 text-left font-sans', className)}>
      {/* Active Agents Fleet Summary */}
      <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">Active AI Agent Fleet</h3>
              <p className="text-xs text-slate-400">Live operational state of deployed agents</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
            {activeAgents.length} / {agents.length} Online
          </span>
        </div>

        {/* Highlighted Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.slice(0, 6).map((agent) => (
            <div
              key={agent.id}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2.5 hover:border-purple-500/30 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center text-white text-[11px] shrink-0 shadow-md', agent.iconBg || 'bg-purple-600')}>
                    <Bot size={14} />
                  </div>
                  <div className="truncate min-w-0">
                    <span className="font-bold text-slate-200 text-xs truncate block">{agent.name}</span>
                    <span className="text-[10px] text-purple-300 font-mono font-medium block truncate">{agent.category}</span>
                  </div>
                </div>

                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0',
                  agent.status === 'active' || agent.status === 'running'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                )}>
                  {agent.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                <span>Tasks: <strong className="text-white font-bold">{agent.tasksCompleted != null ? agent.tasksCompleted.toLocaleString() : '0'}</strong></span>
                <span>Success: <strong className="text-emerald-400 font-bold">{agent.status === 'offline' ? '—' : (agent.successRate != null ? `${agent.successRate}%` : '—')}</strong></span>
                <span>Latency: <strong className="text-purple-300 font-bold">{agent.status === 'offline' ? '—' : (agent.avgResponseTime && agent.avgResponseTime !== '—' ? agent.avgResponseTime : '—')}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Task Execution Status Highlights */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">Real-Time Execution Queue</h3>
              <p className="text-xs text-slate-400">Active worker tasks currently executing in system pool</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {runningTasks.length} Running
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {pendingTasks.length} Queued
            </span>
          </div>
        </div>

        {/* Task List Snippet */}
        <div className="space-y-2.5">
          {tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  {task.status === 'running' ? (
                    <Play size={14} className="text-purple-400 animate-pulse shrink-0" />
                  ) : task.status === 'completed' ? (
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle size={14} className="text-amber-400 shrink-0" />
                  )}
                  <div className="truncate">
                    <span className="font-bold text-white block truncate">{task.name}</span>
                    <span className="text-[11px] text-purple-300 font-medium">Assigned: {task.assignedAgent}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                  <span className="font-bold text-slate-200">{task.progress}%</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">{task.estimatedDuration}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    task.status === 'failed'
                      ? 'bg-rose-500'
                      : task.progress === 100
                      ? 'bg-emerald-400'
                      : 'bg-purple-500'
                  )}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OverviewSummaryCard
