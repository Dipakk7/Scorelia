import React, { useState } from 'react'
import { ShieldCheck, Gauge, Bell } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PreferenceToggle } from './PreferenceToggle'
import type { PreferenceCategory } from './systemPreferencesMockData'
import { cn } from '@/lib/utils'

export interface PreferenceCategoryCardProps {
  category: PreferenceCategory
  values?: Record<string, boolean>
  onToggleChange?: (itemId: string, checked: boolean) => void
  disabled?: boolean
  className?: string
}

const renderCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'ShieldCheck': return <ShieldCheck className={className} />
    case 'Gauge': return <Gauge className={className} />
    case 'Bell': return <Bell className={className} />
    default: return <ShieldCheck className={className} />
  }
}

export const PreferenceCategoryCard: React.FC<PreferenceCategoryCardProps> = ({
  category,
  values,
  onToggleChange,
  disabled = false,
  className,
}) => {
  const [localValues, setLocalValues] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    category.items.forEach((item) => {
      init[item.id] = item.defaultChecked
    })
    return init
  })

  const handleToggle = (itemId: string, checked: boolean) => {
    setLocalValues((prev) => ({ ...prev, [itemId]: checked }))
    onToggleChange?.(itemId, checked)
  }

  return (
    <Card
      variant="elevated"
      hoverLift
      className={cn(
        'p-4 border-[var(--border)] bg-[var(--surface-elevated)] flex flex-col justify-between space-y-4 font-sans text-left transition-all',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
    >
      <div className="space-y-4">
        {/* Category Header */}
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-[var(--border)]/40">
          <div className="p-1.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
            {renderCategoryIcon(category.iconName, 'w-4 h-4')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--heading)]">
              {category.title}
            </h3>
            <p className="text-[10px] text-[var(--muted)] line-clamp-1">
              {category.description}
            </p>
          </div>
        </div>

        {/* 3 Preference Toggles */}
        <div className="space-y-1.5">
          {category.items.map((item) => {
            const isChecked = values?.[item.id] !== undefined ? values[item.id] : localValues[item.id]
            return (
              <PreferenceToggle
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                iconName={item.iconName}
                checked={isChecked}
                onChange={(checked) => handleToggle(item.id, checked)}
                disabled={disabled}
              />
            )
          })}
        </div>
      </div>

      {/* Note & Footer Link */}
      <div className="pt-3 border-t border-[var(--border)]/40 text-[11px] text-[var(--muted)] leading-snug">
        <span>{category.note}</span>
        {category.linkText && (
          <a
            href="#learn-more"
            onClick={(e) => e.preventDefault()}
            className="ml-1 text-[var(--primary)] hover:underline font-medium inline-block"
          >
            {category.linkText}
          </a>
        )}
      </div>
    </Card>
  )
}

export default PreferenceCategoryCard
