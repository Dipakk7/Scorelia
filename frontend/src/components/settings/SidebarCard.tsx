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
        'p-4 border-[var(--border)] bg-[var(--surface-elevated)] space-y-3 font-sans text-left transition-all',
        className
      )}
    >
      {(title || action || icon) && (
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)]/40 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <div className="text-[var(--primary)] shrink-0">{icon}</div>}
            <div className="min-w-0">
              {title && (
                <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] text-[var(--muted)] truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className="space-y-3">{children}</div>

      {footer && (
        <div className="pt-2 border-t border-[var(--border)]/40 text-xs">
          {footer}
        </div>
      )}
    </Card>
  )
}

export default SidebarCard
