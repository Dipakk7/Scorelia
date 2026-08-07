import React, { useState } from 'react'
import { ShieldCheck, Search, Filter, Clock, User, CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react'
import type { AuditLogItem, AuditActionStatus } from '@/data/ragReportsMockData'
import { cn } from '@/lib/utils'

export interface AuditLogsProps {
  logs: AuditLogItem[]
  className?: string
}

export function AuditLogs({ logs, className }: AuditLogsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AuditActionStatus | 'all'>('all')
  const [selectedAudit, setSelectedAudit] = useState<AuditLogItem | null>(null)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchQuery ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: AuditActionStatus) => {
    if (status === 'success') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={11} />
          SUCCESS
        </span>
      )
    }
    if (status === 'warning') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
          <AlertCircle size={11} />
          WARNING
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
        <XCircle size={11} />
        FAILED
      </span>
    )
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4 select-none', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--heading)] uppercase tracking-wider flex items-center gap-2 font-sans">
            <ShieldCheck size={16} className="text-purple-400" />
            Audit Trail & Security Logs
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Real-time compliance audit trail of user actions, API calls, and administrative events.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <Search size={14} className="absolute left-3 top-2.5 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter audit logs..."
              className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--heading)] placeholder-[var(--muted)] focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 text-xs text-[var(--heading)] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success Only</option>
            <option value="warning">Warnings Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-[var(--heading)]">
          <thead>
            <tr className="border-b border-[var(--border)] text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider bg-[var(--surface-hover)]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Resource Target</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">IP Address</th>
              <th className="py-2.5 px-3 text-right">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-mono text-[12px]">
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedAudit(log)}
                className="hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <td className="py-3 px-3 text-[var(--muted)] font-sans">{log.timestamp}</td>
                <td className="py-3 px-3 font-semibold text-[var(--heading)] font-sans">{log.user}</td>
                <td className="py-3 px-3 text-purple-400 font-bold">{log.action}</td>
                <td className="py-3 px-3 text-[var(--heading)] font-sans truncate max-w-xs">{log.resource}</td>
                <td className="py-3 px-3">{getStatusBadge(log.status)}</td>
                <td className="py-3 px-3 text-[var(--muted)]">{log.ipAddress}</td>
                <td className="py-3 px-3 text-right font-bold text-[var(--heading)]">{log.durationMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Audit Details Modal */}
      {selectedAudit && (
        <div className="p-4 rounded-xl bg-[var(--surface-hover)] border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h4 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
              Audit Event Details — {selectedAudit.id}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedAudit(null)}
              className="text-[var(--muted)] hover:text-[var(--heading)] border-none bg-transparent cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-[var(--muted)] block text-[10px]">USER:</span>
              <span className="text-[var(--heading)] font-bold">{selectedAudit.user}</span>
            </div>
            <div>
              <span className="text-[var(--muted)] block text-[10px]">ACTION:</span>
              <span className="text-purple-400 font-bold">{selectedAudit.action}</span>
            </div>
            <div>
              <span className="text-[var(--muted)] block text-[10px]">IP ADDRESS:</span>
              <span className="text-[var(--heading)]">{selectedAudit.ipAddress}</span>
            </div>
            <div>
              <span className="text-[var(--muted)] block text-[10px]">LATENCY:</span>
              <span className="text-[var(--heading)]">{selectedAudit.durationMs}ms</span>
            </div>
          </div>
          {selectedAudit.details && (
            <pre className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[var(--heading)] font-mono overflow-x-auto">
              {JSON.stringify(selectedAudit.details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

export default AuditLogs

