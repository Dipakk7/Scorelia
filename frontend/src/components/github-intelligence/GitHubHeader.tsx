import React from 'react'
import { Sparkles, RefreshCw, Download, Clock, Activity, ArrowRight } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { cn } from '@/lib/utils'

export interface GitHubHeaderProps {
  title?: string
  subtitle?: string
  username?: string
  lastSynced?: string
  isConnected?: boolean
  isSyncing?: boolean
  rateLimit?: {
    limit: number
    remaining: number
    reset_in_seconds: number
  }
  currentTabLabel?: string
  onSync?: () => void
  onExportReport?: () => void
  onConnect?: () => void
  className?: string
}

export const GitHubHeader: React.FC<GitHubHeaderProps> = ({
  title = 'GitHub Intelligence',
  subtitle = 'AI-powered repository intelligence, commit velocity, and developer performance analytics.',
  username = 'dipak',
  lastSynced = '2 min ago',
  isConnected = true,
  isSyncing = false,
  rateLimit,
  onSync,
  onExportReport,
  onConnect,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden p-4 sm:p-5 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 transition-all duration-200 text-left font-sans',
        className
      )}
    >
      {/* Ambient Glow Effects matching Scorelia V3 standards */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left: Title, Badges, Subtitle & Metadata Context */}
      <div className="relative z-10 space-y-2 text-left min-w-0 flex-1">
        {/* Title & Status Badge Row */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display m-0 flex items-center gap-2.5 drop-shadow-xs">
            <span>{title}</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Github size={20} className="shrink-0" />
            </div>
          </h1>

          {/* Operational Status Pill */}
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold font-mono">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Disconnected
            </span>
          )}

          {isSyncing && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold font-mono">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Syncing
            </span>
          )}
        </div>

        {/* Subtitle & Connected Account Metadata Pill */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-400 font-medium">
          <p className="m-0 leading-relaxed max-w-2xl">{subtitle}</p>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            {username && (
              <span className="font-semibold text-white bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700/80 inline-flex items-center gap-1.5">
                <Github size={11} className="text-purple-400" />
                @{username}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={12} className="text-slate-500 shrink-0" />
              <span>Synced {lastSynced}</span>
            </span>
            {rateLimit && (
              <span className="hidden md:flex items-center gap-1 text-slate-400">
                <Activity size={12} className="text-slate-500 shrink-0" />
                <span>API: {rateLimit.remaining}/{rateLimit.limit}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Primary Actions Area */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Sync Now / Refresh Button */}
        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          aria-label="Sync GitHub data"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={cn('h-4 w-4 text-purple-400', isSyncing && 'animate-spin')} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
        </button>

        {/* Export / AI Report Button */}
        <button
          type="button"
          onClick={onExportReport}
          aria-label="Export intelligence report"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
        >
          <Download className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Export Report</span>
        </button>

        {/* Primary CTA: Connect / Analyze Repos */}
        <button
          type="button"
          onClick={onConnect || onSync}
          aria-label="Analyze repositories"
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-200 shrink-0" />
          <span>Analyze Repos</span>
          <ArrowRight className="w-4 h-4 ml-0.5 text-white/80 shrink-0" />
        </button>
      </div>
    </div>
  )
}

export default GitHubHeader
