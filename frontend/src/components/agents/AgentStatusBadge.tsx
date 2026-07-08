import React from 'react'
import { cn } from '@/lib/utils'

interface AgentStatusBadgeProps {
  status: 'healthy' | 'unhealthy' | 'active' | 'idle' | 'running' | string
  className?: string
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({ status, className }) => {
  const normStatus = status.toLowerCase()

  const config = {
    healthy: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20',
      label: 'Healthy',
      dot: 'bg-emerald-500 animate-pulse',
    },
    unhealthy: {
      bg: 'bg-rose-500/10 text-rose-650 dark:text-rose-455 border-rose-500/20',
      label: 'Degraded',
      dot: 'bg-rose-500',
    },
    active: {
      bg: 'bg-brand-500/10 text-brand-655 dark:text-brand-400 border-brand-500/20',
      label: 'Active',
      dot: 'bg-brand-500 animate-ping',
    },
    running: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20',
      label: 'Running',
      dot: 'bg-amber-500 animate-pulse',
    },
    idle: {
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      label: 'Idle',
      dot: 'bg-slate-400',
    },
  }[normStatus as 'healthy' | 'unhealthy' | 'active' | 'running' | 'idle'] || {
    bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    label: status,
    dot: 'bg-slate-400',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border font-sans select-none leading-none shrink-0 border',
        config.bg,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dot)} />
      {config.label}
    </span>
  )
}
export default AgentStatusBadge
