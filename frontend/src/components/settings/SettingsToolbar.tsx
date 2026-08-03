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
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>

      {/* Notifications Button */}
      <button
        type="button"
        aria-label="View Notifications"
        className="relative p-2 text-[var(--muted)] hover:text-[var(--heading)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-[var(--radius-md)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
      >
        <Bell className="w-4 h-4" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-[var(--primary)] rounded-full ring-2 ring-[var(--surface)]">
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
          className="h-8 w-8 ring-2 ring-[var(--border)] group-hover:ring-[var(--primary)]/50 transition-all"
        />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[var(--surface)]" />
      </div>
    </div>
  )
}

export default SettingsToolbar
