import React from 'react'
import { Search, Filter, ArrowUpDown, Upload, Plus } from 'lucide-react'
import type { DocumentStatus } from '@/data/ragDocumentsMockData'
import { cn } from '@/lib/utils'

export interface DocumentsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: DocumentStatus | 'all'
  onStatusFilterChange: (status: DocumentStatus | 'all') => void
  sortOption: string
  onSortChange: (sort: string) => void
  onUploadClick: () => void
  className?: string
}

export function DocumentsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortChange,
  onUploadClick,
  className
}: DocumentsToolbarProps) {
  return (
    <div className={cn('p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-left flex flex-wrap items-center justify-between gap-3 select-none', className)}>
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents by name, collection, or text..."
            className="w-full bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 focus:border-purple-500/60 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-sans shadow-inner"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-purple-400 shrink-0 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as any)}
            aria-label="Filter documents by status"
            className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer font-sans shadow-inner"
          >
            <option value="all">All Statuses</option>
            <option value="Indexed">Indexed</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
            <option value="Queued">Queued</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown size={14} className="text-blue-400 shrink-0 hidden sm:block" />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort documents"
            className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer font-sans shadow-inner"
          >
            <option value="newest">Newest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="chunks">Most Chunks</option>
            <option value="size">Largest Size</option>
          </select>
        </div>
      </div>

      {/* Upload Documents CTA */}
      <button
        type="button"
        onClick={onUploadClick}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/25 border border-purple-500/30 hover:scale-[1.02] cursor-pointer shrink-0 min-h-[40px]"
      >
        <Upload size={14} />
        <span>Upload Documents</span>
      </button>
    </div>
  )
}

export default DocumentsToolbar

