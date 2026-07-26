import React from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { SearchSettings } from '@/data/ragQueryMockData'
import { cn } from '@/lib/utils'

export interface SearchConfigurationProps {
  settings: SearchSettings
  onSettingsChange: (newSettings: SearchSettings) => void
  className?: string
}

export function SearchConfiguration({
  settings,
  onSettingsChange,
  className
}: SearchConfigurationProps) {
  return (
    <div className={cn('p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-purple-400 shrink-0" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Retrieval Parameters
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
        {/* 1. Search Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">Search Type</label>
          <select
            value={settings.searchType}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                searchType: e.target.value as SearchSettings['searchType']
              })
            }
            aria-label="Select search type"
            className="w-full bg-[#121320] border border-white/10 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="Hybrid">Hybrid (Semantic + BM25)</option>
            <option value="Semantic">Semantic Only</option>
            <option value="Keyword">BM25 Keyword</option>
          </select>
        </div>

        {/* 2. Top K */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">Top-K Results</label>
          <select
            value={settings.topK}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                topK: Number(e.target.value)
              })
            }
            aria-label="Select Top-K count"
            className="w-full bg-[#121320] border border-white/10 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer font-mono"
          >
            <option value={3}>3 Chunks</option>
            <option value={5}>5 Chunks</option>
            <option value={10}>10 Chunks</option>
            <option value={15}>15 Chunks</option>
            <option value={20}>20 Chunks</option>
          </select>
        </div>

        {/* 3. Rerank Toggle */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">Cohere Rerank</label>
          <button
            type="button"
            onClick={() =>
              onSettingsChange({
                ...settings,
                rerank: !settings.rerank
              })
            }
            className={cn(
              'w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer',
              settings.rerank
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                : 'bg-[#121320] border-white/10 text-slate-400'
            )}
          >
            <span>Cross-Encoder</span>
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded font-mono', settings.rerank ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-400')}>
              {settings.rerank ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* 4. Temperature Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="font-medium text-slate-400">Temperature</span>
            <span className="font-mono text-purple-300 font-bold">{settings.temperature.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                temperature: parseFloat(e.target.value)
              })
            }
            aria-label="Temperature slider"
            className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
          />
        </div>

        {/* 5. Source Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">Source Filter</label>
          <select
            value={settings.sourceFilter}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                sourceFilter: e.target.value
              })
            }
            aria-label="Select source filter"
            className="w-full bg-[#121320] border border-white/10 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="all">All Collections</option>
            <option value="current">Current Collection</option>
            <option value="pinned">Pinned Collections</option>
            <option value="custom">Custom Filter</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchConfiguration
