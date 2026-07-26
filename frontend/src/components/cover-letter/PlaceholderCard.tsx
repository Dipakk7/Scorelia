import React from 'react'
import { cn } from '@/lib/utils'

export interface PlaceholderCardProps {
  title?: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerClassName?: string
}

export const PlaceholderCard: React.FC<PlaceholderCardProps> = ({
  title,
  description,
  badge,
  action,
  children,
  className,
  headerClassName,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/30 transition-all duration-300 w-full min-w-0',
        className
      )}
    >
      {(title || description || action || badge) && (
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[var(--border)]',
            headerClassName
          )}
        >
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              {typeof title === 'string' ? (
                <h3 className="font-display font-extrabold text-base text-[var(--heading)] tracking-tight m-0">
                  {title}
                </h3>
              ) : (
                title
              )}
              {badge}
            </div>
            {description && (
              <p className="text-xs text-[var(--muted)] font-medium m-0 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2 self-start sm:self-auto">{action}</div>}
        </div>
      )}
      <div className="text-left w-full min-w-0">{children}</div>
    </div>
  )
}

export default PlaceholderCard
