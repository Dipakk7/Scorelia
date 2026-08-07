import React from 'react'
import { motion } from 'framer-motion'
import {
  Map,
  Target,
  Flag,
  FileText,
  BookOpen,
  Briefcase,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { TimelineContainer } from './timeline/TimelineContainer'
import { SkillsGapAnalytics } from './skills-gap/SkillsGapAnalytics'
import { MilestonesWorkspace } from './milestones/MilestonesWorkspace'
import { ReportsWorkspace } from './reports/ReportsWorkspace'
import { RecommendedJobsWorkspace } from './jobs/RecommendedJobsWorkspace'
import { WorkspaceSectionHeader } from './common/WorkspaceSectionHeader'
import { getSectionVariants, useScoreliaReducedMotion } from '@/lib/motion'
import type { RoadmapTabId } from './CareerRoadmapTabs'

export interface CareerRoadmapWorkspaceProps {
  activeTab: RoadmapTabId
}

export function CareerRoadmapWorkspace({ activeTab }: CareerRoadmapWorkspaceProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const sectionVariants = getSectionVariants(shouldReduceMotion)
  if (activeTab === 'roadmap') {
    return (
      <motion.div
        key="roadmap"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        id="tabpanel-roadmap"
        role="tabpanel"
        aria-labelledby="tab-roadmap"
        className="space-y-4 sm:space-y-5 text-left"
      >
        <WorkspaceSectionHeader
          title="Career Execution Roadmap"
          subtitle="Step-by-step career progression phases, key target skills, and actionable learning milestones."
          icon={Map}
          badgeText="Interactive Timeline"
        />
        <TimelineContainer />
      </motion.div>
    )
  }

  if (activeTab === 'skills-gap') {
    return (
      <motion.div
        key="skills-gap"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        id="tabpanel-skills-gap"
        role="tabpanel"
        aria-labelledby="tab-skills-gap"
        className="space-y-4 sm:space-y-5 text-left"
      >
        <WorkspaceSectionHeader
          title="Skills Gap & Competency Analysis"
          subtitle="In-depth breakdown of required skills, proficiency coverage, and AI-recommended priority areas."
          icon={Target}
          badgeText="AI Audit Active"
        />
        <SkillsGapAnalytics />
      </motion.div>
    )
  }

  if (activeTab === 'milestones') {
    return (
      <motion.div
        key="milestones"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        id="tabpanel-milestones"
        role="tabpanel"
        aria-labelledby="tab-milestones"
        className="space-y-4 sm:space-y-5 text-left"
      >
        <WorkspaceSectionHeader
          title="Roadmap Milestones & Key Goals"
          subtitle="Track your career achievement goals, quarterly targets, and step-by-step milestone completions."
          icon={Flag}
          badgeText="Tracking Enabled"
        />
        <MilestonesWorkspace />
      </motion.div>
    )
  }

  if (activeTab === 'reports') {
    return (
      <motion.div
        key="reports"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        id="tabpanel-reports"
        role="tabpanel"
        aria-labelledby="tab-reports"
        className="space-y-4 sm:space-y-5 text-left"
      >
        <WorkspaceSectionHeader
          title="Export & Performance Analytics Reports"
          subtitle="Generate executive summary reports, export high-resolution roadmaps, and download progress logs."
          icon={FileText}
          badgeText="PDF & Markdown Ready"
        />
        <ReportsWorkspace />
      </motion.div>
    )
  }

  if (activeTab === 'recommended-jobs') {
    return (
      <motion.div
        key="recommended-jobs"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        id="tabpanel-recommended-jobs"
        role="tabpanel"
        aria-labelledby="tab-recommended-jobs"
        className="space-y-4 sm:space-y-5 text-left"
      >
        <WorkspaceSectionHeader
          title="Recommended Jobs & Opportunity Matching"
          subtitle="AI-matched target role opportunities, match score audit, skill gap recommendations, and ATS tips."
          icon={Briefcase}
          badgeText="Live AI Matching"
        />
        <RecommendedJobsWorkspace />
      </motion.div>
    )
  }

  const getFallbackIcon = () => {
    switch (activeTab) {
      case 'resources':
        return BookOpen
      case 'progress-tracker':
        return TrendingUp
      default:
        return Clock
    }
  }

  const getFallbackBadge = () => {
    switch (activeTab) {
      case 'resources':
        return 'Curated Library'
      case 'progress-tracker':
        return 'Analytics Online'
      default:
        return 'Reserved Module'
    }
  }

  const FallbackIcon = getFallbackIcon()

  return (
    <motion.div
      key={activeTab}
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      id={`tabpanel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      className="space-y-4 sm:space-y-5 text-left"
    >
      <WorkspaceSectionHeader
        title={`${activeTab.replace(/-/g, ' ')} Module`}
        subtitle={`Workspace container reserved for ${activeTab.replace(/-/g, ' ')}. Features will be connected in future phases.`}
        icon={FallbackIcon}
        badgeText={getFallbackBadge()}
      />
      <Card className="p-8 sm:p-12 bg-[#121426] border border-white/10 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <FallbackIcon className="h-6 w-6" aria-hidden="true" />
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
    </motion.div>
  )
}
export default CareerRoadmapWorkspace
