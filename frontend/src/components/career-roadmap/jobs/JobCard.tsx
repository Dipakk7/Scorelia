import React, { memo } from 'react'
import { MapPin, DollarSign, Clock, ArrowRight, Bookmark, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { JobOpportunityItem } from '@/types/careerRoadmap'

export interface JobCardProps {
  job: JobOpportunityItem
  onApply?: (id: string) => void
  onSave?: (id: string) => void
  className?: string
}

export const JobCard = memo(function JobCard({
  job,
  onApply,
  onSave,
  className,
}: JobCardProps) {
  const isHighMatch = job.matchScore >= 90
  const isGoodMatch = job.matchScore >= 80 && job.matchScore < 90

  return (
    <Card
      className={cn(
        'p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm hover:border-purple-500/30 transition-all text-left flex flex-col justify-between h-full',
        job.featured ? 'border-purple-500/30 bg-gradient-to-b from-[#14162e] to-[#121426]' : '',
        className
      )}
    >
      <div className="space-y-3">
        {/* Header Row: Company Initials Avatar + Title & Match Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-extrabold text-sm flex items-center justify-center shrink-0">
              {job.companyInitials}
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase tracking-wider block">
                {job.company}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug m-0">
                {job.title}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span
              className={cn(
                'text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border',
                isHighMatch
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : isGoodMatch
                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              )}
            >
              {job.matchScore}% Match
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-1">
              {job.postedAgo}
            </span>
          </div>
        </div>

        {/* Location, Remote & Salary Meta Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>{job.location}</span>
          </span>

          {job.isRemote && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Remote
            </span>
          )}

          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <DollarSign className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{job.salary}</span>
          </span>
        </div>

        {/* Skill Matching Section */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" aria-hidden="true" />
              <span>Matching Skills</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {job.matchingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-semibold text-emerald-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {job.missingSkills.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-rose-400" aria-hidden="true" />
                <span>Skill Gaps to Close</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono font-semibold text-rose-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-3 border-t border-white/5 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSave?.(job.id)}
          className="p-2.5 min-h-[44px] rounded-xl border-white/10 bg-[#0b0c14] hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
          aria-label={`Save ${job.title}`}
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onApply?.(job.id)}
          className="flex-1 justify-center gap-2 text-xs font-bold py-2.5 min-h-[44px] rounded-xl bg-purple-600 hover:bg-purple-500 text-white border-none cursor-pointer shadow-sm"
          aria-label={`Apply to ${job.title} at ${job.company}`}
        >
          <span>Apply Opportunity</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  )
})
export default JobCard
