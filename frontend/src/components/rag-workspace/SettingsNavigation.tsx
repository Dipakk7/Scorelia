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
    <div className={cn('p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left flex flex-wrap gap-1.5 select-none', className)}>
      {tabs.map((t) => {
        const Icon = t.icon
        const isActive = activeTab === t.id

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap border-none',
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30 font-bold'
                : 'text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)]'
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

