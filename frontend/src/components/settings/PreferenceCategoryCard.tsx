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
        'p-5 rounded-2xl bg-[#121426] border border-white/10 shadow-lg flex flex-col justify-between space-y-4 font-sans text-left transition-all w-full',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
    >
      <div className="space-y-4 w-full">
        {/* Category Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            {renderCategoryIcon(category.iconName, 'w-4 h-4')}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white tracking-tight truncate font-sans">
              {category.title}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium line-clamp-1 font-sans">
              {category.description}
            </p>
          </div>
        </div>

        {/* 3 Preference Toggles */}
        <div className="space-y-1.5 w-full">
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
      <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 font-medium leading-snug">
        <span>{category.note}</span>
        {category.linkText && (
          <a
            href="#learn-more"
            onClick={(e) => e.preventDefault()}
            className="ml-1 text-purple-400 hover:text-purple-300 hover:underline font-semibold inline-block"
          >
            {category.linkText}
          </a>
        )}
      </div>
    </Card>
  )
}

export default PreferenceCategoryCard
