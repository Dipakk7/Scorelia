import React from 'react'
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { cn } from '@/lib/utils'

export interface EmptyGitHubHeroStateProps {
  onConnect?: () => void
  className?: string
}

export const EmptyGitHubHeroState: React.FC<EmptyGitHubHeroStateProps> = ({
  onConnect,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[320px] p-8 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-md space-y-5',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <Github size={36} />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg sm:text-xl font-extrabold font-display text-[var(--heading)] tracking-tight m-0">
          No Hero Metrics Available
        </h3>
        <p className="text-xs text-[var(--muted)] leading-relaxed m-0">
          Connect your GitHub profile or trigger a data sync to view real-time repository, commit, pull request, and contribution metrics.
        </p>
      </div>

      <button
        type="button"
        onClick={onConnect}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Github size={16} />
        <span>Connect GitHub Account</span>
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
