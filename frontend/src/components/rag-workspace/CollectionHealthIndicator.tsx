import React from 'react'
import type { CollectionHealth } from '@/data/ragWorkspaceMockData'
import { cn } from '@/lib/utils'

export interface CollectionHealthIndicatorProps {
  health: CollectionHealth
  className?: string
}

export function CollectionHealthIndicator({ health, className }: CollectionHealthIndicatorProps) {
  const configs = {
    healthy: {
      label: 'Healthy',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      dot: 'bg-emerald-400'
    },
    warning: {
      label: 'Warning',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      dot: 'bg-amber-400'
    },
    attention: {
      label: 'Needs Attention',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      dot: 'bg-rose-400'
    }
  }

  const config = configs[health] || configs.healthy

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border select-none',
        config.color,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <span>{config.label}</span>
    </span>
  )
}

export default CollectionHealthIndicator
