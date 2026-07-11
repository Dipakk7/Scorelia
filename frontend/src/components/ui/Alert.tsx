import React from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  title?: string
  description?: React.ReactNode
  onClose?: () => void
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, description, children, onClose, ...props }, ref) => {
    const icons = {
      default: Info,
      info: Info,
      success: CheckCircle2,
      warning: AlertTriangle,
      error: AlertCircle,
    }

    const Icon = icons[variant]

    const variants = {
      default: 'bg-[var(--surface)] border-[var(--border)] text-[var(--body)]',
      info: 'bg-[var(--primary)]/5 border-[var(--primary)]/20 text-[var(--primary)]',
      success: 'bg-[var(--success)]/5 border-[var(--success)]/20 text-[var(--success)]',
      warning: 'bg-[var(--warning)]/5 border-[var(--warning)]/20 text-[var(--warning)]',
      error: 'bg-[var(--danger)]/5 border-[var(--danger)]/20 text-[var(--danger)]',
    }

    const iconColors = {
      default: 'text-[var(--muted)]',
      info: 'text-[var(--primary)]',
      success: 'text-[var(--success)]',
      warning: 'text-[var(--warning)]',
      error: 'text-[var(--danger)]',
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-[var(--radius-card)] border p-4 flex gap-3 text-body-sm transition-all duration-[var(--duration-normal)] ease-in-out',
          variants[variant],
          className
        )}
        {...props}
      >
        <Icon className={cn('h-5 w-5 shrink-0', iconColors[variant])} />
        <div className="flex-1 space-y-1 text-left">
          {title && <h5 className="text-body-sm font-bold leading-none tracking-tight font-display">{title}</h5>}
          {description && <div className="text-caption opacity-90 leading-relaxed font-sans">{description}</div>}
          {children && <div className="text-caption opacity-90 leading-relaxed font-sans">{children}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 p-1 rounded-lg text-current opacity-60 hover:opacity-100 transition-opacity hover:bg-current/10 cursor-pointer"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = 'Alert'
