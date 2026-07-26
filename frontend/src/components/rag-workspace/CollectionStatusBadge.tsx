import React from 'react'
import { CheckCircle2, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import type { CollectionStatus } from '@/data/ragWorkspaceMockData'
import { cn } from '@/lib/utils'

export interface CollectionStatusBadgeProps {
  status: CollectionStatus
  className?: string
}

export function CollectionStatusBadge({ status, className }: CollectionStatusBadgeProps) {
  const configs = {
    ready: {
      label: 'Ready',
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-400 animate-pulse'
    },
    processing: {
      label: 'Processing',
      icon: Loader2,
      style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      dot: 'bg-cyan-400 animate-spin'
    },
    indexing: {
      label: 'Indexing',
      icon: RefreshCw,
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dot: 'bg-amber-400 animate-pulse'
    },
    failed: {
      label: 'Failed',
      icon: AlertCircle,
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500'
    }
  }

  const config = configs[status] || configs.ready
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border select-none',
        config.style,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <Icon size={12} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  )
}

export default CollectionStatusBadge
