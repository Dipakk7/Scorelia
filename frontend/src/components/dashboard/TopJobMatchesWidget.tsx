import React from 'react'

export interface JobMatchItem {
  title: string
  company: string
  location: string
  matchScore: number
}

const DEFAULT_JOBS: JobMatchItem[] = [
  { title: 'ML Engineer', company: 'Google', location: 'Bengaluru, India', matchScore: 92 },
  { title: 'AI Engineer', company: 'Microsoft', location: 'Hyderabad, India', matchScore: 88 },
  { title: 'Machine Learning Engineer', company: 'Amazon', location: 'Pune, India', matchScore: 82 },
  { title: 'Research Engineer', company: 'OpenAI', location: 'Remote', matchScore: 78 },
]

interface TopJobMatchesWidgetProps {
  jobs?: JobMatchItem[]
  onViewAll?: () => void
}

export const TopJobMatchesWidget: React.FC<TopJobMatchesWidgetProps> = React.memo(({
  jobs = DEFAULT_JOBS,
  onViewAll,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md space-y-3.5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--heading)] tracking-tight">Top Job Matches</h3>
        <button
          onClick={onViewAll}
          className="text-[10px] font-mono text-purple-400 hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {jobs.map((job, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-[var(--surface-hover)]/40 border border-[var(--border)]/60 hover:border-[var(--primary)]/30 transition-all flex items-center justify-between gap-3 text-xs"
          >
            <div className="min-w-0 flex-1">
              <span className="font-bold text-[var(--heading)] block truncate leading-tight">{job.title}</span>
              <span className="text-[10px] text-[var(--muted-color)] font-mono block truncate leading-tight">
                {job.company} • {job.location}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {job.matchScore}% Match
              </span>
              <button className="text-[10px] font-semibold text-purple-400 hover:text-[var(--heading)] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] cursor-pointer">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
export default TopJobMatchesWidget
