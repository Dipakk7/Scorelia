import React, { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { cn } from '@/lib/utils'

export interface GitHubSyncButtonProps {
  onSync?: () => void
  isLoading?: boolean
  className?: string
}

export const GitHubSyncButton: React.FC<GitHubSyncButtonProps> = ({
  onSync,
  isLoading: externalLoading = false,
  className,
}) => {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading || internalLoading

  const handleClick = () => {
    setInternalLoading(true)
    if (onSync) {
      onSync()
    }
    setTimeout(() => {
      setInternalLoading(false)
    }, 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label="Sync GitHub Data"
      className={cn(
        'inline-flex items-center justify-center gap-2 h-10 px-4 text-xs font-semibold rounded-xl',
        'bg-[var(--surface-hover)] hover:bg-[var(--border)]/50 text-[var(--heading)] border border-[var(--border)]',
        'transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
        className
      )}
    >
      {isLoading ? (
        <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
      ) : (
        <Github size={16} className="text-[var(--heading)] shrink-0" />
      )}
      <span className="whitespace-nowrap">Sync Now</span>
    </button>
  )
}
