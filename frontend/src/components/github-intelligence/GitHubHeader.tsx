import React from 'react'
import { Sparkles } from 'lucide-react'
import { GitHubBreadcrumb } from './GitHubBreadcrumb'

export interface GitHubHeaderProps {
  currentTabLabel?: string
}

export const GitHubHeader: React.FC<GitHubHeaderProps> = ({ currentTabLabel = 'Overview' }) => {
  return (
    <div className="flex flex-col gap-2">
      <GitHubBreadcrumb currentTabLabel={currentTabLabel} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--heading)] tracking-tight m-0">
              GitHub Intelligence
            </h1>
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-sans leading-relaxed m-0 font-normal">
            AI-powered insights to elevate your GitHub presence and developer career.
          </p>
        </div>
      </div>
    </div>
  )
}
