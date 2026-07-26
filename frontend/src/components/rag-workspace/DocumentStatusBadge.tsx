import React from 'react'
import type { DocumentStatus } from '@/data/ragDocumentsMockData'
import { cn } from '@/lib/utils'

export interface DocumentStatusBadgeProps {
  status: DocumentStatus
  className?: string
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  let colorStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'

  if (status === 'Processing') {
    colorStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  } else if (status === 'Failed') {
    colorStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  } else if (status === 'Queued') {
    colorStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border select-none',
        colorStyle,
        className
      )}
    >
      {status === 'Processing' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      )}
      <span>{status}</span>
    </span>
  )
}

export default DocumentStatusBadge
