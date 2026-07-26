import React from 'react'
import { Filter, ArrowUpDown, LayoutGrid, List, Plus } from 'lucide-react'
import { SearchAgents } from './SearchAgents'
import { cn } from '@/lib/utils'

export type StatusFilterValue = 'all' | 'active' | 'paused' | 'offline' | 'error'
export type SortFieldValue = 'name' | 'lastActive' | 'tasksCompleted' | 'successRate' | 'avgResponseTime'
export type ViewModeValue = 'table' | 'grid'

export interface WorkspaceToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: StatusFilterValue
  onStatusFilterChange: (val: StatusFilterValue) => void
  sortField: SortFieldValue
  onSortFieldChange: (field: SortFieldValue) => void
  viewMode: ViewModeValue
  onViewModeChange: (mode: ViewModeValue) => void
  onCreateAgentClick?: () => void
  className?: string
}

export function WorkspaceToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  onSortFieldChange,
  viewMode,
  onViewModeChange,
  onCreateAgentClick,
  className,
}: WorkspaceToolbarProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-center justify-between gap-3 text-left', className)}>
      {/* Search Input */}
      <SearchAgents value={searchQuery} onChange={onSearchChange} />

      {/* Filter, Sort, View Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-xs text-slate-300">
          <Filter size={13} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilterValue)}
            aria-label="Filter agents by status"
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-sans font-semibold"
          >
            <option value="all" className="bg-[#111322] text-slate-200">All Statuses</option>
            <option value="active" className="bg-[#111322] text-emerald-400">Active</option>
            <option value="paused" className="bg-[#111322] text-slate-300">Paused</option>
            <option value="offline" className="bg-[#111322] text-slate-400">Offline</option>
            <option value="error" className="bg-[#111322] text-rose-400">Error</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-xs text-slate-300">
          <ArrowUpDown size={13} className="text-slate-400" />
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortFieldValue)}
            aria-label="Sort agents by field"
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-sans font-semibold"
          >
            <option value="name" className="bg-[#111322] text-slate-200">Sort by Name</option>
            <option value="lastActive" className="bg-[#111322] text-slate-200">Sort by Last Active</option>
            <option value="tasksCompleted" className="bg-[#111322] text-slate-200">Sort by Tasks</option>
            <option value="successRate" className="bg-[#111322] text-slate-200">Sort by Success Rate</option>
            <option value="avgResponseTime" className="bg-[#111322] text-slate-200">Sort by Response Time</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-[#0b0c14] border border-white/10">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            aria-label="Table view"
            aria-pressed={viewMode === 'table'}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              viewMode === 'table' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            )}
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              viewMode === 'grid' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            )}
          >
            <LayoutGrid size={14} />
          </button>
        </div>

        {/* Create Agent Button */}
        <button
          type="button"
          onClick={onCreateAgentClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Create Agent</span>
        </button>
      </div>
    </div>
  )
}

export default WorkspaceToolbar
