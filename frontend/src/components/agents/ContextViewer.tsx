import React from 'react'
import { Compass, User, Key, Settings, Cpu } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

interface ContextViewerProps {
  sessionId: string | null
  correlationId?: string | null
  className?: string
}

export const ContextViewer: React.FC<ContextViewerProps> = ({
  sessionId,
  correlationId,
  className,
}) => {
  const { user } = useAuth()

  return (
    <div className={cn('flex flex-col h-full text-left font-sans text-xs bg-transparent', className)}>
      {/* Header Panel */}
      <div className="pb-3 border-b border-[var(--border)]/60 flex items-center justify-between gap-4 flex-shrink-0 select-none">
        <div className="flex items-center gap-2 text-left">
          <Compass size={15} className="text-[var(--primary)] animate-pulse" />
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
              Operations Context Panel
            </h4>
            <span className="text-[8px] text-[var(--muted)] font-sans block mt-1.5 leading-none">
              Live runtime variables mapping orchestrator context
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4.5 flex-grow overflow-y-auto pr-1 mt-4 text-left min-h-0 scrollbar-thin">
        {/* User Context */}
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[var(--muted)] text-[8px] font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-[var(--border)]/40 pb-1.5 leading-none select-none">
            <User size={12} className="text-[var(--muted)]" />
            <span>Authenticated User Context</span>
          </span>
          <div className="grid grid-cols-2 gap-2 text-[var(--body)] font-sans text-left">
            <div className="text-left">
              <span className="text-[var(--muted)] text-[8px] uppercase font-bold tracking-wider block leading-none">Email:</span>
              <span className="font-semibold block truncate text-[var(--heading)] mt-1.5 leading-normal">{user?.email || 'unknown'}</span>
            </div>
            <div className="text-left">
              <span className="text-[var(--muted)] text-[8px] uppercase font-bold tracking-wider block leading-none">User ID:</span>
              <span className="font-mono font-semibold block truncate text-[var(--heading)] mt-1.5 leading-normal">{user?.id || 'unknown'}</span>
            </div>
          </div>
        </div>

        {/* System Constraints */}
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[var(--muted)] text-[8px] font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-[var(--border)]/40 pb-1.5 leading-none select-none">
            <Settings size={12} className="text-[var(--muted)]" />
            <span>Orchestrator Config Settings</span>
          </span>
          <div className="grid grid-cols-2 gap-2.5 text-[var(--body)] font-mono text-[9px] text-left">
            <div className="text-left">
              <span className="text-[var(--muted)] text-[8px] font-sans uppercase font-bold tracking-wider block leading-none">Execution Timeout:</span>
              <span className="font-bold block mt-1.5 leading-normal text-[var(--heading)]">60.0 seconds</span>
            </div>
            <div className="text-left">
              <span className="text-[var(--muted)] text-[8px] font-sans uppercase font-bold tracking-wider block leading-none">Security Filter:</span>
              <span className="font-bold block text-[var(--success)] mt-1.5 leading-normal uppercase">
                Active
              </span>
            </div>
            <div className="text-left">
              <span className="text-[var(--muted)] text-[8px] font-sans uppercase font-bold tracking-wider block leading-none">Parallel Mode:</span>
              <span className="font-bold block mt-1.5 leading-normal text-[var(--heading)]">Allowed</span>
            </div>
            <div className="text-left">
              <span className="text-[var(--muted)] text-[8px] font-sans uppercase font-bold tracking-wider block leading-none">Memory Space:</span>
              <span className="font-bold block text-[var(--success)] mt-1.5 leading-normal uppercase">
                Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* Correlation Context */}
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[var(--muted)] text-[8px] font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-[var(--border)]/40 pb-1.5 leading-none select-none">
            <Key size={12} className="text-[var(--muted)]" />
            <span>Correlation Context</span>
          </span>
          <div className="flex flex-col gap-2.5 font-mono text-[9px] text-[var(--body)] select-text text-left">
            <div className="text-left">
              <span className="text-[var(--muted)] text-[8px] font-sans uppercase font-bold tracking-wider block leading-none">Active Session ID:</span>
              <span className="font-mono font-bold truncate block mt-1.5 bg-[var(--background)] p-2 rounded-lg border border-[var(--border)]/45 leading-normal text-[var(--heading)]">
                {sessionId || 'None'}
              </span>
            </div>
            {correlationId && (
              <div className="text-left">
                <span className="text-[var(--muted)] text-[8px] font-sans uppercase font-bold tracking-wider block leading-none">Correlation ID:</span>
                <span className="font-mono font-bold truncate block mt-1.5 bg-[var(--background)] p-2 rounded-lg border border-[var(--border)]/45 leading-normal text-[var(--heading)]">
                  {correlationId}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-[var(--muted)] font-sans mt-1 p-2 rounded-lg border border-[var(--border)]/45 bg-[var(--background)]/60 leading-none select-none flex-shrink-0">
          <Cpu size={12} className="text-[var(--muted)] flex-shrink-0" />
          <span>FastAPI backend orchestrator version 1.0 (v1/router)</span>
        </div>
      </div>
    </div>
  )
}
export default ContextViewer
