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
      bg: 'bg-success/10 text-success border-success/20',
      label: 'Healthy',
      dot: 'bg-success animate-pulse',
    },
    unhealthy: {
      bg: 'bg-destructive/10 text-destructive border-destructive/20',
      label: 'Degraded',
      dot: 'bg-destructive',
    },
    active: {
      bg: 'bg-brand-500/10 text-brand-655 dark:text-brand-400 border-brand-500/20',
      label: 'Active',
      dot: 'bg-brand-500 animate-ping',
    },
    running: {
      bg: 'bg-warning/10 text-warning border-warning/20',
      label: 'Running',
      dot: 'bg-warning animate-pulse',
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
