import React, { useState, useMemo } from 'react'
import { useAuditLogs } from '@/hooks/useAuditLogs'
import type { AuditLogItem } from '@/data/administrationMockData'
import { SearchAgents } from './SearchAgents'
import { EmptyAuditState } from './EmptyAuditState'
import { Pagination } from './Pagination'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/Drawer'
import { FileText, Filter, Eye, CheckCircle2, AlertTriangle, ShieldAlert, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AuditLogsWorkspaceProps {
  className?: string
}

export function AuditLogsWorkspace({ className }: AuditLogsWorkspaceProps) {
  const { auditLogs } = useAuditLogs()

  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Drawer state
  const [selectedAudit, setSelectedAudit] = useState<AuditLogItem | null>(null)

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (severityFilter !== 'all' && log.severity !== severityFilter) return false
      if (categoryFilter !== 'all' && log.category !== categoryFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          log.user.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.target.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [auditLogs, severityFilter, categoryFilter, searchQuery])

  const totalItems = filteredLogs.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredLogs.slice(start, start + pageSize)
  }, [filteredLogs, currentPage, pageSize])

  return (
    <div className={cn('space-y-5 text-left', className)}>
      {/* 1. Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg">
        <SearchAgents
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q)
            setCurrentPage(1)
          }}
          placeholder="Search user, action, target, or details..."
        />

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111322]">All Categories</option>
              <option value="Agent" className="bg-[#111322]">Agent</option>
              <option value="Knowledge" className="bg-[#111322]">Knowledge</option>
              <option value="Automation" className="bg-[#111322]">Automation</option>
              <option value="System" className="bg-[#111322]">System</option>
              <option value="Security" className="bg-[#111322]">Security</option>
              <option value="User" className="bg-[#111322]">User</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
            <span className="text-slate-400 font-medium">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111322]">All Severities</option>
              <option value="critical" className="bg-[#111322] text-rose-400">Critical</option>
              <option value="warning" className="bg-[#111322] text-amber-400">Warning</option>
              <option value="info" className="bg-[#111322] text-blue-400">Info</option>
              <option value="notice" className="bg-[#111322] text-slate-400">Notice</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Audit Table */}
      {paginatedLogs.length === 0 ? (
        <EmptyAuditState
          onResetFilters={() => {
            setSearchQuery('')
            setCategoryFilter('all')
            setSeverityFilter('all')
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111322] shadow-xl">
          <table className="w-full min-w-[750px] text-left border-collapse font-sans text-xs">
            <thead className="bg-[#0b0c14] border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-3">User</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Target</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Severity</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">IP Address</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-200">{log.user}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-purple-300">{log.action}</td>
                  <td className="py-3.5 px-3 text-white font-medium">{log.target}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px] font-medium">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {log.severity === 'critical' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Critical
                      </span>
                    )}
                    {log.severity === 'warning' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Warning
                      </span>
                    )}
                    {log.severity === 'info' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Info
                      </span>
                    )}
                    {log.severity === 'notice' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Notice
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    {log.status === 'success' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 size={11} /> Success
                      </span>
                    )}
                    {log.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                        <AlertTriangle size={11} /> Failed
                      </span>
                    )}
                    {log.status === 'denied' && (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                        <ShieldAlert size={11} /> Denied
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAudit(log)}
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

      {/* 3. Pagination Footer */}
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

      {/* 4. Audit Log Details Drawer */}
      {selectedAudit && (
        <Drawer open={!!selectedAudit} onOpenChange={(open) => !open && setSelectedAudit(null)}>
          <DrawerContent className="bg-[#111322] border-l border-white/10 text-slate-200 max-w-lg p-6 space-y-6">
            <DrawerHeader className="space-y-1 p-0 flex items-start justify-between">
              <div>
                <DrawerTitle className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <FileText size={20} className="text-purple-400" />
                  <span>Audit Entry: {selectedAudit.id}</span>
                </DrawerTitle>
                <DrawerDescription className="text-xs text-slate-400">
                  Detailed telemetry and user action payload.
                </DrawerDescription>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
                aria-label="Close audit details"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </DrawerHeader>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Action:</span><span className="text-purple-300 font-bold">{selectedAudit.action}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">User:</span><span className="text-white">{selectedAudit.user}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Target:</span><span className="text-white">{selectedAudit.target}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Timestamp:</span><span className="text-slate-300">{selectedAudit.timestamp}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">IP Address:</span><span className="text-slate-300">{selectedAudit.ipAddress}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Duration:</span><span className="text-amber-300">{selectedAudit.duration}</span></div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Description Payload</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedAudit.details}</p>
              </div>
            </div>

            <DrawerFooter className="p-0 pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
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

export default AuditLogsWorkspace
