import React, { useState } from 'react'
import {
  Globe,
  Clock,
  Calendar,
  Clock3,
  LayoutGrid,
  ListFilter,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SettingsSelect } from './SettingsSelect'
import type { GeneralPreferenceItemData } from './generalPreferencesMockData'
import { cn } from '@/lib/utils'

export interface SettingsSelectCardProps {
  item: GeneralPreferenceItemData
  value?: string
  onChange?: (val: string) => void
  disabled?: boolean
  className?: string
}

// Icon mapping helper
const renderPreferenceIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Globe': return <Globe className={className} />
    case 'Clock': return <Clock className={className} />
    case 'Calendar': return <Calendar className={className} />
    case 'Clock3': return <Clock3 className={className} />
    case 'LayoutGrid': return <LayoutGrid className={className} />
    case 'ListFilter': return <ListFilter className={className} />
    default: return <Globe className={className} />
  }
}

export const SettingsSelectCard: React.FC<SettingsSelectCardProps> = ({
  item,
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(value || item.defaultValue)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value
    setInternalValue(newVal)
    onChange?.(newVal)
  }

  const currentValue = value !== undefined ? value : internalValue

  return (
    <Card
      variant="elevated"
      hoverLift
      className={cn(
        'p-4 border-[var(--border)] bg-[var(--surface-elevated)] space-y-3 font-sans transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--primary)]/30 focus-within:border-[var(--primary)]',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 group-hover:scale-105 transition-transform">
          {renderPreferenceIcon(item.iconName, 'w-4 h-4')}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-xs font-semibold text-[var(--heading)] truncate">
            {item.title}
          </h3>
          <p className="text-[11px] text-[var(--muted)] truncate">
            {item.description}
          </p>
        </div>
      </div>

      <SettingsSelect
        options={item.options}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        aria-label={item.title}
        className="h-9 text-xs"
      />
    </Card>
  )
}

export default SettingsSelectCard
