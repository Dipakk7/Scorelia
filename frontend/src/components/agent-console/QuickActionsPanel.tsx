import React, { useState } from 'react'
import {
  RotateCcw,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Database,
  BellOff,
  Activity,
  Settings,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuickActionsPanelProps {
  className?: string
}

export function QuickActionsPanel({ className }: QuickActionsPanelProps) {
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null)

  const handleActionClick = (actionName: string) => {
    setActiveFeedback(`Triggered: ${actionName}`)
    setTimeout(() => setActiveFeedback(null), 2500)
  }

  const actions = [
    { name: 'Restart Selected Agent', icon: RotateCcw, color: 'text-purple-400' },
    { name: 'Pause All Running Tasks', icon: PauseCircle, color: 'text-amber-400' },
    { name: 'Resume Queue Execution', icon: PlayCircle, color: 'text-emerald-400' },
    { name: 'Refresh Knowledge Index', icon: RefreshCw, color: 'text-indigo-400' },
    { name: 'Sync Pinecone Collections', icon: Database, color: 'text-blue-400' },
    { name: 'Clear Notifications', icon: BellOff, color: 'text-slate-400' },
    { name: 'Run Health Diagnostics', icon: Activity, color: 'text-cyan-400' },
    { name: 'Manage Enterprise Services', icon: Settings, color: 'text-slate-300' },
  ]

  return (
    <div className={cn('p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4 text-left', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Quick System Operational Actions</h3>
        <span className="text-[10px] font-mono font-semibold text-purple-400">8 Actions</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <button
              key={act.name}
              type="button"
              onClick={() => handleActionClick(act.name)}
              className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-purple-500/40 text-slate-200 hover:text-white flex flex-col items-center text-center space-y-1.5 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <Icon size={18} className={act.color} />
              <span className="font-semibold text-[11px] leading-tight line-clamp-2">{act.name}</span>
            </button>
          )
        })}
      </div>

      {activeFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{activeFeedback}</span>
        </div>
      )}
    </div>
  )
}

export default QuickActionsPanel
