import React from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { Avatar } from '@/components/ui/Avatar'
import { SystemStatusCard } from './SystemStatusCard'
import { NewAgentButton } from './NewAgentButton'

export interface TopActionBarProps {
  className?: string
  onNewAgentClick?: () => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
}

export function TopActionBar({
  className,
  onNewAgentClick,
  onNotificationClick,
  onProfileClick,
}: TopActionBarProps) {
  const { user } = useAuth()
  const displayName = user?.full_name || 'Dipak Khandagale'

  return (
    <div className={cn('flex items-center gap-3 flex-wrap justify-end shrink-0', className)}>
      {/* 1. System Status Card */}
      <SystemStatusCard />

      {/* 2. Primary New Agent Button */}
      <NewAgentButton onClick={onNewAgentClick} />

      {/* 3. Notification Center Button */}
      <button
        onClick={onNotificationClick}
        type="button"
        aria-label="Notifications"
        className="relative p-2 rounded-xl bg-[#111322] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-[#0b0c14]" />
      </button>

      {/* 4. User Profile Avatar */}
      <button
        onClick={onProfileClick}
        type="button"
        aria-label="User Profile"
        className="p-0.5 rounded-full ring-2 ring-purple-500/40 hover:ring-purple-400 transition-all duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
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
