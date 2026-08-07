import React from 'react'
import type { EmbeddingSettingsConfig } from '@/data/ragSettingsMockData'

export interface EmbeddingSettingsProps {
  config: EmbeddingSettingsConfig
  onChange: (config: EmbeddingSettingsConfig) => void
}

export function EmbeddingSettings({ config, onChange }: EmbeddingSettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-5 select-none">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="text-sm font-bold text-[var(--heading)] uppercase tracking-wider">Embedding Model & Provider</h3>
        <p className="text-xs text-[var(--muted)]">Select neural embedding models for generating vector representations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Embedding Provider</label>
          <select
            value={config.provider}
            onChange={(e) => onChange({ ...config, provider: e.target.value as any })}
            className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--heading)] p-2.5 rounded-xl font-sans focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="Ollama Local">Ollama Local (Offline)</option>
            <option value="Nomic AI">Nomic AI Cloud</option>
            <option value="OpenAI">OpenAI text-embedding-3</option>
            <option value="Cohere">Cohere Embed v3</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Model Name</label>
          <input
            type="text"
            value={config.model}
            onChange={(e) => onChange({ ...config, model: e.target.value })}
            className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--heading)] p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Vector Dimensions</label>
          <input
            type="number"
            value={config.dimension}
            onChange={(e) => onChange({ ...config, dimension: Number(e.target.value) })}
            className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--heading)] p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[var(--heading)] block">Batch Processing Size</label>
          <input
            type="number"
            value={config.batchSize}
            onChange={(e) => onChange({ ...config, batchSize: Number(e.target.value) })}
            className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--heading)] p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>
    </div>
  )
}

export default EmbeddingSettings

