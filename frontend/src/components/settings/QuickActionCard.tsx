import React from 'react'
import {
  KeyRound,
  Lock,
  Laptop,
  Download,
  Trash2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { QuickActionItem } from './systemPreferencesMockData'
import { cn } from '@/lib/utils'

export interface QuickActionCardProps {
  item: QuickActionItem
  onAction?: () => void
  disabled?: boolean
  className?: string
}

const renderQuickActionIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'KeyRound': return <KeyRound className={className} />
    case 'Lock': return <Lock className={className} />
    case 'Laptop': return <Laptop className={className} />
    case 'Download': return <Download className={className} />
    case 'Trash2': return <Trash2 className={className} />
    default: return <KeyRound className={className} />
  }
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  item,
  onAction,
  disabled = false,
  className,
}) => {
  const isDanger = item.variant === 'danger'

  return (
    <Card
      variant="elevated"
      hoverLift
      className={cn(
        'p-4 border-[var(--border)] bg-[var(--surface-elevated)] flex flex-col justify-between items-center text-center space-y-3 group font-sans transition-all focus-within:ring-2 focus-within:ring-[var(--primary)]/30',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
    >
      {/* Icon Circle */}
      <div
        className={cn(
          'p-2.5 rounded-full group-hover:scale-110 transition-transform shrink-0',
          isDanger
            ? 'bg-[var(--danger)]/10 text-[var(--danger)]'
            : 'bg-[var(--primary)]/10 text-[var(--primary)]'
        )}
      >
        {renderQuickActionIcon(item.iconName, 'w-5 h-5')}
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-[var(--heading)] line-clamp-1">
          {item.title}
        </h3>
        <p className="text-[11px] text-[var(--muted)] leading-tight line-clamp-2">
          {item.subtitle}
        </p>
      </div>

      {/* Action Button */}
      <Button
        variant={isDanger ? 'danger' : 'secondary'}
        size="sm"
        onClick={onAction}
        disabled={disabled}
        type="button"
        className="w-full text-xs h-8 mt-2 justify-center gap-1 font-medium"
      >
        {item.actionLabel}
      </Button>
    </Card>
  )
}

export default QuickActionCard
