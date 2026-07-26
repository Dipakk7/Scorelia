import React from 'react'
import type { EmbeddingSettingsConfig } from '@/data/ragSettingsMockData'

export interface EmbeddingSettingsProps {
  config: EmbeddingSettingsConfig
  onChange: (config: EmbeddingSettingsConfig) => void
}

export function EmbeddingSettings({ config, onChange }: EmbeddingSettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-5">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Embedding Model & Provider</h3>
        <p className="text-xs text-slate-400">Select neural embedding models for generating vector representations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Embedding Provider</label>
          <select
            value={config.provider}
            onChange={(e) => onChange({ ...config, provider: e.target.value as any })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-sans"
          >
            <option value="Ollama Local">Ollama Local (Offline)</option>
            <option value="Nomic AI">Nomic AI Cloud</option>
            <option value="OpenAI">OpenAI text-embedding-3</option>
            <option value="Cohere">Cohere Embed v3</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Model Name</label>
          <input
            type="text"
            value={config.model}
            onChange={(e) => onChange({ ...config, model: e.target.value })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Vector Dimensions</label>
          <input
            type="number"
            value={config.dimension}
            onChange={(e) => onChange({ ...config, dimension: Number(e.target.value) })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Batch Processing Size</label>
          <input
            type="number"
            value={config.batchSize}
            onChange={(e) => onChange({ ...config, batchSize: Number(e.target.value) })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-mono text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default EmbeddingSettings
