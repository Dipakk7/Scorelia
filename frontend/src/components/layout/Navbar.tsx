import { useState } from 'react'
import { Menu, Sun, Moon, Monitor, LogOut, User as UserIcon, Settings, Bell, Trash2, Check, Search, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  // Controlled states for dropdown popovers to guarantee click responsiveness
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)

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
    setIsThemeOpen(false)
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
        'h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 transition-colors duration-200 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)] text-[var(--body)]',
        className
      )}
    >
      {/* Left side: Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2.5 -ml-2 rounded-xl text-[var(--body)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)] md:hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Center: Search input area matching V3 reference design */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block" role="search">
        <button
          type="button"
          onClick={handleSearchClick}
          aria-label="Global search (Command K)"
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 active:scale-[0.99] text-[var(--body)] hover:text-[var(--heading)] transition-all cursor-pointer group shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
        >
          <div className="flex items-center gap-2.5">
            <Search size={16} className="text-[var(--muted-color)] group-hover:text-purple-500 transition-colors" />
            <span className="text-xs font-medium text-[var(--body)]">Search anything...</span>
          </div>
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--muted-color)] bg-[var(--surface)] rounded border border-[var(--border)] flex items-center gap-0.5">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Quick Gift/Sparkle Action Pill */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="p-2 rounded-xl text-[var(--body)] hover:bg-[var(--surface-hover)] hover:text-purple-400 cursor-pointer focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95"
          title="Quick Commands"
        >
          <Gift size={18} />
        </button>

        {/* Notification Bell Dropdown */}
        <Dropdown open={isNotifOpen} onOpenChange={setIsNotifOpen}>
          <DropdownTrigger asChild>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="p-2 rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)] cursor-pointer focus:outline-none relative transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Notifications center"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-pink-600 text-[9px] font-extrabold text-white flex items-center justify-center border border-[var(--surface)] shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-80 bg-[var(--surface)] border-[var(--border)] text-[var(--body)] z-50 shadow-2xl" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] select-none">
              <span className="text-[10px] font-extrabold font-mono text-purple-400 uppercase tracking-widest">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-[9px] font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer uppercase tracking-wider bg-transparent border-none p-0"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
              {notifications.length === 0 ? (
                <EmptyNotificationsState />
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={cn(
                      'p-3.5 flex gap-3 text-left relative group transition-colors hover:bg-[var(--surface-hover)]',
                      !n.is_read && 'bg-purple-500/10'
                    )}
                  >
                    <div className="flex-1 space-y-1 min-w-0 pr-8">
                      <p className={cn('text-xs tracking-tight truncate', n.is_read ? 'text-[var(--muted)]' : 'text-[var(--heading)] font-bold')}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-[var(--muted)] font-sans line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[8px] font-bold text-[var(--muted)] block mt-1.5 uppercase tracking-wider font-mono">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3.5 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {!n.is_read && (
                        <button
                          type="button"
                          onClick={() => markReadMutation.mutate(n.id)}
                          className="p-1 rounded bg-[var(--surface-hover)] text-[var(--muted)] hover:text-emerald-400 cursor-pointer border border-[var(--border)]"
                          title="Mark read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteNotifMutation.mutate(n.id)}
                        className="p-1 rounded bg-[var(--surface-hover)] text-[var(--muted)] hover:text-pink-400 cursor-pointer border border-[var(--border)]"
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
        <Dropdown open={isThemeOpen} onOpenChange={setIsThemeOpen}>
          <DropdownTrigger asChild>
            <button
              type="button"
              onClick={() => setIsThemeOpen((prev) => !prev)}
              className="p-2 rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)] cursor-pointer focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Select theme"
            >
              {theme === 'light' && <Sun size={18} className="text-amber-500" />}
              {theme === 'dark' && <Moon size={18} className="text-purple-400" />}
              {theme === 'system' && <Monitor size={18} className="text-[var(--heading)]" />}
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-36 bg-[var(--surface)] border-[var(--border)] text-[var(--body)] z-50 shadow-2xl" align="end">
            <DropdownLabel className="text-[10px] uppercase font-extrabold tracking-widest text-[var(--muted)]">Appearance</DropdownLabel>
            <DropdownSeparator className="bg-[var(--border)]" />
            <DropdownItem
              onClick={() => handleThemeChange('light')}
              className={cn(
                'cursor-pointer rounded-lg m-0.5 flex items-center justify-between text-xs transition-colors',
                theme === 'light' ? 'text-purple-500 font-bold bg-[var(--surface-hover)]' : 'hover:bg-[var(--surface-hover)]'
              )}
            >
              <div className="flex items-center">
                <Sun size={14} className="mr-2 text-amber-500" /> Light
              </div>
              {theme === 'light' && <Check size={14} className="text-purple-500" />}
            </DropdownItem>
            <DropdownItem
              onClick={() => handleThemeChange('dark')}
              className={cn(
                'cursor-pointer rounded-lg m-0.5 flex items-center justify-between text-xs transition-colors',
                theme === 'dark' ? 'text-purple-400 font-bold bg-[var(--surface-hover)]' : 'hover:bg-[var(--surface-hover)]'
              )}
            >
              <div className="flex items-center">
                <Moon size={14} className="mr-2 text-purple-400" /> Dark
              </div>
              {theme === 'dark' && <Check size={14} className="text-purple-400" />}
            </DropdownItem>
            <DropdownItem
              onClick={() => handleThemeChange('system')}
              className={cn(
                'cursor-pointer rounded-lg m-0.5 flex items-center justify-between text-xs transition-colors',
                theme === 'system' ? 'text-purple-400 font-bold bg-[var(--surface-hover)]' : 'hover:bg-[var(--surface-hover)]'
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
        <Dropdown open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DropdownTrigger asChild>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[var(--surface-hover)] cursor-pointer focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="User account profile menu"
            >
              <Avatar
                src={user?.profile_picture}
                fallbackText={userDisplayName}
                className="h-8 w-8 ring-2 ring-purple-500/30 pointer-events-none"
              />
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-56 bg-[var(--surface)] border-[var(--border)] text-[var(--body)] z-50 shadow-2xl" align="end">
            <div className="flex flex-col px-3.5 py-2.5 text-left select-none">
              <span className="text-xs font-bold text-[var(--heading)] truncate">
                {userDisplayName}
              </span>
              <span className="text-[11px] text-[var(--muted)] truncate font-mono mt-0.5">
                {user?.email}
              </span>
            </div>
            <DropdownSeparator className="bg-[var(--border)]" />
            <DropdownItem
              onSelect={() => {
                setIsProfileOpen(false)
                navigate('/profile')
              }}
              className="cursor-pointer rounded-lg m-0.5 text-xs flex items-center py-2 text-[var(--body)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)]"
            >
              <UserIcon size={14} className="mr-2.5 text-[var(--muted)]" />
              <span>My Profile</span>
            </DropdownItem>
            <DropdownItem
              onSelect={() => {
                setIsProfileOpen(false)
                navigate('/settings')
              }}
              className="cursor-pointer rounded-lg m-0.5 text-xs flex items-center py-2 text-[var(--body)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)]"
            >
              <Settings size={14} className="mr-2.5 text-[var(--muted)]" />
              <span>Account Settings</span>
            </DropdownItem>
            <DropdownSeparator className="bg-[var(--border)]" />
            <DropdownItem
              onSelect={() => {
                setIsProfileOpen(false)
                logout()
              }}
              className="text-pink-500 hover:bg-pink-500/10 cursor-pointer py-2 font-bold rounded-lg m-0.5 text-xs flex items-center"
            >
              <LogOut size={14} className="mr-2.5" />
              <span>Sign Out</span>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  )
}

export default Navbar
