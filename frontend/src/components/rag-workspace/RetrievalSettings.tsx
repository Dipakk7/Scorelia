import React from 'react'
import type { RetrievalSettingsConfig } from '@/data/ragSettingsMockData'

export interface RetrievalSettingsProps {
  config: RetrievalSettingsConfig
  onChange: (config: RetrievalSettingsConfig) => void
}

export function RetrievalSettings({ config, onChange }: RetrievalSettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-5 select-none">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="text-sm font-bold text-[var(--heading)] uppercase tracking-wider">Default Retrieval Settings</h3>
        <p className="text-xs text-[var(--muted)]">Configure global search presets for all workspace RAG queries.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Default Search Mode</label>
          <select
            value={config.defaultSearchType}
            onChange={(e) => onChange({ ...config, defaultSearchType: e.target.value as any })}
            className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--heading)] p-2.5 rounded-xl font-sans focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="Hybrid">Hybrid (Semantic + Keyword BM25)</option>
            <option value="Semantic">Semantic Vector Search Only</option>
            <option value="Keyword">Keyword BM25 Search Only</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Default Top-K Chunks ({config.defaultTopK})</label>
          <input
            type="range"
            min="3"
            max="20"
            value={config.defaultTopK}
            onChange={(e) => onChange({ ...config, defaultTopK: Number(e.target.value) })}
            className="w-full accent-purple-500 cursor-pointer mt-2"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Temperature ({config.defaultTemperature.toFixed(1)})</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.defaultTemperature}
            onChange={(e) => onChange({ ...config, defaultTemperature: parseFloat(e.target.value) })}
            className="w-full accent-purple-500 cursor-pointer mt-2"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Citation Mode</label>
          <select
            value={config.citationMode}
            onChange={(e) => onChange({ ...config, citationMode: e.target.value as any })}
            className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--heading)] p-2.5 rounded-xl font-sans focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="Verbose">Verbose (Full snippets & page refs)</option>
            <option value="Compact">Compact (Minimal badge refs)</option>
            <option value="Minimal">Minimal (Footnote numbers only)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default RetrievalSettings

