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
        'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80',
        'transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shadow-sm',
        className
      )}
    >
      {isLoading ? (
        <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
      ) : (
        <Github size={15} className="text-purple-400 shrink-0" />
      )}
      <span className="whitespace-nowrap">{isLoading ? 'Syncing...' : 'Sync Now'}</span>
    </button>
  )
}
