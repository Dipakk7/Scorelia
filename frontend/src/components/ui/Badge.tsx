import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-[var(--radius-badge)] px-2.5 py-0.5 text-label transition-colors border select-none'

  const variants = {
    default: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',
    secondary: 'bg-[var(--divider)] text-[var(--muted)] border-[var(--border)]',
    success: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
    warning: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
    error: 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20',
    info: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',
    neutral: 'bg-[var(--muted)]/10 text-[var(--muted)] border-[var(--border)]',
    outline: 'bg-transparent text-[var(--muted)] border-[var(--border)]',
  }

  const activeVariant = variant === 'neutral' ? 'neutral' : variant

  return (
    <div
      className={cn(baseStyles, variants[activeVariant], className)}
      {...props}
    />
  )
}
