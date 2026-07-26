import React from 'react'
import {
  Folder,
  FileText,
  Layers,
  Cpu,
  Target,
  Activity
} from 'lucide-react'
import { KPICard } from './KPICard'
import { cn } from '@/lib/utils'

export interface KPIGridProps {
  className?: string
}

export function KPIGrid({ className }: KPIGridProps) {
  const kpis = [
    {
      id: 'collections',
      title: 'Collections',
      numericValue: 12,
      trend: '↑ 2 this week',
      trendType: 'positive' as const,
      icon: Folder,
      iconBgColor: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400'
    },
    {
      id: 'documents',
      title: 'Documents',
      numericValue: 1248,
      trend: '↑ 166 this week',
      trendType: 'positive' as const,
      icon: FileText,
      iconBgColor: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      id: 'chunks',
      title: 'Chunks',
      numericValue: 8732,
      trend: '↑ 964 this week',
      trendType: 'positive' as const,
      icon: Layers,
      iconBgColor: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      id: 'embeddings',
      title: 'Vector Embeddings',
      numericValue: 8732,
      subtext: '153.4 MB',
      icon: Cpu,
      iconBgColor: 'bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-400'
    },
    {
      id: 'retrievalScore',
      title: 'Avg Retrieval Score',
      numericValue: 0.92,
      decimals: 2,
      badgeText: 'Excellent',
      icon: Target,
      iconBgColor: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'queriesToday',
      title: 'Queries Today',
      numericValue: 3421,
      trend: '↑ 18%',
      trendType: 'positive' as const,
      icon: Activity,
      iconBgColor: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400'
    }
  ]

  return (
    <div
      aria-label="Key Performance Indicators Summary"
      className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4', className)}
    >
      {kpis.map((kpi) => (
        <KPICard key={kpi.id} {...kpi} />
      ))}
    </div>
  )
}

export default KPIGrid
