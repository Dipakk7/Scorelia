import React from 'react'
import { AlertTriangle, Lock, RefreshCw, WifiOff, Clock, FileQuestion, ServerCrash } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ErrorType = '401' | '403' | '404' | '429' | '500' | 'network' | 'offline'

export interface GitHubErrorStateProps {
  errorType?: ErrorType
  message?: string
  onRetry?: () => void
  onReconnect?: () => void
  className?: string
}

const ERROR_CONFIG: Record<
  ErrorType,
  { title: string; defaultMsg: string; icon: React.ElementType; color: string }
> = {
  '401': { title: 'Session Expired or Unauthorized', defaultMsg: 'Your GitHub access token has expired or is invalid. Reconnect your account to continue.', icon: Lock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  '403': { title: 'Access Forbidden', defaultMsg: 'You do not have permission to view this GitHub repository or resource.', icon: Lock, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  '404': { title: 'Resource Not Found', defaultMsg: 'The requested GitHub repository or resource could not be found.', icon: FileQuestion, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  '429': { title: 'GitHub Rate Limit Exceeded', defaultMsg: 'GitHub API request limit reached. Requests will automatically resume shortly.', icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  '500': { title: 'Internal Server Error', defaultMsg: 'Something went wrong while processing GitHub data on our backend server.', icon: ServerCrash, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  network: { title: 'Network Disconnected', defaultMsg: 'Unable to reach GitHub servers. Please check your internet connection.', icon: WifiOff, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  offline: { title: 'Working Offline', defaultMsg: 'Displaying cached GitHub intelligence metrics. Connect to sync live updates.', icon: WifiOff, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
}

export const GitHubErrorState: React.FC<GitHubErrorStateProps> = ({
  errorType = 'network',
  message,
  onRetry,
  onReconnect,
  className,
}) => {
  const config = ERROR_CONFIG[errorType] || ERROR_CONFIG.network
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[320px] p-8 text-center rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 space-y-4 font-sans select-none',
        className
      )}
    >
      <div className={cn('p-4 rounded-2xl border', config.color)}>
        <Icon size={36} />
      </div>

      <div className="max-w-md space-y-1">
        <h4 className="text-lg font-bold text-white m-0">{config.title}</h4>
        <p className="text-xs text-slate-400 m-0 leading-relaxed font-sans">
          {message || config.defaultMsg}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
        )}

        {(errorType === '401' || errorType === '403') && onReconnect && (
          <button
            type="button"
            onClick={onReconnect}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <Lock size={14} />
            <span>Reconnect GitHub</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default GitHubErrorState
