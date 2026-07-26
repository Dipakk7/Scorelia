import React from 'react'
import { Database } from 'lucide-react'
import { analyticsReportsMockData } from '@/data/analyticsReportsMockData'
import type { DataSourceItem } from '@/data/analyticsReportsMockData'
import { DataSourceCard } from './DataSourceCard'

interface DataSourcesSummaryProps {
  dataSources?: DataSourceItem[]
  className?: string
}

export function DataSourcesSummary({
  dataSources = analyticsReportsMockData.dataSources,
  className = '',
}: DataSourcesSummaryProps) {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight flex items-center gap-2">
          <Database size={16} className="text-purple-400" />
          Connected Data Sources & Infrastructure Intelligence
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Real-time telemetry and query performance across connected storage engines
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {dataSources.map((source) => (
          <DataSourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  )
}

export default DataSourcesSummary
