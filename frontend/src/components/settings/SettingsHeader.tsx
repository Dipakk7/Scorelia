import React from 'react'
import { SettingsSearch } from './SettingsSearch'
import { SettingsToolbar } from './SettingsToolbar'
import { cn } from '@/lib/utils'

export interface SettingsHeaderProps {
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  avatarUrl?: string
  userName?: string
  notificationCount?: number
  className?: string
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title = 'Settings',
  subtitle = 'Manage your account, preferences, security, and system configuration.',
  searchPlaceholder = 'Search settings...',
  searchValue,
  onSearchChange,
  avatarUrl,
  userName,
  notificationCount = 8,
  className,
}) => {
  return (
    <header className={cn('flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-[var(--border)]/40 pb-5', className)}>
      {/* Title & Subtitle */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--heading)] font-sans">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-sans max-w-xl">
          {subtitle}
        </p>
      </div>

      {/* Header Actions (Search + Toolbar) */}
      <div className="flex items-center gap-3 self-start md:self-center w-full md:w-auto justify-between md:justify-end">
        <SettingsSearch
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
        />
        <SettingsToolbar
          avatarUrl={avatarUrl}
          userName={userName}
          notificationCount={notificationCount}
        />
      </div>
    </header>
  )
}

export default SettingsHeader
