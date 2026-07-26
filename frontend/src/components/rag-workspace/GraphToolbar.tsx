import React from 'react'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  SlidersHorizontal
} from 'lucide-react'
import type { NodeType } from '@/data/ragKnowledgeGraphMockData'
import { cn } from '@/lib/utils'

export type GraphLayoutMode = 'Force' | 'Hierarchical' | 'Radial' | 'Circular'

export interface GraphToolbarProps {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onFitToScreen: () => void
  layoutMode: GraphLayoutMode
  onLayoutModeChange: (mode: GraphLayoutMode) => void
  selectedNodeType: NodeType | 'all'
  onNodeTypeFilterChange: (type: NodeType | 'all') => void
  searchQuery: string
  onSearchChange: (query: string) => void
  showLegend: boolean
  onToggleLegend: () => void
  className?: string
}

export function GraphToolbar({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToScreen,
  layoutMode,
  onLayoutModeChange,
  selectedNodeType,
  onNodeTypeFilterChange,
  searchQuery,
  onSearchChange,
  showLegend,
  onToggleLegend,
  className
}: GraphToolbarProps) {
  const layouts: GraphLayoutMode[] = ['Force', 'Hierarchical', 'Radial', 'Circular']
  const nodeTypes: { id: NodeType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'collection', label: 'Collections' },
    { id: 'document', label: 'Documents' },
    { id: 'topic', label: 'Topics' },
    { id: 'entity', label: 'Entities' },
    { id: 'embedding', label: 'Embeddings' }
  ]

  return (
    <div className={cn('p-3 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left flex flex-wrap items-center justify-between gap-3', className)}>
      {/* 1. Zoom Controls */}
      <div className="flex items-center gap-1 bg-[#121320] p-1 rounded-xl border border-white/5">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>
        <span className="text-[11px] font-mono text-purple-300 font-bold px-1.5 select-none">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
        <button
          type="button"
          onClick={onResetView}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Reset View"
        >
          <RefreshCw size={14} />
        </button>
        <button
          type="button"
          onClick={onFitToScreen}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Fit to Screen"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* 2. Layout Selector */}
      <div className="flex items-center gap-1.5">
        <SlidersHorizontal size={14} className="text-purple-400 shrink-0 hidden sm:block" />
        <select
          value={layoutMode}
          onChange={(e) => onLayoutModeChange(e.target.value as GraphLayoutMode)}
          aria-label="Graph Layout Algorithm"
          className="bg-[#121320] border border-white/10 text-xs text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer font-sans"
        >
          {layouts.map((l) => (
            <option key={l} value={l}>
              {l} Layout
            </option>
          ))}
        </select>
      </div>

      {/* 3. Node Type Filters */}
      <div className="flex items-center gap-1.5">
        <Filter size={14} className="text-blue-400 shrink-0 hidden sm:block" />
        <select
          value={selectedNodeType}
          onChange={(e) => onNodeTypeFilterChange(e.target.value as any)}
          aria-label="Filter Node Types"
          className="bg-[#121320] border border-white/10 text-xs text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer font-sans"
        >
          {nodeTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Node Search */}
      <div className="relative min-w-[160px] sm:min-w-[200px]">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search node..."
          className="w-full bg-[#121320] border border-white/10 focus:border-purple-500/50 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-400 focus:outline-none font-sans"
        />
      </div>

      {/* 5. Legend Toggle */}
      <button
        type="button"
        onClick={onToggleLegend}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
          showLegend
            ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
            : 'bg-[#121320] border-white/10 text-slate-400 hover:text-white'
        )}
      >
        <Eye size={14} />
        <span>Legend</span>
      </button>
    </div>
  )
}

export default GraphToolbar
