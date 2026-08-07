import React from 'react'
import type { IndexSettingsConfig } from '@/data/ragSettingsMockData'

export interface IndexSettingsProps {
  config: IndexSettingsConfig
  onChange: (config: IndexSettingsConfig) => void
}

export function IndexSettings({ config, onChange }: IndexSettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-5 select-none">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="text-sm font-bold text-[var(--heading)] uppercase tracking-wider">Indexing & Sync Automation</h3>
        <p className="text-xs text-[var(--muted)]">Manage auto-indexing, background worker queues, and sync schedules.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
          <div>
            <span className="font-bold text-[var(--heading)] block">Automatic Indexing</span>
            <span className="text-[11px] text-[var(--muted)]">Trigger immediate vector indexing when new files are uploaded.</span>
          </div>
          <input
            type="checkbox"
            checked={config.autoIndex}
            onChange={(e) => onChange({ ...config, autoIndex: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
          <div>
            <span className="font-bold text-[var(--heading)] block">Background Worker Processing</span>
            <span className="text-[11px] text-[var(--muted)]">Offload heavy chunking tasks to background worker processes.</span>
          </div>
          <input
            type="checkbox"
            checked={config.backgroundProcessing}
            onChange={(e) => onChange({ ...config, backgroundProcessing: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
          <div>
            <span className="font-bold text-[var(--heading)] block">Incremental Document Updates</span>
            <span className="text-[11px] text-[var(--muted)]">Only re-index changed document chunks instead of rebuilding full index.</span>
          </div>
          <input
            type="checkbox"
            checked={config.incrementalIndexing}
            onChange={(e) => onChange({ ...config, incrementalIndexing: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default IndexSettings

