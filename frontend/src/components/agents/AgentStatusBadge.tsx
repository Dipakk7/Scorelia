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
      bg: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
      label: 'Healthy',
      dot: 'bg-[var(--success)] animate-pulse',
    },
    unhealthy: {
      bg: 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20',
      label: 'Degraded',
      dot: 'bg-[var(--danger)]',
    },
    active: {
      bg: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',
      label: 'Active',
      dot: 'bg-[var(--primary)] animate-ping',
    },
    running: {
      bg: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
      label: 'Running',
      dot: 'bg-[var(--warning)] animate-pulse',
    },
    idle: {
      bg: 'bg-muted text-muted-foreground border-[var(--border)]/40',
      label: 'Idle',
      dot: 'bg-muted-foreground',
    },
  }[normStatus as 'healthy' | 'unhealthy' | 'active' | 'running' | 'idle'] || {
    bg: 'bg-muted text-muted-foreground border-[var(--border)]/40',
    label: status,
    dot: 'bg-muted-foreground',
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
