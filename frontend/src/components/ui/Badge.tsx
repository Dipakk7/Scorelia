import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-extrabold font-display transition-colors border uppercase tracking-wider select-none'

  const variants = {
    default: 'bg-brand-500/10 text-brand-600 border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300 dark:border-brand-500/20',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    success: 'bg-emerald-500/8 text-emerald-600 border-emerald-500/15 dark:bg-emerald-500/12 dark:text-emerald-400 dark:border-emerald-500/20',
    warning: 'bg-amber-500/8 text-amber-600 border-amber-500/15 dark:bg-amber-500/12 dark:text-amber-400 dark:border-amber-500/20',
    error: 'bg-rose-500/8 text-rose-600 border-rose-500/15 dark:bg-rose-500/12 dark:text-rose-400 dark:border-rose-500/20',
    info: 'bg-blue-500/8 text-blue-600 border-blue-500/15 dark:bg-blue-500/12 dark:text-blue-400 dark:border-blue-500/20',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200/60 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
    outline: 'bg-transparent text-slate-500 border-slate-200 dark:text-slate-400 dark:border-slate-800',
  }

  const activeVariant = variant === 'neutral' ? 'neutral' : variant

  return (
    <div
      className={cn(baseStyles, variants[activeVariant], className)}
      {...props}
    />
  )
}
