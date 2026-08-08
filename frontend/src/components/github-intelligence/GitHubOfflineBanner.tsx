import React from 'react'
import { WifiOff, RefreshCw, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GitHubOfflineBannerProps {
  isOffline?: boolean
  lastSync?: string
  onReconnect?: () => void
  className?: string
}

export const GitHubOfflineBanner: React.FC<GitHubOfflineBannerProps> = ({
  isOffline = false,
  lastSync = '10 minutes ago',
  onReconnect,
  className,
}) => {
  if (!isOffline) return null

  return (
    <div
      role="alert"
      className={cn(
        'p-3 px-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-md shadow-lg font-sans text-xs flex flex-wrap items-center justify-between gap-3 text-left select-none',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
          <WifiOff size={14} />
        </div>
        <div className="truncate">
          <span className="font-bold text-white">Working Offline: </span>
          <span className="text-slate-300">Displaying cached GitHub intelligence data.</span>
          <span className="text-[10px] text-slate-400 font-mono ml-2 inline-flex items-center gap-1">
            <Clock size={10} /> Last synced {lastSync}
          </span>
        </div>
      </div>

      {onReconnect && (
        <button
          type="button"
          onClick={onReconnect}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/20 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <RefreshCw size={12} />
          <span>Reconnect</span>
        </button>
      )}
    </div>
  )
}

export default GitHubOfflineBanner
