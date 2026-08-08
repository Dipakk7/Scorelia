import React, { useState } from 'react'
import { useAdministration } from '@/hooks/useAdministration'
import { Shield, Pause, Play, Archive, Trash2, RefreshCw, Activity, CheckCircle2, Lock, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AdministrationPanelProps {
  className?: string
}

export function AdministrationPanel({ className }: AdministrationPanelProps) {
  const { executeBulkAction, runDiagnostics, isExecutingBulk, isRunningDiagnostics } = useAdministration()
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleBulk = async (actionType: string) => {
    setFeedback(`Executing bulk action: ${actionType}...`)
    await executeBulkAction({ actionType })
    setTimeout(() => {
      setFeedback(`Bulk action "${actionType}" completed successfully!`)
      setTimeout(() => setFeedback(null), 3000)
    }, 800)
  }

  const handleDiagnostics = async () => {
    setFeedback('Running system health diagnostics...')
    const result = await runDiagnostics()
    setFeedback(result.message)
    setTimeout(() => setFeedback(null), 4000)
  }

  return (
    <div className={cn('space-y-4 sm:space-y-5 text-left font-sans w-full max-w-full min-w-0', className)}>
      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Grid: Bulk Operations & Maintenance Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* Bulk Operations (7 Columns) */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-3.5 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Shield size={16} className="text-purple-400" />
              <span>Bulk Agent Operations</span>
            </h3>
            <p className="text-xs text-slate-400">
              Apply administrative commands across all registered agents simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              type="button"
              disabled={isExecutingBulk}
              onClick={() => handleBulk('Pause All Agents')}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-amber-500/40 text-slate-200 hover:text-amber-300 flex flex-col items-center text-center space-y-1.5 transition-all cursor-pointer"
            >
              <Pause size={18} className="text-amber-400" />
              <span className="font-bold text-[11px]">Pause All Agents</span>
            </button>

            <button
              type="button"
              disabled={isExecutingBulk}
              onClick={() => handleBulk('Resume All Agents')}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 flex flex-col items-center text-center space-y-1.5 transition-all cursor-pointer"
            >
              <Play size={18} className="text-emerald-400" />
              <span className="font-bold text-[11px]">Resume All Agents</span>
            </button>

            <button
              type="button"
              disabled={isExecutingBulk}
              onClick={() => handleBulk('Refresh Knowledge Store')}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-indigo-500/40 text-slate-200 hover:text-indigo-300 flex flex-col items-center text-center space-y-1.5 transition-all cursor-pointer"
            >
              <RefreshCw size={18} className="text-indigo-400" />
              <span className="font-bold text-[11px]">Refresh Knowledge</span>
            </button>

            <button
              type="button"
              disabled={isExecutingBulk}
              onClick={() => handleBulk('Archive Inactive Agents')}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-blue-500/40 text-slate-200 hover:text-blue-300 flex flex-col items-center text-center space-y-1.5 transition-all cursor-pointer"
            >
              <Archive size={18} className="text-blue-400" />
              <span className="font-bold text-[11px]">Archive Inactive</span>
            </button>

            <button
              type="button"
              disabled={isExecutingBulk}
              onClick={() => handleBulk('Clear Error Queues')}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-purple-500/40 text-slate-200 hover:text-purple-300 flex flex-col items-center text-center space-y-1.5 transition-all cursor-pointer"
            >
              <Trash2 size={18} className="text-purple-400" />
              <span className="font-bold text-[11px]">Clear Error Queue</span>
            </button>

            <button
              type="button"
              disabled={isRunningDiagnostics}
              onClick={handleDiagnostics}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 flex flex-col items-center text-center space-y-1.5 transition-all cursor-pointer"
            >
              <Activity size={18} className="text-cyan-400" />
              <span className="font-bold text-[11px]">Run Diagnostics</span>
            </button>
          </div>
        </div>

        {/* Permission Overview (5 Columns) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <UserCheck size={16} className="text-emerald-400" />
              <span>Permission Overview</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
              Admin Authorized
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Current User Role:</span>
              <span className="font-bold text-purple-300 font-mono">Senior AI Ops Admin</span>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Granted Scope Permissions</span>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Agent CRUD</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Queue Control</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Vector Sync</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Report Export</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Restricted Actions</span>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Lock size={12} className="text-amber-400 shrink-0" />
                <span>Root Infrastructure Provisioning (Requires Security Lead)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdministrationPanel
