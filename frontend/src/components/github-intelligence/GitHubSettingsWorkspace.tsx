import React, { useState } from 'react'
import { Settings, Shield, RefreshCw, Database, Key, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GitHubSettingsWorkspaceProps {
  isLoading?: boolean
  isConnected?: boolean
  username?: string
  lastSyncedAt?: string
  rateLimit?: {
    limit: number
    remaining: number
    reset_in_seconds: number
  }
  onSync?: () => void
  onReconnect?: () => void
  className?: string
}

export const GitHubSettingsWorkspace: React.FC<GitHubSettingsWorkspaceProps> = ({
  isLoading = false,
  isConnected = true,
  username = 'dipak',
  lastSyncedAt = '2 min ago',
  rateLimit = { limit: 5000, remaining: 4850, reset_in_seconds: 3600 },
  onSync,
  onReconnect,
  className,
}) => {
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState('1h')
  const [cacheDuration, setCacheDuration] = useState('24h')

  if (isLoading) {
    return (
      <div className={cn('p-6 rounded-2xl border border-white/10 bg-[#121426]/70 animate-pulse space-y-6', className)}>
        <div className="h-8 w-48 bg-slate-800 rounded-xl" />
        <div className="h-32 w-full bg-slate-800 rounded-2xl" />
        <div className="h-48 w-full bg-slate-800 rounded-2xl" />
      </div>
    )
  }

  const rateLimitPercentage = Math.round((rateLimit.remaining / rateLimit.limit) * 100)

  return (
    <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 w-full text-left font-sans', className)}>
      {/* 1. Settings Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white m-0">GitHub Intelligence Settings</h3>
            <p className="text-xs text-slate-400 m-0">Manage connection, sync rules, and rate limits</p>
          </div>
        </div>
      </div>

      {/* 2. Connection Status & Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white m-0 flex items-center gap-2">
              <Key size={16} className="text-purple-400" />
              <span>Authentication Status</span>
            </h4>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold font-mono rounded-full border',
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              )}
            >
              {isConnected ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans">GitHub Account</span>
              <span className="font-semibold text-white">@{username}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans">Last Synchronized</span>
              <span className="font-semibold text-white">{lastSyncedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onSync}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/20 transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Trigger Manual Sync</span>
            </button>
            {onReconnect && (
              <button
                type="button"
                onClick={onReconnect}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Reconnect
              </button>
            )}
          </div>
        </div>

        {/* Rate Limit Info */}
        <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-white m-0 flex items-center gap-2">
            <Shield size={16} className="text-sky-400" />
            <span>GitHub API Rate Limit</span>
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-sans">Remaining Requests</span>
              <span className="font-bold text-white">
                {rateLimit.remaining.toLocaleString()} / {rateLimit.limit.toLocaleString()} ({rateLimitPercentage}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700/80">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-sky-400 transition-all duration-500 rounded-full"
                style={{ width: `${rateLimitPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
            <span className="text-xs text-slate-400">Rate Limit Reset Window</span>
            <p className="text-xs font-semibold text-white m-0 font-mono">
              Resets in approx {Math.ceil(rateLimit.reset_in_seconds / 60)} minutes
            </p>
          </div>
        </div>
      </div>

      {/* 3. Sync & Cache Preferences */}
      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-sm space-y-5">
        <h4 className="text-sm font-bold text-white m-0 flex items-center gap-2">
          <Database size={16} className="text-emerald-400" />
          <span>Synchronization Preferences</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-700/80 bg-slate-900/60 space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-white cursor-pointer">
              <span>Auto Background Sync</span>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </label>
            <p className="text-[11px] text-slate-400 m-0">Keep metrics refreshed automatically</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-700/80 bg-slate-900/60 space-y-2">
            <label className="text-xs font-semibold text-white block">Sync Frequency</label>
            <select
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700/80 text-white rounded-lg p-2 focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              <option value="15m">Every 15 minutes</option>
              <option value="1h">Every 1 hour</option>
              <option value="6h">Every 6 hours</option>
              <option value="24h">Daily</option>
            </select>
          </div>

          <div className="p-4 rounded-xl border border-slate-700/80 bg-slate-900/60 space-y-2">
            <label className="text-xs font-semibold text-white block">Cache Retention</label>
            <select
              value={cacheDuration}
              onChange={(e) => setCacheDuration(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700/80 text-white rounded-lg p-2 focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              <option value="12h">12 Hours</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitHubSettingsWorkspace
