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
    <div className={cn('p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left flex flex-wrap items-center justify-between gap-3', className)}>
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents by name, collection, or text..."
            className="w-full bg-[#121320] border border-white/10 focus:border-purple-500/50 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-400 focus:outline-none font-sans"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-purple-400 shrink-0 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as any)}
            aria-label="Filter documents by status"
            className="bg-[#121320] border border-white/10 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer font-sans"
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
            className="bg-[#121320] border border-white/10 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer font-sans"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer shrink-0 min-h-[44px]"
      >
        <Upload size={14} />
        <span>Upload Documents</span>
      </button>
    </div>
  )
}

export default DocumentsToolbar
