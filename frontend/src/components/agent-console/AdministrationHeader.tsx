import React from 'react'
import { Shield, Server, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AdministrationHeaderProps {
  className?: string
}

export function AdministrationHeader({ className }: AdministrationHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Logs, Reports & Administration</span>
          <span className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Shield size={16} />
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Review audit history, generate reports, manage exports, and perform administrative operations.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs font-semibold select-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 size={12} />
          <span>Audit Enabled</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
          <Server size={12} className="text-purple-400" />
          <span>Backend Connected</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Data</span>
        </span>
      </div>
    </div>
  )
}

export default AdministrationHeader
