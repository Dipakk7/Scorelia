import React, { useState } from 'react'
import { Filter, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface FilterState {
  dateRange: string
  phase: string
  category: string
  status: string
}

export interface ReportFiltersProps {
  onApplyFilters?: (filters: FilterState) => void
  onResetFilters?: () => void
  className?: string
}

const initialFilters: FilterState = {
  dateRange: 'all-time',
  phase: 'all-phases',
  category: 'all-categories',
  status: 'all-statuses',
}

export function ReportFilters({
  onApplyFilters,
  onResetFilters,
  className,
}: ReportFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const handleReset = () => {
    setFilters(initialFilters)
    onResetFilters?.()
  }

  const handleApply = () => {
    onApplyFilters?.(filters)
  }

  return (
    <Card className={cn('p-4 sm:p-5 bg-[#121320] border border-white/10 rounded-2xl space-y-3.5 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
          <h4 className="text-xs font-bold text-white tracking-tight uppercase m-0">
            Report View Filters
          </h4>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-[10px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Filter 1: Date Range */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="w-full bg-[#0b0c14] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
            aria-label="Filter by Date Range"
          >
            <option value="all-time">All Time</option>
            <option value="last-30">Last 30 Days</option>
            <option value="last-90">Last 90 Days</option>
            <option value="this-year">This Year</option>
          </select>
        </div>

        {/* Filter 2: Roadmap Phase */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Roadmap Phase
          </label>
          <select
            value={filters.phase}
            onChange={(e) => setFilters({ ...filters, phase: e.target.value })}
            className="w-full bg-[#0b0c14] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
            aria-label="Filter by Roadmap Phase"
          >
            <option value="all-phases">All Phases</option>
            <option value="phase-1">Phase 1: AI Foundations</option>
            <option value="phase-2">Phase 2: Machine Learning</option>
            <option value="phase-3">Phase 3: LLMs &amp; GenAI</option>
            <option value="phase-4">Phase 4: Production AI</option>
          </select>
        </div>

        {/* Filter 3: Skill Category */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Skill Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full bg-[#0b0c14] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
            aria-label="Filter by Skill Category"
          >
            <option value="all-categories">All Categories</option>
            <option value="python">Python Programming</option>
            <option value="ml">Machine Learning</option>
            <option value="dl">Deep Learning</option>
            <option value="llm">LLMs &amp; RAG</option>
            <option value="mlops">MLOps &amp; Cloud</option>
          </select>
        </div>

        {/* Filter 4: Milestone Status */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Milestone Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full bg-[#0b0c14] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
            aria-label="Filter by Milestone Status"
          >
            <option value="all-statuses">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={handleApply}
          className="text-xs font-semibold py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer border-none"
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  )
}
export default ReportFilters
