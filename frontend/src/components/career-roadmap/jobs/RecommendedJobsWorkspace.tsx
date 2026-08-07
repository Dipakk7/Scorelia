import React, { memo } from 'react'
import { JobMatchSummary } from './JobMatchSummary'
import { FeaturedOpportunities } from './FeaturedOpportunities'
import { JobCard } from './JobCard'
import { SkillMatchInsights } from './SkillMatchInsights'
import { ApplicationRecommendations } from './ApplicationRecommendations'
import { CareerTipsCard } from './CareerTipsCard'
import { Card } from '@/components/ui/Card'
import { jobOpportunitiesMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'

export interface RecommendedJobsWorkspaceProps {
  className?: string
}

export const RecommendedJobsWorkspace = memo(function RecommendedJobsWorkspace({
  className,
}: RecommendedJobsWorkspaceProps) {
  const allJobs = jobOpportunitiesMockData
  const otherJobs = allJobs.filter((j) => !j.featured)

  return (
    <div className={cn('space-y-4 sm:space-y-5 text-left', className)}>
      {/* 1. Job Match Summary KPIs */}
      <JobMatchSummary />

      {/* 2. Featured AI Opportunities */}
      <FeaturedOpportunities />

      {/* 3. Recommended Jobs Grid */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left hover:border-purple-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white tracking-tight m-0">
              All Recommended Opportunities
            </h3>
            <p className="text-xs text-slate-400 font-medium m-0">
              Personalized job openings matching your current skills & target role
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full font-mono">
            {otherJobs.length} Roles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </Card>

      {/* 4. Skill Match Insights */}
      <SkillMatchInsights />

      {/* 5. Application Recommendations */}
      <ApplicationRecommendations />

      {/* 6. Strategic Career Tips */}
      <CareerTipsCard />
    </div>
  )
})
export default RecommendedJobsWorkspace
