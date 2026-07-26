import React from 'react'
import { Calendar, Filter, RefreshCw, Download, Bot } from 'lucide-react'
import { mockAgentsData } from '@/data/agentConsoleMockData'
import { cn } from '@/lib/utils'

export type TimeRangeValue = '24h' | '7d' | '30d' | '90d'

export interface AnalyticsToolbarProps {
  timeRange: TimeRangeValue
  onTimeRangeChange: (range: TimeRangeValue) => void
  selectedAgentId: string
  onAgentIdChange: (id: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  onRefresh?: () => void
  onExport?: () => void
  className?: string
}

export function AnalyticsToolbar({
  timeRange,
  onTimeRangeChange,
  selectedAgentId,
  onAgentIdChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  onExport,
  className,
}: AnalyticsToolbarProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg text-left text-xs', className)}>
      {/* Time Range Selector Buttons */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0b0c14] border border-white/10 select-none">
        <Calendar size={14} className="text-purple-400 ml-2 mr-1" />
        <button
          type="button"
          onClick={() => onTimeRangeChange('24h')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer',
            timeRange === '24h' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          )}
        >
          24h
        </button>
        <button
          type="button"
          onClick={() => onTimeRangeChange('7d')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer',
            timeRange === '7d' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          )}
        >
          7 Days
        </button>
        <button
          type="button"
          onClick={() => onTimeRangeChange('30d')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer',
            timeRange === '30d' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          )}
        >
          30 Days
        </button>
        <button
          type="button"
          onClick={() => onTimeRangeChange('90d')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer',
            timeRange === '90d' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          )}
        >
          90 Days
        </button>
      </div>

      {/* Dropdown Filters & Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Agent Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
          <Bot size={13} className="text-slate-400" />
          <select
            value={selectedAgentId}
            onChange={(e) => onAgentIdChange(e.target.value)}
            aria-label="Filter analytics by agent"
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#111322]">All Agents</option>
            {mockAgentsData.map((agent) => (
              <option key={agent.id} value={agent.id} className="bg-[#111322]">
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
          <Filter size={13} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            aria-label="Filter analytics by status"
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#111322]">All Tasks</option>
            <option value="success" className="bg-[#111322] text-emerald-400">Successful Only</option>
            <option value="failed" className="bg-[#111322] text-rose-400">Failed Only</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Refresh Analytics Telemetry"
        >
          <RefreshCw size={14} />
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}

export default AnalyticsToolbar
