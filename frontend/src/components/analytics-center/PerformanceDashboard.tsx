import React from 'react'
import { PerformanceOverviewGrid } from './PerformanceOverviewGrid'
import { ResponseTimeChart } from './ResponseTimeChart'
import { TaskCompletionTrendChart } from './TaskCompletionTrendChart'
import { SystemHealthCard } from './SystemHealthCard'
import { PerformanceSkeleton } from './PerformanceSkeleton'
import { EmptyPerformanceState } from './EmptyPerformanceState'
import { Server } from 'lucide-react'
import { usePerformanceDashboard } from '@/services/analytics/analyticsQueries'

interface PerformanceDashboardProps {
  onViewDetails?: () => void
  onViewReport?: () => void
  className?: string
}

export function PerformanceDashboard({
  onViewDetails,
  onViewReport,
  className = '',
}: PerformanceDashboardProps) {
  const { data, isLoading, isError, refetch } = usePerformanceDashboard()

  if (isLoading) {
    return <PerformanceSkeleton />
  }

  if (isError || !data) {
    return <EmptyPerformanceState onRetry={refetch} />
  }

  return (
    <div className={`space-y-6 lg:space-y-8 ${className}`}>
      {/* 1. 8-Card Performance Overview Grid */}
      <PerformanceOverviewGrid metrics={data.metrics} />

      {/* 2. Dual Recharts Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <ResponseTimeChart data={data.responseTimeTrend} onViewDetails={onViewDetails} />
        <TaskCompletionTrendChart data={data.taskCompletionTrend} onViewReport={onViewReport} />
      </div>

      {/* 3. System Microservices Health Cards Section */}
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-100 flex items-center gap-2 font-display">
            <Server size={16} className="text-purple-400" />
            Infrastructure Microservices Health
          </span>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {data.healthServices.length} / {data.healthServices.length} Services Monitored
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4">
          {data.healthServices.map((service) => (
            <SystemHealthCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PerformanceDashboard
