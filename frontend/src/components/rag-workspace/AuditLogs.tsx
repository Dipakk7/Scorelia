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
    <div className={cn('p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <ShieldCheck size={16} className="text-purple-400" />
            Audit Trail & Security Logs
          </h3>
          <p className="text-xs text-slate-400">
            Real-time compliance audit trail of user actions, API calls, and administrative events.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter audit logs..."
              className="w-full bg-[#121320] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#121320] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success Only</option>
            <option value="warning">Warnings Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Resource Target</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">IP Address</th>
              <th className="py-2.5 px-3 text-right">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[12px]">
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedAudit(log)}
                className="hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <td className="py-3 px-3 text-slate-400 font-sans">{log.timestamp}</td>
                <td className="py-3 px-3 font-semibold text-white font-sans">{log.user}</td>
                <td className="py-3 px-3 text-purple-300 font-bold">{log.action}</td>
                <td className="py-3 px-3 text-slate-300 font-sans truncate max-w-xs">{log.resource}</td>
                <td className="py-3 px-3">{getStatusBadge(log.status)}</td>
                <td className="py-3 px-3 text-slate-400">{log.ipAddress}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-200">{log.durationMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Audit Details Modal */}
      {selectedAudit && (
        <div className="p-4 rounded-xl bg-[#121320] border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Audit Event Details — {selectedAudit.id}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedAudit(null)}
              className="text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">USER:</span>
              <span className="text-white font-bold">{selectedAudit.user}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ACTION:</span>
              <span className="text-purple-300 font-bold">{selectedAudit.action}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">IP ADDRESS:</span>
              <span className="text-slate-200">{selectedAudit.ipAddress}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">LATENCY:</span>
              <span className="text-slate-200">{selectedAudit.durationMs}ms</span>
            </div>
          </div>
          {selectedAudit.details && (
            <pre className="p-3 rounded-lg bg-[#07080e] border border-white/5 text-[11px] text-slate-300 font-mono overflow-x-auto">
              {JSON.stringify(selectedAudit.details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

export default AuditLogs
