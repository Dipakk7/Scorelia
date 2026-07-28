import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export interface SettingsCategoryHeaderProps {
  icon?: React.ReactNode
  title: string
  subtitle: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline'
  actions?: React.ReactNode
  className?: string
}

export const SettingsCategoryHeader: React.FC<SettingsCategoryHeaderProps> = ({
  icon,
  title,
  subtitle,
  badge,
  badgeVariant = 'info',
  actions,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]/40 font-sans text-left', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--heading)] truncate">
              {title}
            </h2>
            {badge && (
              <Badge variant={badgeVariant} className="text-[10px] shrink-0">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--muted)] line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      {actions && <div className="self-start sm:self-auto shrink-0">{actions}</div>}
    </div>
  )
}

export default SettingsCategoryHeader
