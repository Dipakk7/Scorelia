import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { TimeRange } from '@/data/ragAnalyticsMockData'
import { MOCK_TIME_RANGE_DATA } from '@/data/ragAnalyticsMockData'
import { useRAGAnalytics } from '@/hooks/useRAGAnalytics'
import { AnalyticsHeader } from './AnalyticsHeader'
import { AnalyticsOverview } from './AnalyticsOverview'
import { PerformanceSection } from './PerformanceSection'
import { RetrievalQualitySection } from './RetrievalQualitySection'
import { SystemHealthSection } from './SystemHealthSection'
import { ActivityFeed } from './ActivityFeed'
import { DiagnosticsPanel } from './DiagnosticsPanel'
import { AlertCenter } from './AlertCenter'
import { cn } from '@/lib/utils'

export interface RetrievalAnalyticsWorkspaceProps {
  className?: string
}

export function RetrievalAnalyticsWorkspace({ className }: RetrievalAnalyticsWorkspaceProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')

  const { analyticsData } = useRAGAnalytics(timeRange)

  const currentDataset = useMemo(() => {
    return analyticsData || MOCK_TIME_RANGE_DATA[timeRange] || MOCK_TIME_RANGE_DATA['24h']
  }, [analyticsData, timeRange])

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Retrieval Analytics Workspace"
      className={cn('space-y-6 text-left', className)}
    >
      {/* 1. Analytics Header with Time-Range Selector */}
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* 2. Overview Metrics Grid (6 KPI Cards) */}
      <AnalyticsOverview kpiData={currentDataset.kpi} />

      {/* 3. Operational Alerts Center */}
      <AlertCenter />

      {/* 4. Query Performance Charts Section (Latency, Throughput, Search Trends) */}
      <PerformanceSection
        latencyData={currentDataset.latency}
        throughputData={currentDataset.throughput}
        searchTrendsData={currentDataset.searchTrends}
      />

      {/* 5. Retrieval Quality Metrics Section (Similarity Distribution, Precision/Recall) */}
      <RetrievalQualitySection />

      {/* 6. System Health, Infrastructure Resources & Service Status */}
      <SystemHealthSection />

      {/* 7. Integrity Diagnostics & Operational Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DiagnosticsPanel />
        </div>
        <div className="lg:col-span-5">
          <ActivityFeed />
        </div>
      </div>
    </motion.div>
  )
}

export default RetrievalAnalyticsWorkspace
