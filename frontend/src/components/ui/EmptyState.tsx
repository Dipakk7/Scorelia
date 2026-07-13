import React from 'react'
import {
  FolderOpen,
  BarChart2,
  Mic,
  Sparkles,
  Map,
  Layers,
  Cpu,
  BellOff,
  Briefcase,
  Search
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function Github(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

export interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  variant?: 'primary' | 'success' | 'warning' | 'accent' | 'muted'
}

export function EmptyState({
  icon,
  title = 'No records found',
  description = 'There is no data to show in this view right now.',
  actionLabel,
  onAction,
  className,
  variant = 'primary',
}: EmptyStateProps) {
  const variantStyles = {
    primary: 'text-[var(--primary)] bg-[var(--primary)]/8 border-[var(--primary)]/15',
    success: 'text-[var(--success)] bg-[var(--success)]/8 border-[var(--success)]/15',
    warning: 'text-[var(--warning)] bg-[var(--warning)]/8 border-[var(--warning)]/15',
    accent: 'text-[var(--accent)] bg-[var(--accent)]/8 border-[var(--accent)]/15',
    muted: 'text-[var(--muted)] bg-[var(--divider)] border-[var(--border)]',
  }

  const activeStyles = variantStyles[variant] || variantStyles.primary

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--border)] rounded-[var(--radius-card)] bg-[var(--surface)]/40 backdrop-blur-md min-h-[300px] shadow-[var(--shadow-sm)]',
        className
      )}
    >
      <div className={cn('mb-4 border p-3 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] animate-float flex items-center justify-center', activeStyles)}>
        {icon || <FolderOpen size={30} className="stroke-[1.75]" />}
      </div>
      <h3 className="text-base font-bold font-display text-[var(--heading)] mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-[var(--muted)] max-w-sm mb-5 font-sans leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="rounded-[var(--radius-button)] font-bold hover:shadow-[var(--shadow-md)] transition-all cursor-pointer">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export function EmptyAnalyticsState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="primary"
      icon={<BarChart2 size={36} />}
      title="No Analytics Data Available"
      description="You haven't run enough resume evaluations or mock interviews to view progress trends. Generate some files to start."
      actionLabel={onAction ? "Upload Resume" : undefined}
      onAction={onAction}
    />
  )
}

export function EmptyInterviewsState({ onAction }: { onAction: () => void }) {
  return (
    <EmptyState
      variant="success"
      icon={<Mic size={36} className="animate-float" />}
      title="No Mock Sessions Yet"
      description="Refine your STAR structured storytelling skill set. Create a custom technical or behavioral mock drill today."
      actionLabel="Configure Mock Round"
      onAction={onAction}
    />
  )
}

export function EmptyCoverLettersState({ onAction }: { onAction: () => void }) {
  return (
    <EmptyState
      variant="accent"
      icon={<Sparkles size={36} />}
      title="No Cover Letters Found"
      description="Select an analyzed resume and paste target job descriptions to synthesize customized cover letter drafts."
      actionLabel="Generate Cover Letter"
      onAction={onAction}
    />
  )
}

export function EmptyRoadmapsState({ onAction }: { onAction: () => void }) {
  return (
    <EmptyState
      variant="primary"
      icon={<Map size={36} />}
      title="No Career Plans Maintained"
      description="Initialize your career pivot roadmap. Our system tracks skill gaps and generates weekly milestone pathways."
      actionLabel="Initialize Career Coach"
      onAction={onAction}
    />
  )
}

export function EmptyRagResultsState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="primary"
      icon={<Layers size={36} />}
      title="No Context Chunks Found"
      description="Semantic index query returned no context chunks. Verify collection name and documents ingest status."
      actionLabel={onAction ? "Ingest Document" : undefined}
      onAction={onAction}
    />
  )
}

export function EmptyAgentHistoryState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="primary"
      icon={<Cpu size={36} />}
      title="No Run History"
      description="You haven't run any multi-agent coordinate workflows. Trigger a task payload to monitor results."
      actionLabel={onAction ? "New Task run" : undefined}
      onAction={onAction}
    />
  )
}

export function EmptyGithubState({ onAction }: { onAction: () => void }) {
  return (
    <EmptyState
      variant="muted"
      icon={<Github size={36} />}
      title="No GitHub Repository Connected"
      description="Connect your GitHub account to unlock AI-powered code insights."
      actionLabel="Connect GitHub"
      onAction={onAction}
    />
  )
}

export function EmptyJobsState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="primary"
      icon={<Briefcase size={36} />}
      title="No Job Matches Found"
      description="Scorelia can dynamically evaluate match scores based on candidate profiles vs open job requirements."
      actionLabel={onAction ? "Configure Job Target" : undefined}
      onAction={onAction}
    />
  )
}

export function EmptySearchState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="primary"
      icon={<Search size={36} />}
      title="No Matching Search Results"
      description="Your semantic and keyword indexing queries yielded no documents. Try modifying keywords or clearing filters."
      actionLabel={onAction ? "Reset Query Filters" : undefined}
      onAction={onAction}
    />
  )
}

export function EmptyNotificationsState() {
  return (
    <div className="px-4 py-8 text-center text-xs text-[var(--muted)] italic font-sans flex flex-col items-center justify-center gap-2">
      <BellOff size={20} className="text-[var(--border)] animate-pulse" />
      <span>You are all caught up!</span>
    </div>
  )
}

