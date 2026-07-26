import React from 'react'
import { Clock, Activity, Target, ShieldCheck, Layers, HardDrive } from 'lucide-react'
import type { AnalyticsKPI } from '@/data/ragAnalyticsMockData'
import { KPICard } from './KPICard'
import { cn } from '@/lib/utils'

export interface AnalyticsOverviewProps {
  kpiData: AnalyticsKPI
  className?: string
}

export function AnalyticsOverview({ kpiData, className }: AnalyticsOverviewProps) {
  const cards = [
    {
      id: 'latency',
      title: 'Average Query Latency',
      stringValue: `${kpiData.latencyMs} ms`,
      trend: kpiData.latencyTrend,
      trendType: 'positive' as const, // lower latency is good
      icon: Clock,
      iconBgColor: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400'
    },
    {
      id: 'queries',
      title: 'Queries Processed',
      numericValue: kpiData.queriesProcessed,
      trend: kpiData.queriesTrend,
      trendType: 'positive' as const,
      icon: Activity,
      iconBgColor: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      id: 'similarity',
      title: 'Average Similarity',
      numericValue: kpiData.avgSimilarity,
      decimals: 2,
      badgeText: kpiData.similarityBadge,
      icon: Target,
      iconBgColor: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'accuracy',
      title: 'Retrieval Accuracy',
      stringValue: `${kpiData.accuracyPercent.toFixed(1)}%`,
      trend: kpiData.accuracyTrend,
      trendType: 'positive' as const,
      icon: ShieldCheck,
      iconBgColor: 'bg-cyan-500/10 border-cyan-500/20',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'chunks',
      title: 'Indexed Chunks',
      numericValue: kpiData.indexedChunks,
      badgeText: kpiData.chunksStatus,
      icon: Layers,
      iconBgColor: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      id: 'storage',
      title: 'Embedding Storage',
      stringValue: `${kpiData.storageUsedMB} MB`,
      subtext: kpiData.storageTrend,
      icon: HardDrive,
      iconBgColor: 'bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-400'
    }
  ]

  return (
    <div
      aria-label="Analytics Overview Metrics Grid"
      className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4', className)}
    >
      {cards.map((card) => (
        <KPICard key={card.id} {...card} />
      ))}
    </div>
  )
}

export default AnalyticsOverview
