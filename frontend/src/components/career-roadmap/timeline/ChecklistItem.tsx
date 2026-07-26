import React from 'react'
import { CheckCircle2, Circle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChecklistItemData } from '@/types/careerRoadmap'

export interface ChecklistItemProps {
  item: ChecklistItemData
  className?: string
}

export function ChecklistItem({ item, className }: ChecklistItemProps) {
  const renderStatusIcon = () => {
    switch (item.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
      case 'current':
        return (
          <div className="relative flex items-center justify-center shrink-0">
            <span className="absolute h-3 w-3 rounded-full bg-blue-400 opacity-75 animate-ping" />
            <Circle className="h-4 w-4 text-blue-400 fill-blue-400/20 shrink-0" aria-hidden="true" />
          </div>
        )
      case 'locked':
      default:
        return <Lock className="h-3.5 w-3.5 text-slate-500 shrink-0" aria-hidden="true" />
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 py-1 text-xs transition-colors text-left',
        item.status === 'completed'
          ? 'text-slate-200'
          : item.status === 'current'
          ? 'text-white font-semibold'
          : 'text-slate-500',
        className
      )}
    >
      {renderStatusIcon()}
      <span className={cn('leading-snug truncate', item.status === 'completed' && 'line-through text-slate-400/80')}>
        {item.title}
      </span>
    </div>
  )
}
export default ChecklistItem
