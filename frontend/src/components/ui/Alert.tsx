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
      default: 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900/30 dark:border-slate-800 dark:text-slate-200',
      info: 'bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-950/10 dark:border-blue-900/30 dark:text-blue-300',
      success: 'bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:text-emerald-300',
      warning: 'bg-amber-50/50 border-amber-200 text-amber-900 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-300',
      error: 'bg-rose-50/50 border-rose-200 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-350',
    }

    const iconColors = {
      default: 'text-muted-foreground',
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-emerald-500 dark:text-emerald-450',
      warning: 'text-amber-550 dark:text-amber-450',
      error: 'text-rose-500 dark:text-rose-450',
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-xl border p-4 flex gap-3 text-sm transition-all duration-200 ease-in-out',
          variants[variant],
          className
        )}
        {...props}
      >
        <Icon className={cn('h-5 w-5 shrink-0', iconColors[variant])} />
        <div className="flex-1 space-y-1 text-left">
          {title && <h5 className="font-bold leading-none tracking-tight font-display">{title}</h5>}
          {description && <div className="text-xs opacity-90 leading-relaxed font-sans">{description}</div>}
          {children && <div className="text-xs opacity-90 leading-relaxed font-sans">{children}</div>}
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
