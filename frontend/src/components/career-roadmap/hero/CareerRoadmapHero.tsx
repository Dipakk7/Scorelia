import React from 'react'
import { Sparkles } from 'lucide-react'
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
    <div className={cn('space-y-4 sm:space-y-5 text-left', className)}>
      {/* Executive Workspace Header Banner Container */}
      <header className="text-left">
        {/* Master Executive Card (Layer 1 Title & Layer 3 Actions Container) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 p-5 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 transition-all duration-200">
          {/* Layer 1: Title & Subtitle Area */}
          <div className="space-y-1.5 text-left min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5 m-0 leading-snug">
                <span>{data.title}</span>
                <Sparkles
                  className="h-6 w-6 text-purple-400 fill-purple-400/20 shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  aria-hidden="true"
                />
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium m-0 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          {/* Layer 3: Primary Action Area */}
          <div className="shrink-0 w-full md:w-auto">
            <HeroActions
              onDownloadRoadmap={onDownloadRoadmap}
              onRegenerateRoadmap={onRegenerateRoadmap}
            />
          </div>
        </div>
      </header>

      {/* Layer 2: Executive KPI Area */}
      <KPIGrid kpis={data.kpis} onCardAction={onCardAction} />
    </div>
  )
}

export default CareerRoadmapHero
