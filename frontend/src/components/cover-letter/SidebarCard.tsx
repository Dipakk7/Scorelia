import React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarCardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerClassName?: string
}

export const SidebarCard: React.FC<SidebarCardProps> = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
  headerClassName,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/30 transition-all duration-300 w-full min-w-0',
        className
      )}
    >
      {(title || action || icon) && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 pb-3.5 mb-4 border-b border-[var(--border)]',
            headerClassName
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <div className="text-[var(--primary)] shrink-0">{icon}</div>}
            <div className="min-w-0 text-left">
              {typeof title === 'string' ? (
                <h4 className="font-display font-extrabold text-sm text-[var(--heading)] truncate m-0 leading-tight">
                  {title}
                </h4>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-[11px] text-[var(--muted)] font-medium truncate m-0 mt-0.5 leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="text-left w-full min-w-0">{children}</div>
    </div>
  )
}

export default SidebarCard
