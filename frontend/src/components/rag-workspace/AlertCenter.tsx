import React, { useState } from 'react'
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertOctagon,
  X
} from 'lucide-react'
import type { OperationalAlert } from '@/data/ragAnalyticsMockData'
import { MOCK_OPERATIONAL_ALERTS } from '@/data/ragAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface AlertCenterProps {
  initialAlerts?: OperationalAlert[]
  className?: string
}

export function AlertCenter({
  initialAlerts = MOCK_OPERATIONAL_ALERTS,
  className
}: AlertCenterProps) {
  const [alerts, setAlerts] = useState<OperationalAlert[]>(initialAlerts)

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  if (alerts.length === 0) {
    return (
      <div className={cn('p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-center text-xs text-[var(--muted)]', className)}>
        <CheckCircle2 size={20} className="text-emerald-400 mx-auto mb-1" />
        No active operational alerts. All RAG services operating normally.
      </div>
    )
  }

  const alertConfigs = {
    info: {
      icon: Info,
      style: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
      iconColor: 'text-blue-400'
    },
    success: {
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      iconColor: 'text-emerald-400'
    },
    warning: {
      icon: AlertTriangle,
      style: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      iconColor: 'text-amber-400'
    },
    critical: {
      icon: AlertOctagon,
      style: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      iconColor: 'text-rose-400'
    }
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-3 select-none', className)}>
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-amber-400 shrink-0" />
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Operational Alerts Center ({alerts.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setAlerts([])}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer bg-transparent border-none"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const config = alertConfigs[alert.type] || alertConfigs.info
          const Icon = config.icon

          return (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-xl border flex items-start justify-between gap-3 text-xs transition-colors relative group',
                config.style
              )}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <Icon size={16} className={cn('shrink-0 mt-0.5', config.iconColor)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 truncate">{alert.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDismiss(alert.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                aria-label={`Dismiss alert: ${alert.title}`}
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AlertCenter
