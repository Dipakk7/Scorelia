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
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10 font-sans text-left w-full', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-white tracking-tight truncate">
              {title}
            </h2>
            {badge && (
              <Badge variant={badgeVariant} className="text-[10px] shrink-0 font-semibold px-2 py-0.5">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {actions && <div className="self-start sm:self-auto shrink-0">{actions}</div>}
    </div>
  )
}

export default SettingsCategoryHeader
