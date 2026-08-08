import React from 'react'
import { Sparkles, Sliders } from 'lucide-react'
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
    <header className={cn('relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] border border-white/10 shadow-2xl shadow-purple-950/20 backdrop-blur-md transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 text-left w-full max-w-full', className)}>
      {/* Background Ambient Glow Accents matching V3 Hero Dashboards */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Left: Title & Subtitle */}
      <div className="relative z-10 space-y-1.5 text-left">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs flex items-center gap-2 font-sans">
            <Sliders className="w-6 h-6 text-purple-400 shrink-0" />
            {title}
            <Sparkles className="w-5 h-5 text-purple-400/80 shrink-0 fill-purple-400/20" />
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl font-sans leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Hero Right: Search Input & Controls Toolbar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start lg:self-center w-full lg:w-auto justify-between lg:justify-end shrink-0">
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

