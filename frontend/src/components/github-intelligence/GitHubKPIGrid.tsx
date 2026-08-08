import React from 'react'
import { githubHeroMockData, type GitHubKPIMetric } from '@/data/githubHeroMockData'
import { GitHubKPICard } from './GitHubKPICard'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export interface GitHubKPIGridProps {
  metrics?: GitHubKPIMetric[]
  selectedKpiId?: string
  isLoading?: boolean
  onCardClick?: (kpi: GitHubKPIMetric) => void
  className?: string
}

export const GitHubKPIGrid: React.FC<GitHubKPIGridProps> = ({
  metrics = githubHeroMockData.kpis,
  selectedKpiId,
  isLoading = false,
  onCardClick,
  className,
}) => {
  if (isLoading) {
    return (
      <section aria-label="Executive GitHub KPIs Loading" className="w-full">
        <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 lg:gap-4 w-full animate-pulse', className)}>
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-[#0f101c] flex flex-col justify-between h-36 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-8 rounded-xl bg-slate-800" />
                <Skeleton className="h-4 w-12 rounded bg-slate-800/60" />
              </div>
              <Skeleton className="h-7 w-20 rounded-lg bg-slate-800" />
              <Skeleton className="h-8 w-full rounded-lg bg-slate-800/50" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Executive GitHub KPIs" className="w-full">
      <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 lg:gap-4 w-full', className)}>
        {(metrics ?? []).map((kpi) => (
          <GitHubKPICard
            key={kpi.id}
            kpi={kpi}
            isSelected={selectedKpiId === kpi.id}
            onClick={() => onCardClick?.(kpi)}
          />
        ))}
      </div>
    </section>
  )
}
