import React from 'react'
import {
  Save,
  RefreshCw,
  Activity,
  Zap,
  Maximize2,
  FlaskConical,
  Mail,
  Sparkles,
  Volume2,
  ShieldCheck,
} from 'lucide-react'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'

export interface PreferenceToggleProps {
  id: string
  title: string
  description: string
  iconName?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const renderToggleIcon = (iconName?: string, className = 'w-3.5 h-3.5') => {
  switch (iconName) {
    case 'Save': return <Save className={className} />
    case 'RefreshCw': return <RefreshCw className={className} />
    case 'Activity': return <Activity className={className} />
    case 'Zap': return <Zap className={className} />
    case 'Maximize2': return <Maximize2 className={className} />
    case 'FlaskConical': return <FlaskConical className={className} />
    case 'Mail': return <Mail className={className} />
    case 'Sparkles': return <Sparkles className={className} />
    case 'Volume2': return <Volume2 className={className} />
    default: return <ShieldCheck className={className} />
  }
}

export const PreferenceToggle: React.FC<PreferenceToggleProps> = React.memo(({
  id,
  title,
  description,
  iconName,
  checked,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-2.5 px-2 rounded-md transition-colors font-sans hover:bg-[var(--surface-hover)]/40 min-h-[44px]',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
        {iconName && (
          <div className="p-1 rounded bg-[var(--surface)] text-[var(--muted)] shrink-0">
            {renderToggleIcon(iconName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="text-xs font-semibold text-[var(--heading)] cursor-pointer truncate block">
            {title}
          </label>
          <p className="text-[10px] text-[var(--muted)] truncate leading-tight">
            {description}
          </p>
        </div>
      </div>

      <Switch
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className="shrink-0"
      />
    </div>
  )
})

PreferenceToggle.displayName = 'PreferenceToggle'
export default PreferenceToggle
