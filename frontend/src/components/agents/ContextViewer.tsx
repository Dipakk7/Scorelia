// frontend/src/components/agents/ContextViewer.tsx

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
    <Card className={cn('glass-card border border-slate-200 dark:border-dark-border', className)}>
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-dark-border/40">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-brand-500" />
          <div>
            <CardTitle className="text-sm font-semibold font-display text-slate-800 dark:text-slate-200">
              Operations Context panel
            </CardTitle>
            <span className="text-xxs text-slate-450 font-sans block mt-0.5">
              Live runtime variables mapping orchestrator context
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-4 font-sans text-xs">
        {/* User Context */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-400 text-xxs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-dark-border/30 pb-1">
            <User size={12} />
            <span>Authenticated User Context</span>
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-655 dark:text-slate-400 font-sans">
            <div>
              <span className="text-slate-400 text-xxs block">Email:</span>
              <span className="font-semibold block truncate">{user?.email || 'unknown'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xxs block">User ID:</span>
              <span className="font-semibold block font-mono truncate">{user?.id || 'unknown'}</span>
            </div>
          </div>
        </div>

        {/* System Constraints */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-400 text-xxs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-dark-border/30 pb-1">
            <Settings size={12} />
            <span>Orchestrator Config Settings</span>
          </span>
          <div className="grid grid-cols-2 gap-2.5 text-slate-655 dark:text-slate-400 font-mono text-xxs">
            <div>
              <span className="text-slate-400 text-xxs font-sans block">Execution Timeout:</span>
              <span className="font-semibold block mt-0.5">60.0 seconds</span>
            </div>
            <div>
              <span className="text-slate-400 text-xxs font-sans block">Security Filter:</span>
              <span className="font-semibold block text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase">
                Active
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xxs font-sans block">Parallel Mode:</span>
              <span className="font-semibold block mt-0.5">Allowed</span>
            </div>
            <div>
              <span className="text-slate-400 text-xxs font-sans block">Memory Space:</span>
              <span className="font-semibold block text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase">
                Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* Correlation Context */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-400 text-xxs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-dark-border/30 pb-1">
            <Key size={12} />
            <span>Correlation Context</span>
          </span>
          <div className="flex flex-col gap-1.5 font-mono text-xxs text-slate-605 dark:text-slate-405 select-text">
            <div>
              <span className="text-slate-400 text-xxs font-sans block">Active Session ID:</span>
              <span className="font-semibold truncate block mt-0.5 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-100 dark:border-dark-border/40">
                {sessionId || 'None'}
              </span>
            </div>
            {correlationId && (
              <div>
                <span className="text-slate-400 text-xxs font-sans block">Correlation ID:</span>
                <span className="font-semibold truncate block mt-0.5 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-100 dark:border-dark-border/40">
                  {correlationId}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xxs text-slate-400 dark:text-slate-500 font-sans mt-1 p-2 rounded-lg border border-slate-100 dark:border-dark-border/40 bg-slate-50/50 dark:bg-slate-900/10">
          <Cpu size={12} />
          <span>FastAPI backend orchestrator version 1.0 (v1/router)</span>
        </div>
      </CardContent>
    </Card>
  )
}
