import React from 'react'
import type { IndexSettingsConfig } from '@/data/ragSettingsMockData'

export interface IndexSettingsProps {
  config: IndexSettingsConfig
  onChange: (config: IndexSettingsConfig) => void
}

export function IndexSettings({ config, onChange }: IndexSettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-5">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Indexing & Sync Automation</h3>
        <p className="text-xs text-slate-400">Manage auto-indexing, background worker queues, and sync schedules.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121320] border border-white/5">
          <div>
            <span className="font-bold text-slate-200 block">Automatic Indexing</span>
            <span className="text-[11px] text-slate-400">Trigger immediate vector indexing when new files are uploaded.</span>
          </div>
          <input
            type="checkbox"
            checked={config.autoIndex}
            onChange={(e) => onChange({ ...config, autoIndex: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121320] border border-white/5">
          <div>
            <span className="font-bold text-slate-200 block">Background Worker Processing</span>
            <span className="text-[11px] text-slate-400">Offload heavy chunking tasks to background worker processes.</span>
          </div>
          <input
            type="checkbox"
            checked={config.backgroundProcessing}
            onChange={(e) => onChange({ ...config, backgroundProcessing: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121320] border border-white/5">
          <div>
            <span className="font-bold text-slate-200 block">Incremental Document Updates</span>
            <span className="text-[11px] text-slate-400">Only re-index changed document chunks instead of rebuilding full index.</span>
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
