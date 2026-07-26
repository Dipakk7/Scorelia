import React from 'react'
import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { TimelineContainer } from './timeline/TimelineContainer'
import { SkillsGapAnalytics } from './skills-gap/SkillsGapAnalytics'
import { MilestonesWorkspace } from './milestones/MilestonesWorkspace'
import { ReportsWorkspace } from './reports/ReportsWorkspace'
import type { RoadmapTabId } from './CareerRoadmapTabs'

export interface CareerRoadmapWorkspaceProps {
  activeTab: RoadmapTabId
}

export function CareerRoadmapWorkspace({ activeTab }: CareerRoadmapWorkspaceProps) {
  if (activeTab === 'roadmap') {
    return (
      <div
        id="tabpanel-roadmap"
        role="tabpanel"
        aria-labelledby="tab-roadmap"
        className="space-y-6 text-left"
      >
        <TimelineContainer />
      </div>
    )
  }

  if (activeTab === 'skills-gap') {
    return (
      <div
        id="tabpanel-skills-gap"
        role="tabpanel"
        aria-labelledby="tab-skills-gap"
        className="space-y-6 text-left"
      >
        <SkillsGapAnalytics />
      </div>
    )
  }

  if (activeTab === 'milestones') {
    return (
      <div
        id="tabpanel-milestones"
        role="tabpanel"
        aria-labelledby="tab-milestones"
        className="space-y-6 text-left"
      >
        <MilestonesWorkspace />
      </div>
    )
  }

  if (activeTab === 'reports') {
    return (
      <div
        id="tabpanel-reports"
        role="tabpanel"
        aria-labelledby="tab-reports"
        className="space-y-6 text-left"
      >
        <ReportsWorkspace />
      </div>
    )
  }

  return (
    <Card
      id={`tabpanel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      className="p-8 sm:p-12 bg-[#121320] border border-white/10 rounded-2xl text-center space-y-4 shadow-sm"
    >
      <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
        <Clock className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto text-center">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight capitalize m-0">
          {activeTab.replace(/-/g, ' ')} Module
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-medium m-0">
          Workspace container reserved for {activeTab.replace(/-/g, ' ')}. Module features will be connected in future phases.
        </p>
      </div>
    </Card>
  )
}
export default CareerRoadmapWorkspace
