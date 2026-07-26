import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ViewToggle } from './ViewToggle'
import { TimelineView } from './TimelineView'
import { BoardView } from './BoardView'
import { RecommendedNextSteps } from './RecommendedNextSteps'
import { SkeletonTimeline } from '../common/SkeletonTimeline'
import { useRoadmapTimeline } from '@/hooks/useRoadmapTimeline'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, TimelineViewMode } from '@/types/careerRoadmap'

export interface TimelineContainerProps {
  phases?: RoadmapPhase[]
  initialViewMode?: TimelineViewMode
  onExpandPhaseDetails?: (phaseId: string) => void
  onStepAction?: (stepId: string) => void
  className?: string
}

export function TimelineContainer({
  phases: propPhases,
  initialViewMode = 'timeline',
  onExpandPhaseDetails,
  onStepAction,
  className,
}: TimelineContainerProps) {
  const [viewMode, setViewMode] = useState<TimelineViewMode>(initialViewMode)
  const { phases: hookPhases, isLoading } = useRoadmapTimeline()

  const activePhases = propPhases || hookPhases

  if (isLoading && activePhases.length === 0) {
    return <SkeletonTimeline />
  }

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* Main 12-Month Roadmap Workspace Card */}
      <Card className="p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-6 shadow-sm">
        {/* Workspace Card Header & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1 text-left">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight m-0">
              Your 12-Month Roadmap
            </h2>
            <p className="text-xs text-slate-400 font-medium m-0">
              Follow this structured path to build the skills and experience you need.
            </p>
          </div>

          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Dynamic View Render */}
        {viewMode === 'timeline' ? (
          <TimelineView phases={activePhases} onExpandDetails={onExpandPhaseDetails} />
        ) : (
          <BoardView phases={activePhases} onExpandDetails={onExpandPhaseDetails} />
        )}
      </Card>

      {/* Recommended Next Steps Section */}
      <RecommendedNextSteps onStepAction={onStepAction} />
    </div>
  )
}
export default TimelineContainer
