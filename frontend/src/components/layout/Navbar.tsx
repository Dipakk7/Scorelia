import { Menu, Sun, Moon, Monitor, LogOut, User as UserIcon, Settings, Bell, Trash2, Check, Search, Sparkles, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import api from '@/api/api'
import { useAuth } from '@/providers/AuthProvider'
import { useTheme } from '@/providers/ThemeProvider'
import type { Theme } from '@/providers/ThemeProvider'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyNotificationsState } from '@/components/ui/EmptyState'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from '@/components/ui/Dropdown'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onMenuToggle: () => void
  className?: string
}

export function Navbar({ onMenuToggle, className }: NavbarProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()

  // Query notifications count and list
  const { data: notifData } = useQuery({
    queryKey: ['navbarNotifications'],
    queryFn: async () => {
      const res = await api.get('/notifications?limit=5')
      return res.data
    },
    refetchInterval: 20000, // Refresh notifications every 20 seconds
    enabled: !!user,
  })

  const notifications = notifData?.notifications || []
  const unreadCount = notifData?.unread_count || 0

  // Mark all read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.put('/notifications/mark-all-read')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navbarNotifications'] })
      queryClient.invalidateQueries({ queryKey: ['notificationsList'] })
      toast.success('All notifications marked as read')
    },
  })

  // Mark single read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navbarNotifications'] })
      queryClient.invalidateQueries({ queryKey: ['notificationsList'] })
    },
  })

  // Delete notification mutation
  const deleteNotifMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notifications/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navbarNotifications'] })
      queryClient.invalidateQueries({ queryKey: ['notificationsList'] })
      toast.success('Notification deleted')
    },
  })

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const handleSearchClick = () => {
    // Dispatch Command+K event to open CommandPalette
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  const userDisplayName = user?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <header
      className={cn(
        'h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 transition-colors bg-[#0b0c14]/90 backdrop-blur-md border-b border-white/5',
        className
      )}
    >
      {/* Left side: Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2.5 -ml-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white md:hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Center: Search input area matching V3 reference design */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block" role="search">
        <button
          onClick={handleSearchClick}
          aria-label="Global search (Command K)"
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.99] text-slate-400 hover:text-slate-200 transition-all cursor-pointer group shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
        >
          <div className="flex items-center gap-2.5">
            <Search size={16} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-xs font-medium">Search anything...</span>
          </div>
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white/5 rounded border border-white/10 flex items-center gap-0.5">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Quick Gift/Sparkle Action Pill */}
        <button
          onClick={handleSearchClick}
          className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-purple-400 cursor-pointer focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95"
          title="Quick Commands"
        >
          <Gift size={18} />
        </button>

        {/* Notification Bell Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <button
              className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-100 cursor-pointer focus:outline-none relative transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Notifications center"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-pink-600 text-[9px] font-extrabold text-white flex items-center justify-center border border-[#0b0c14] shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-80 bg-[#121320] border-white/10 text-slate-200" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 select-none">
              <span className="text-[10px] font-extrabold font-mono text-purple-400 uppercase tracking-widest">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-[9px] font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer uppercase tracking-wider bg-transparent border-none p-0"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <EmptyNotificationsState />
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={cn(
                      'p-3.5 flex gap-3 text-left relative group transition-colors hover:bg-white/5',
                      !n.is_read && 'bg-purple-950/20'
                    )}
                  >
                    <div className="flex-1 space-y-1 min-w-0 pr-8">
                      <p className={cn('text-xs tracking-tight truncate', n.is_read ? 'text-slate-400' : 'text-slate-100 font-bold')}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[8px] font-bold text-slate-400 block mt-1.5 uppercase tracking-wider font-mono">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3.5 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {!n.is_read && (
                        <button
                          onClick={() => markReadMutation.mutate(n.id)}
                          className="p-1 rounded bg-[#18192a] text-slate-400 hover:text-emerald-400 hover:bg-white/10 cursor-pointer border border-white/10"
                          title="Mark read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotifMutation.mutate(n.id)}
                        className="p-1 rounded bg-[#18192a] text-slate-400 hover:text-pink-400 hover:bg-white/10 cursor-pointer border border-white/10"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownContent>
        </Dropdown>

        {/* Theme Toggle Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <button
              className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-100 cursor-pointer focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Select theme"
            >
              {theme === 'light' && <Sun size={18} />}
              {theme === 'dark' && <Moon size={18} />}
              {theme === 'system' && <Monitor size={18} />}
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-36 bg-[#121320] border-white/10 text-slate-200" align="end">
            <DropdownLabel className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Appearance</DropdownLabel>
            <DropdownSeparator className="bg-white/10" />
            <DropdownItem
              onClick={() => handleThemeChange('light')}
              className={cn(
                'cursor-pointer rounded-lg m-0.5 flex items-center justify-between text-xs',
                theme === 'light' && 'text-purple-400 font-bold bg-white/5'
              )}
            >
              <div className="flex items-center">
                <Sun size={14} className="mr-2" /> Light
              </div>
              {theme === 'light' && <Check size={14} className="text-purple-400" />}
            </DropdownItem>
            <DropdownItem
              onClick={() => handleThemeChange('dark')}
              className={cn(
                'cursor-pointer rounded-lg m-0.5 flex items-center justify-between text-xs',
                theme === 'dark' && 'text-purple-400 font-bold bg-white/5'
              )}
            >
              <div className="flex items-center">
                <Moon size={14} className="mr-2" /> Dark
              </div>
              {theme === 'dark' && <Check size={14} className="text-purple-400" />}
            </DropdownItem>
            <DropdownItem
              onClick={() => handleThemeChange('system')}
              className={cn(
                'cursor-pointer rounded-lg m-0.5 flex items-center justify-between text-xs',
                theme === 'system' && 'text-purple-400 font-bold bg-white/5'
              )}
            >
              <div className="flex items-center">
                <Monitor size={14} className="mr-2" /> System
              </div>
              {theme === 'system' && <Check size={14} className="text-purple-400" />}
            </DropdownItem>
          </DropdownContent>
        </Dropdown>

        {/* User Account Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/5 cursor-pointer focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95">
              <Avatar
                src={user?.profile_picture}
                fallbackText={userDisplayName}
                className="h-8 w-8 ring-2 ring-purple-500/30"
              />
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-56 bg-[#121320] border-white/10 text-slate-200" align="end">
            <div className="flex flex-col px-3.5 py-2.5 text-left select-none">
              <span className="text-xs font-bold text-slate-100 truncate">
                {userDisplayName}
              </span>
              <span className="text-[11px] text-slate-400 truncate font-mono mt-0.5">
                {user?.email}
              </span>
            </div>
            <DropdownSeparator className="bg-white/10" />
            <DropdownItem asChild className="cursor-pointer rounded-lg m-0.5 text-xs">
              <Link to="/profile" className="flex items-center w-full py-2">
                <UserIcon size={14} className="mr-2.5 text-slate-400" />
                My Profile
              </Link>
            </DropdownItem>
            <DropdownItem asChild className="cursor-pointer rounded-lg m-0.5 text-xs">
              <Link to="/settings" className="flex items-center w-full py-2">
                <Settings size={14} className="mr-2.5 text-slate-400" />
                Account Settings
              </Link>
            </DropdownItem>
            <DropdownSeparator className="bg-white/10" />
            <DropdownItem onClick={logout} className="text-pink-400 hover:bg-pink-500/10 cursor-pointer py-2 font-bold rounded-lg m-0.5 text-xs">
              <LogOut size={14} className="mr-2.5" />
              Sign Out
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  )
}


