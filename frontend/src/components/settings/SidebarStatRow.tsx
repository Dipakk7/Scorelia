import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export interface SidebarStatRowProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline'
  tooltip?: string
  className?: string
}

export const SidebarStatRow: React.FC<SidebarStatRowProps> = ({
  icon,
  label,
  value,
  badge,
  badgeVariant = 'success',
  tooltip,
  className,
}) => {
  return (
    <div
      title={tooltip}
      className={cn(
        'flex items-center justify-between gap-2 text-xs py-1 transition-colors hover:bg-[var(--surface-hover)]/40 px-1 rounded',
        className
      )}
    >
      <div className="flex items-center gap-2 text-[var(--body)] min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 font-medium">
        <span className="font-semibold text-[var(--heading)] font-mono">{value}</span>
        {badge && (
          <Badge variant={badgeVariant} className="text-[9px] px-1 py-0 border-0">
            {badge}
          </Badge>
        )}
      </div>
    </div>
  )
}

export default SidebarStatRow
