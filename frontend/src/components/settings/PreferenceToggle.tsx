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
        'flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl transition-all font-sans hover:bg-white/5 border border-transparent hover:border-white/5 min-h-[44px] w-full',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
        {iconName && (
          <div className="p-1.5 rounded-lg bg-slate-800/80 text-purple-400 border border-white/10 shrink-0">
            {renderToggleIcon(iconName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="text-xs font-semibold text-slate-100 cursor-pointer truncate block font-sans">
            {title}
          </label>
          <p className="text-[11px] text-slate-400 font-medium truncate leading-tight font-sans">
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
        className="shrink-0 cursor-pointer"
      />
    </div>
  )
})

PreferenceToggle.displayName = 'PreferenceToggle'
export default PreferenceToggle
