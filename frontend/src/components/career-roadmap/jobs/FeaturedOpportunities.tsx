import React, { memo } from 'react'
import { Sparkles, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { JobCard } from './JobCard'
import { jobOpportunitiesMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { JobOpportunityItem } from '@/types/careerRoadmap'

export interface FeaturedOpportunitiesProps {
  jobs?: JobOpportunityItem[]
  onApply?: (id: string) => void
  onSave?: (id: string) => void
  className?: string
}

export const FeaturedOpportunities = memo(function FeaturedOpportunities({
  jobs = jobOpportunitiesMockData.filter((j) => j.featured),
  onApply,
  onSave,
  className,
}: FeaturedOpportunitiesProps) {
  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left hover:border-purple-500/30 transition-all', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Featured AI Industry Picks</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            High-match opportunities aligned with your current profile score & skills
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
          Featured Roles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onApply={onApply} onSave={onSave} />
        ))}
      </div>
    </Card>
  )
})
export default FeaturedOpportunities
