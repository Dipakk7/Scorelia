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
        'rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-5 shadow-lg shadow-purple-950/10 transition-all duration-300 w-full min-w-0 text-left text-slate-100',
        className
      )}
    >
      {(title || action || icon) && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 pb-3 mb-3.5 border-b border-slate-800/80',
            headerClassName
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <div className="text-purple-400 shrink-0">{icon}</div>}
            <div className="min-w-0 text-left">
              {typeof title === 'string' ? (
                <h4 className="font-extrabold text-sm text-white truncate m-0 leading-tight">
                  {title}
                </h4>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-[11px] text-slate-400 font-medium truncate m-0 mt-0.5 leading-tight">
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
