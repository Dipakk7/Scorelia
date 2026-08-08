import React, { useState } from 'react'
import { ExecutionLogsWorkspace } from './ExecutionLogsWorkspace'
import { AuditLogsWorkspace } from './AuditLogsWorkspace'
import { Terminal, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LogsStreamWorkspaceProps {
  initialType?: 'execution' | 'audit'
  className?: string
}

export function LogsStreamWorkspace({ initialType = 'execution', className }: LogsStreamWorkspaceProps) {
  const [logType, setLogType] = useState<'execution' | 'audit'>(initialType)

  return (
    <div className={cn('space-y-6 text-left font-sans', className)}>
      {/* Sub-Header Navigation */}
      <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-[#111322] border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLogType('execution')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
              logType === 'execution'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Terminal size={15} />
            <span>Worker Execution Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setLogType('audit')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
              logType === 'audit'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <ShieldAlert size={15} />
            <span>Security & System Audit Logs</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-purple-300 hidden sm:inline-block pr-2">
          {logType === 'execution' ? 'Real-time Telemetry Stream' : 'Audit Trail Record'}
        </span>
      </div>

      {/* Render Active Log View */}
      {logType === 'execution' ? (
        <ExecutionLogsWorkspace />
      ) : (
        <AuditLogsWorkspace />
      )}
    </div>
  )
}

export default LogsStreamWorkspace
