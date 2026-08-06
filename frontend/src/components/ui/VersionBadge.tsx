import React, { memo } from 'react'
import { cn } from '@/lib/utils'

export interface VersionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  version?: string
  variant?: 'purple' | 'subtle' | 'outline'
}

export const VersionBadge: React.FC<VersionBadgeProps> = memo(({
  version = 'v1.0',
  variant = 'purple',
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight border transition-colors shrink-0 select-none',
        variant === 'purple' &&
          'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25 focus-visible:ring-1 focus-visible:ring-purple-400',
        variant === 'subtle' &&
          'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800 focus-visible:ring-1 focus-visible:ring-slate-400',
        variant === 'outline' &&
          'bg-transparent text-slate-400 border-slate-700/80 hover:text-slate-200',
        className
      )}
      {...props}
    >
      {version}
    </span>
  )
})

VersionBadge.displayName = 'VersionBadge'
export default VersionBadge
