import React, { useState, useMemo } from 'react'
import { useExecutionLogs } from '@/hooks/useExecutionLogs'
import type { ExecutionLogItem } from '@/data/administrationMockData'
import { SearchAgents } from './SearchAgents'
import { EmptyExecutionState } from './EmptyExecutionState'
import { Pagination } from './Pagination'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/Drawer'
import { Terminal, CheckCircle2, AlertTriangle, Play, XCircle, Eye, Cpu, HardDrive, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ExecutionLogsWorkspaceProps {
  className?: string
}

export function ExecutionLogsWorkspace({ className }: ExecutionLogsWorkspaceProps) {
  const { executionLogs } = useExecutionLogs()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Drawer state
  const [selectedExec, setSelectedExec] = useState<ExecutionLogItem | null>(null)

  const filteredLogs = useMemo(() => {
    return executionLogs.filter((log) => {
      if (statusFilter !== 'all' && log.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          log.agentName.toLowerCase().includes(q) ||
          log.taskName.toLowerCase().includes(q) ||
          (log.failureReason && log.failureReason.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [executionLogs, statusFilter, searchQuery])

  const totalItems = filteredLogs.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredLogs.slice(start, start + pageSize)
  }, [filteredLogs, currentPage, pageSize])

  return (
    <div className={cn('space-y-5 text-left', className)}>
      {/* Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg">
        <SearchAgents
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q)
            setCurrentPage(1)
          }}
          placeholder="Search agent name, task name, or failure reasons..."
        />

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111322]">All Statuses</option>
              <option value="completed" className="bg-[#111322] text-emerald-400">Completed</option>
              <option value="running" className="bg-[#111322] text-purple-400">Running</option>
              <option value="failed" className="bg-[#111322] text-rose-400">Failed</option>
              <option value="cancelled" className="bg-[#111322] text-slate-400">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Execution Logs Table */}
      {paginatedLogs.length === 0 ? (
        <EmptyExecutionState
          onResetFilters={() => {
            setSearchQuery('')
            setStatusFilter('all')
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111322] shadow-xl">
          <table className="w-full min-w-[750px] text-left border-collapse font-sans text-xs">
            <thead className="bg-[#0b0c14] border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <tr>
                <th className="py-3.5 px-4">Task & Agent</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Duration</th>
                <th className="py-3.5 px-3">Tokens Used</th>
                <th className="py-3.5 px-3">CPU / RAM</th>
                <th className="py-3.5 px-3">Retries</th>
                <th className="py-3.5 px-3">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{log.taskName}</span>
                    <span className="text-[11px] text-purple-300 font-medium">{log.agentName}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    {log.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 size={11} /> Completed
                      </span>
                    )}
                    {log.status === 'running' && (
                      <span className="inline-flex items-center gap-1 text-purple-300 font-semibold text-[11px]">
                        <Play size={11} className="animate-pulse" /> Running
                      </span>
                    )}
                    {log.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                        <AlertTriangle size={11} /> Failed
                      </span>
                    )}
                    {log.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                        <XCircle size={11} /> Cancelled
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-amber-300">{log.duration}</td>
                  <td className="py-3.5 px-3 font-mono text-purple-300 font-bold">{log.tokensUsed.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-[11px] font-mono text-slate-400">{log.cpuUtilization} / {log.memoryUsage}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-300">{log.retryCount}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedExec(log)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Inspect Details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
        />
      )}

      {/* Execution Details Drawer */}
      {selectedExec && (
        <Drawer open={!!selectedExec} onOpenChange={(open) => !open && setSelectedExec(null)}>
          <DrawerContent className="bg-[#111322] border-l border-white/10 text-slate-200 max-w-lg p-6 space-y-6">
            <DrawerHeader className="space-y-1 p-0 flex items-start justify-between">
              <div>
                <DrawerTitle className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal size={20} className="text-purple-400" />
                  <span>Execution Trace: {selectedExec.id}</span>
                </DrawerTitle>
                <DrawerDescription className="text-xs text-slate-400">
                  Detailed worker thread telemetry and resource consumption.
                </DrawerDescription>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExec(null)}
                aria-label="Close trace details"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </DrawerHeader>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Task Name:</span><span className="text-white font-bold">{selectedExec.taskName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Assigned Agent:</span><span className="text-purple-300">{selectedExec.agentName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tokens Consumed:</span><span className="text-emerald-400 font-bold">{selectedExec.tokensUsed.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">CPU Load:</span><span className="text-slate-200">{selectedExec.cpuUtilization}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">RAM Memory:</span><span className="text-slate-200">{selectedExec.memoryUsage}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Retries Attempted:</span><span className="text-amber-300">{selectedExec.retryCount}</span></div>
              </div>

              {selectedExec.failureReason && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Failure Exception Trace</span>
                  <p className="text-xs font-mono">{selectedExec.failureReason}</p>
                </div>
              )}
            </div>

            <DrawerFooter className="p-0 pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedExec(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Drawer
              </button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

export default ExecutionLogsWorkspace
