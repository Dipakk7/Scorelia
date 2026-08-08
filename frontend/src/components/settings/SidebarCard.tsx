import React from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface SidebarCardProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const SidebarCard: React.FC<SidebarCardProps> = ({
  title,
  subtitle,
  icon,
  action,
  footer,
  children,
  className,
}) => {
  return (
    <Card
      variant="elevated"
      hoverLift
      className={cn(
        'p-5 rounded-2xl bg-[#121426] border border-white/10 shadow-xl space-y-3 font-sans text-left transition-all w-full',
        className
      )}
    >
      {(title || action || icon) && (
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <div className="text-purple-400 shrink-0">{icon}</div>}
            <div className="min-w-0">
              {title && (
                <h3 className="text-xs font-bold text-white uppercase tracking-wider truncate font-sans">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] text-slate-400 font-medium truncate font-sans">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className="space-y-3 w-full">{children}</div>

      {footer && (
        <div className="pt-2.5 border-t border-white/10 text-xs text-slate-400 font-medium">
          {footer}
        </div>
      )}
    </Card>
  )
}

export default SidebarCard
