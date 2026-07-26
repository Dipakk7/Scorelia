import React from 'react'
import { Sparkles } from 'lucide-react'
import { Breadcrumb } from '../Breadcrumb'
import { LastUpdatedBadge } from './LastUpdatedBadge'
import { HeroActions } from './HeroActions'
import { KPIGrid } from './KPIGrid'
import { SkeletonHero } from '../common/SkeletonHero'
import { useCareerRoadmap } from '@/hooks/useCareerRoadmap'
import type { CareerRoadmapHeroData } from '@/types/careerRoadmap'
import { cn } from '@/lib/utils'

export interface CareerRoadmapHeroProps {
  data?: CareerRoadmapHeroData
  onDownloadRoadmap?: () => void
  onRegenerateRoadmap?: () => void
  onCardAction?: (cardId: string) => void
  className?: string
}

export function CareerRoadmapHero({
  data: propData,
  onDownloadRoadmap,
  onRegenerateRoadmap,
  onCardAction,
  className,
}: CareerRoadmapHeroProps) {
  const { heroData, isLoading } = useCareerRoadmap()
  const data = propData || heroData

  if (isLoading && !data) {
    return <SkeletonHero />
  }

  if (!data) return null

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* Top Header Section */}
      <header className="space-y-4 text-left">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Breadcrumb />
        </div>

        {/* Title Banner & Header Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Title & Subtitle */}
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 m-0">
                <span>{data.title}</span>
                <Sparkles className="h-6 w-6 text-purple-400 fill-purple-400/20 shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" aria-hidden="true" />
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium m-0">
              {data.subtitle}
            </p>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <LastUpdatedBadge timestamp={data.lastUpdated} />
            <HeroActions
              onDownloadRoadmap={onDownloadRoadmap}
              onRegenerateRoadmap={onRegenerateRoadmap}
            />
          </div>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <KPIGrid kpis={data.kpis} onCardAction={onCardAction} />
    </div>
  )
}

export default CareerRoadmapHero
