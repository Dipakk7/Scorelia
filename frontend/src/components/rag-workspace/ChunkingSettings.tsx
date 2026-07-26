import React from 'react'
import type { ChunkingSettingsConfig } from '@/data/ragSettingsMockData'

export interface ChunkingSettingsProps {
  config: ChunkingSettingsConfig
  onChange: (config: ChunkingSettingsConfig) => void
}

export function ChunkingSettings({ config, onChange }: ChunkingSettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-5">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Document Chunking Strategy</h3>
        <p className="text-xs text-slate-400">Configure text splitting boundaries, overlap, and token windows.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Chunk Size (Tokens)</label>
          <input
            type="number"
            value={config.chunkSize}
            onChange={(e) => onChange({ ...config, chunkSize: Number(e.target.value) })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Chunk Overlap (Tokens)</label>
          <input
            type="number"
            value={config.overlap}
            onChange={(e) => onChange({ ...config, overlap: Number(e.target.value) })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Splitting Algorithm</label>
          <select
            value={config.splitStrategy}
            onChange={(e) => onChange({ ...config, splitStrategy: e.target.value as any })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-sans"
          >
            <option value="Recursive Character">Recursive Character Text Splitter</option>
            <option value="Token Based">Tiktoken / Tokenizer Window</option>
            <option value="Markdown Heading">Markdown Heading Aware Splitter</option>
            <option value="Semantic Paragraph">Semantic Paragraph Boundaries</option>
          </select>
        </div>

        <div className="space-y-1 flex items-center justify-between pt-4">
          <span className="font-semibold text-slate-300">Preserve Document Metadata in Chunks</span>
          <input
            type="checkbox"
            checked={config.includeMetadata}
            onChange={(e) => onChange({ ...config, includeMetadata: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default ChunkingSettings
