import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'

export interface GitHubBreadcrumbProps {
  currentTabLabel?: string
}

export const GitHubBreadcrumb: React.FC<GitHubBreadcrumbProps> = ({ currentTabLabel = 'Overview' }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
      <Link
        to="/github-intelligence"
        className="flex items-center gap-1.5 hover:text-[var(--heading)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-md px-1 py-0.5"
      >
        <Github size={14} className="text-purple-400" />
        <span>GitHub Intelligence</span>
      </Link>
      <ChevronRight size={13} className="text-[var(--muted)]/60 shrink-0" />
      <span className="text-[var(--heading)] font-semibold px-1 py-0.5">{currentTabLabel}</span>
    </nav>
  )
}
