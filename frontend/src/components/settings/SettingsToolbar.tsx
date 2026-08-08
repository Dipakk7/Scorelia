import React from 'react'
import { Bell } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export interface SettingsToolbarProps {
  className?: string
  avatarUrl?: string
  userName?: string
  notificationCount?: number
}

export const SettingsToolbar: React.FC<SettingsToolbarProps> = ({
  className,
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  userName = 'Dipak Khandagale',
  notificationCount = 8,
}) => {
  return (
    <div className={cn('flex items-center gap-2.5 sm:gap-3 shrink-0', className)}>
      {/* Notifications Button */}
      <button
        type="button"
        aria-label="View Notifications"
        className="relative h-10 w-10 flex items-center justify-center text-slate-300 hover:text-white bg-[#0d0f1e]/80 hover:bg-purple-950/40 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer shadow-sm"
      >
        <Bell className="w-4 h-4 text-purple-300" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full ring-2 ring-[#111324] shadow-sm">
            {notificationCount}
          </span>
        )}
      </button>

      {/* User Profile Avatar */}
      <div className="relative group cursor-pointer">
        <Avatar
          src={avatarUrl}
          alt={userName}
          fallbackText="DK"
          className="h-10 w-10 ring-2 ring-white/15 group-hover:ring-purple-400/60 transition-all rounded-xl shadow-sm"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#111324]" />
      </div>
    </div>
  )
}

export default SettingsToolbar

