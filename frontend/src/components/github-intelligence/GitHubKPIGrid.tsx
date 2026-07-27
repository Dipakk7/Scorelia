import React from 'react'
import { githubHeroMockData, type GitHubKPIMetric } from '@/data/githubHeroMockData'
import { GitHubKPICard } from './GitHubKPICard'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export interface GitHubKPIGridProps {
  metrics?: GitHubKPIMetric[]
  isLoading?: boolean
  onCardClick?: (kpi: GitHubKPIMetric) => void
  className?: string
}

export const GitHubKPIGrid: React.FC<GitHubKPIGridProps> = ({
  metrics = githubHeroMockData.kpis,
  isLoading = false,
  onCardClick,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4', className)}>
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 flex flex-col justify-between h-36 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4', className)}>
      {metrics.map((kpi) => (
        <GitHubKPICard
          key={kpi.id}
          kpi={kpi}
          onClick={() => onCardClick?.(kpi)}
        />
      ))}
    </div>
  )
}
