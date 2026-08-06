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
        'rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-5 md:p-6 shadow-lg shadow-purple-950/10 transition-all duration-300 w-full min-w-0 text-left text-slate-100',
        className
      )}
    >
      {(title || description || action || badge) && (
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-slate-800/80',
            headerClassName
          )}
        >
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              {typeof title === 'string' ? (
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight m-0">
                  {title}
                </h3>
              ) : (
                title
              )}
              {badge}
            </div>
            {description && (
              <p className="text-xs text-slate-400 font-medium m-0 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">{action}</div>}
        </div>
      )}
      <div className="text-left w-full min-w-0">{children}</div>
    </div>
  )
}

export default PlaceholderCard
