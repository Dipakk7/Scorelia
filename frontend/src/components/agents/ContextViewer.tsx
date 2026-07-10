import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
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
    <Card className={cn('border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs flex flex-col', className)}>
      <CardHeader className="pb-4 border-b border-border/60 text-left">
        <div className="flex items-center gap-2 text-left">
          <Compass size={18} className="text-brand-500 animate-pulse" />
          <div className="text-left">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground m-0 leading-none">
              Operations Context Panel
            </CardTitle>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-sans block mt-1.5 leading-none">
              Live runtime variables mapping orchestrator context
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-4 font-sans text-xs text-left">
        {/* User Context */}
        <div className="flex flex-col gap-2 text-left">
          <span className="text-muted-foreground text-[9px] font-black uppercase font-mono tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-1.5 leading-none">
            <User size={12} className="text-slate-400" />
            <span>Authenticated User Context</span>
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-655 dark:text-slate-400 font-sans text-left">
            <div className="text-left">
              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block">Email:</span>
              <span className="font-semibold block truncate text-foreground mt-1 leading-normal">{user?.email || 'unknown'}</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block">User ID:</span>
              <span className="font-mono font-semibold block truncate text-foreground mt-1 leading-normal">{user?.id || 'unknown'}</span>
            </div>
          </div>
        </div>

        {/* System Constraints */}
        <div className="flex flex-col gap-2 text-left">
          <span className="text-muted-foreground text-[9px] font-black uppercase font-mono tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-1.5 leading-none">
            <Settings size={12} className="text-slate-400" />
            <span>Orchestrator Config Settings</span>
          </span>
          <div className="grid grid-cols-2 gap-2.5 text-slate-655 dark:text-slate-400 font-mono text-[10px] text-left">
            <div className="text-left">
              <span className="text-slate-400 text-[9px] font-sans uppercase font-bold tracking-wider block">Execution Timeout:</span>
              <span className="font-bold block mt-1 leading-normal text-slate-800 dark:text-slate-205">60.0 seconds</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 text-[9px] font-sans uppercase font-bold tracking-wider block">Security Filter:</span>
              <span className="font-bold block text-emerald-600 dark:text-emerald-450 mt-1 leading-normal uppercase">
                Active
              </span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 text-[9px] font-sans uppercase font-bold tracking-wider block">Parallel Mode:</span>
              <span className="font-bold block mt-1 leading-normal text-slate-800 dark:text-slate-205">Allowed</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 text-[9px] font-sans uppercase font-bold tracking-wider block">Memory Space:</span>
              <span className="font-bold block text-emerald-600 dark:text-emerald-450 mt-1 leading-normal uppercase">
                Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* Correlation Context */}
        <div className="flex flex-col gap-2 text-left">
          <span className="text-muted-foreground text-[9px] font-black uppercase font-mono tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-855 pb-1.5 leading-none">
            <Key size={12} className="text-slate-400" />
            <span>Correlation Context</span>
          </span>
          <div className="flex flex-col gap-1.5 font-mono text-[10px] text-slate-605 dark:text-slate-405 select-text text-left">
            <div className="text-left">
              <span className="text-slate-400 text-[9px] font-sans uppercase font-bold tracking-wider block">Active Session ID:</span>
              <span className="font-mono font-bold truncate block mt-1.5 bg-slate-55/35 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-850 leading-normal text-slate-800 dark:text-slate-205">
                {sessionId || 'None'}
              </span>
            </div>
            {correlationId && (
              <div className="text-left">
                <span className="text-slate-400 text-[9px] font-sans uppercase font-bold tracking-wider block">Correlation ID:</span>
                <span className="font-mono font-bold truncate block mt-1.5 bg-slate-55/35 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-850 leading-normal text-slate-800 dark:text-slate-205">
                  {correlationId}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-sans mt-1 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 leading-none select-none">
          <Cpu size={12} className="text-slate-400 flex-shrink-0" />
          <span>FastAPI backend orchestrator version 1.0 (v1/router)</span>
        </div>
      </CardContent>
    </Card>
  )
}
export default ContextViewer
