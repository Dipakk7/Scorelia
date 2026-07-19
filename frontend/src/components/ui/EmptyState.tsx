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
  Search,
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'

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
  const shouldReduceMotion = useScoreliaReducedMotion()

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.18, ease: 'easeOut' as const },
    },
  }

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
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--border)] rounded-[var(--radius-card)] bg-[var(--surface)]/40 backdrop-blur-md min-h-[300px] shadow-[var(--shadow-sm)]',
        className
      )}
    >
      <motion.div variants={childVariants} className={cn('mb-4 border p-3 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex items-center justify-center', activeStyles)}>
        {icon || <FolderOpen size={30} className="stroke-[1.75]" />}
      </motion.div>
      <motion.h3 variants={childVariants} className="text-base font-bold font-display text-[var(--heading)] mb-1.5">
        {title}
      </motion.h3>
      <motion.p variants={childVariants} className="text-xs text-[var(--muted)] max-w-sm mb-5 font-sans leading-relaxed">
        {description}
      </motion.p>
      {actionLabel && onAction && (
        <motion.div variants={childVariants}>
          <Button variant="primary" size="sm" onClick={onAction} className="rounded-[var(--radius-button)] font-bold hover:shadow-[var(--shadow-md)] transition-all cursor-pointer">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export function EmptyAnalyticsState({ 
  onAction,
  title = "No Analytics Data Available",
  description = "You haven't run enough resume evaluations or mock interviews to view progress trends. Generate some files to start.",
  actionLabel = "Upload Resume"
}: { 
  onAction?: () => void
  title?: string
  description?: string
  actionLabel?: string
}) {
  return (
    <EmptyState
      variant="primary"
      icon={<BarChart2 size={36} />}
      title={title}
      description={description}
      actionLabel={onAction ? actionLabel : undefined}
      onAction={onAction}
    />
  )
}

export function EmptyInterviewsState({ 
  onAction, 
  hasResumes = true, 
  onNavigateToResumes 
}: { 
  onAction?: () => void; 
  hasResumes?: boolean; 
  onNavigateToResumes?: () => void 
}) {
  const showUploadResume = !hasResumes && onNavigateToResumes
  return (
    <EmptyState
      variant="success"
      icon={<Mic size={36} />}
      title={showUploadResume ? "Resume Required for Prep" : "No Mock Sessions Yet"}
      description={showUploadResume 
        ? "AI Mock Interview loops require technical skills context from an active resume to calibrate questions. Please upload a resume first."
        : "Refine your STAR structured storytelling skill set. Create a custom technical or behavioral mock drill today."}
      actionLabel={showUploadResume ? "Upload Resume First" : "Configure Mock Round"}
      onAction={showUploadResume ? onNavigateToResumes : onAction}
    />
  )
}

export function EmptyCoverLettersState({ 
  onAction, 
  hasResumes = true, 
  onNavigateToResumes 
}: { 
  onAction?: () => void; 
  hasResumes?: boolean; 
  onNavigateToResumes?: () => void 
}) {
  const showUploadResume = !hasResumes && onNavigateToResumes
  return (
    <EmptyState
      variant="accent"
      icon={<Sparkles size={36} />}
      title={showUploadResume ? "Resume Required for Cover Letter" : "No Cover Letters Found"}
      description={showUploadResume 
        ? "Scorelia generates custom cover letter pitches by matching resume experience against job descriptions. Please upload a resume first."
        : "Select an analyzed resume and paste target job descriptions to synthesize customized cover letter drafts."}
      actionLabel={showUploadResume ? "Upload Resume First" : "Generate Cover Letter"}
      onAction={showUploadResume ? onNavigateToResumes : onAction}
    />
  )
}

export function EmptyRoadmapsState({ 
  onAction, 
  hasResumes = true, 
  onNavigateToResumes 
}: { 
  onAction?: () => void; 
  hasResumes?: boolean; 
  onNavigateToResumes?: () => void 
}) {
  const showUploadResume = !hasResumes && onNavigateToResumes
  return (
    <EmptyState
      variant="primary"
      icon={<Map size={36} />}
      title={showUploadResume ? "Resume Required for Career Path" : "No Career Plans Maintained"}
      description={showUploadResume 
        ? "Initialize your career pivot roadmap by parsing technical qualifications from a resume first to calibrate skill alignments."
        : "Initialize your career pivot roadmap. Our system tracks skill gaps and generates weekly milestone pathways."}
      actionLabel={showUploadResume ? "Upload Resume First" : "Initialize Career Coach"}
      onAction={showUploadResume ? onNavigateToResumes : onAction}
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

