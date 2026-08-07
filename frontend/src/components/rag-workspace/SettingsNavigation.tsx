import React from 'react'
import {
  Search,
  Cpu,
  Scissors,
  Layers,
  Shield,
  Bell,
  Sliders
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type SettingsTabId =
  | 'retrieval'
  | 'embedding'
  | 'chunking'
  | 'index'
  | 'security'
  | 'notifications'
  | 'preferences'

export interface SettingsNavigationProps {
  activeTab: SettingsTabId
  onTabChange: (tab: SettingsTabId) => void
  className?: string
}

export function SettingsNavigation({
  activeTab,
  onTabChange,
  className
}: SettingsNavigationProps) {
  const tabs: { id: SettingsTabId; label: string; icon: any }[] = [
    { id: 'retrieval', label: 'Retrieval Defaults', icon: Search },
    { id: 'embedding', label: 'Embedding Provider', icon: Cpu },
    { id: 'chunking', label: 'Chunking Strategy', icon: Scissors },
    { id: 'index', label: 'Indexing & Sync', icon: Layers },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Sliders }
  ]

  return (
    <div className={cn('p-2 rounded-2xl bg-slate-950/85 border border-slate-800/80 backdrop-blur-md shadow-xl text-left flex flex-wrap gap-1.5 select-none', className)}>
      {tabs.map((t) => {
        const Icon = t.icon
        const isActive = activeTab === t.id

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap border',
              isActive
                ? 'bg-purple-600/40 text-white shadow-md border-purple-500/50 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border-transparent'
            )}
          >
            <Icon size={14} className={cn(isActive ? 'text-white' : 'text-purple-400')} />
            <span>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default SettingsNavigation

