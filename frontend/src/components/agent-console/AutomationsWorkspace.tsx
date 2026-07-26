import React, { useState, useMemo, useEffect } from 'react'
import { useAutomations } from '@/hooks/useAutomations'
import {
  type AutomationItem,
  type AutomationStatus,
} from '@/data/taskAutomationKnowledgeMockData'
import { SearchAgents } from './SearchAgents'
import { EmptyAutomationState } from './EmptyAutomationState'
import DeleteDialog from '@/components/ui/DeleteDialog'
import {
  Workflow,
  Clock,
  Power,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AutomationsWorkspaceProps {
  className?: string
}

export function AutomationsWorkspace({ className }: AutomationsWorkspaceProps) {
  const { automations: queryAutomations, toggleEnable, deleteAutomation } = useAutomations()

  const [automationsList, setAutomationsList] = useState<AutomationItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [deletingAutomation, setDeletingAutomation] = useState<AutomationItem | null>(null)

  useEffect(() => {
    if (queryAutomations && queryAutomations.length > 0) {
      setAutomationsList(queryAutomations)
    }
  }, [queryAutomations])

  const handleToggleEnable = async (id: string) => {
    setAutomationsList((prev) =>
      prev.map((auto) => {
        if (auto.id === id) {
          const nextStatus: AutomationStatus = auto.status === 'enabled' ? 'disabled' : 'enabled'
          return { ...auto, status: nextStatus }
        }
        return auto
      })
    )
    await toggleEnable(id)
  }

  const handleDeleteAutomation = async (id: string) => {
    setAutomationsList((prev) => prev.filter((a) => a.id !== id))
    setDeletingAutomation(null)
    await deleteAutomation(id)
  }

  const filteredAutomations = useMemo(() => {
    return automationsList.filter((auto) => {
      if (statusFilter !== 'all' && auto.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return auto.name.toLowerCase().includes(q) || auto.description.toLowerCase().includes(q) || auto.trigger.toLowerCase().includes(q)
      }
      return true
    })
  }, [automationsList, statusFilter, searchQuery])

  return (
    <div className={cn('space-y-5 text-left', className)}>
      {/* 1. Header Toolbar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg">
        <SearchAgents
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search automation name, trigger, or description..."
        />

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111322]">All Statuses</option>
              <option value="enabled" className="bg-[#111322] text-emerald-400">Enabled</option>
              <option value="running" className="bg-[#111322] text-purple-400">Running</option>
              <option value="paused" className="bg-[#111322] text-amber-400">Paused</option>
              <option value="disabled" className="bg-[#111322] text-slate-400">Disabled</option>
              <option value="error" className="bg-[#111322] text-rose-400">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Grid of Automation Cards */}
      {filteredAutomations.length === 0 ? (
        <EmptyAutomationState
          onResetFilters={() => {
            setSearchQuery('')
            setStatusFilter('all')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAutomations.map((auto) => (
            <div
              key={auto.id}
              className="p-5 rounded-2xl bg-[#111322] border border-white/10 hover:border-purple-500/40 shadow-xl space-y-4 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                      <Workflow size={20} />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <h3 className="font-bold text-white text-xs tracking-tight truncate">{auto.name}</h3>
                      <span className="text-[10px] font-mono text-purple-300">{auto.frequency}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {auto.status === 'enabled' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Enabled
                      </span>
                    )}
                    {auto.status === 'running' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
                        Running
                      </span>
                    )}
                    {auto.status === 'paused' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Paused
                      </span>
                    )}
                    {auto.status === 'disabled' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Disabled
                      </span>
                    )}
                    {auto.status === 'draft' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                    {auto.status === 'error' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Error
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[32px]">
                  {auto.description}
                </p>

                {/* Trigger Info */}
                <div className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Trigger:</span>
                  <span className="text-purple-300 font-mono font-semibold truncate max-w-[200px]">{auto.trigger}</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                  <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-medium">Executions</span>
                    <span className="font-extrabold text-white block">{auto.executionCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-medium">Success Rate</span>
                    <span className="font-extrabold text-emerald-400 block">{auto.successRate > 0 ? `${auto.successRate}%` : '—'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-medium">Avg Runtime</span>
                    <span className="font-extrabold text-amber-300 font-mono block">{auto.avgRuntime}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock size={12} />
                  <span>Next: <strong className="text-slate-200">{auto.nextRun}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleEnable(auto.id)}
                    className={cn(
                      'p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all',
                      auto.status === 'enabled'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    )}
                    title={auto.status === 'enabled' ? 'Disable Automation' : 'Enable Automation'}
                  >
                    <Power size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingAutomation(auto)}
                    className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer"
                    title="Delete Automation"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingAutomation && (
        <DeleteDialog
          isOpen={!!deletingAutomation}
          onClose={() => setDeletingAutomation(null)}
          onConfirm={async () => handleDeleteAutomation(deletingAutomation.id)}
          title={`Delete Automation "${deletingAutomation.name}"?`}
          description="Are you sure you want to delete this automation workflow?"
        />
      )}
    </div>
  )
}

export default AutomationsWorkspace
