import React from 'react'
import { Plus, Bell, Sun, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { Avatar } from '@/components/ui/Avatar'

export interface TopActionBarProps {
  className?: string
  onNewAgentClick?: () => void
  onNotificationClick?: () => void
  onThemeToggleClick?: () => void
  onProfileClick?: () => void
}

export function TopActionBar({
  className,
  onNewAgentClick,
  onNotificationClick,
  onThemeToggleClick,
  onProfileClick,
}: TopActionBarProps) {
  const { user } = useAuth()
  const displayName = user?.full_name || 'Dipak Khandagale'

  return (
    <div className={cn('flex items-center gap-3 flex-wrap justify-end', className)}>
      {/* 1. System Status Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111322] border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-medium text-slate-200">All Systems Operational</span>
      </div>

      {/* 2. New Agent Button */}
      <button
        onClick={onNewAgentClick}
        type="button"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-900/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Plus size={15} className="stroke-[2.5]" />
        <span>New Agent</span>
      </button>

      {/* 3. Notification Button */}
      <button
        onClick={onNotificationClick}
        type="button"
        aria-label="Notifications"
        className="relative p-2 rounded-xl bg-[#111322] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-[#0b0c14]" />
      </button>

      {/* 4. Theme Toggle Button */}
      <button
        onClick={onThemeToggleClick}
        type="button"
        aria-label="Toggle theme"
        className="p-2 rounded-xl bg-[#111322] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Sun size={16} />
      </button>

      {/* 5. Profile Menu */}
      <button
        onClick={onProfileClick}
        type="button"
        aria-label="User Profile"
        className="p-0.5 rounded-full ring-2 ring-purple-500/40 hover:ring-purple-400 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Avatar
          src={user?.profile_picture}
          fallbackText={displayName}
          className="h-8 w-8 rounded-full text-xs font-bold bg-purple-900 text-purple-200"
        />
      </button>
    </div>
  )
}

export default TopActionBar
