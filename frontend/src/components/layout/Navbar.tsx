import { Menu, Sun, Moon, Monitor, LogOut, User as UserIcon, Settings, Bell, Trash2, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import api from '@/api/api'
import { useAuth } from '@/providers/AuthProvider'
import { useTheme } from '@/providers/ThemeProvider'
import type { Theme } from '@/providers/ThemeProvider'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
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

  const userDisplayName = user?.full_name || user?.email.split('@')[0] || 'User'

  return (
    <header
      className={cn(
        'h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 transition-colors glass-navbar',
        className
      )}
    >
      {/* Left side: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 md:hidden cursor-pointer focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-2">
        {/* Notification Bell Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <button
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer focus:outline-none relative"
              aria-label="Notifications center"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-[10px] font-extrabold text-white flex items-center justify-center border border-white dark:border-slate-900 shadow-sm animate-pulse font-sans">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-80" align="end">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-105 dark:border-slate-800">
              <span className="text-xs font-bold font-display text-slate-850 dark:text-slate-50 uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-[10px] font-bold text-brand-600 hover:underline dark:text-brand-400 cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {notifications.length === 0 ? (
                <EmptyNotificationsState />
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={cn(
                      'p-3 flex gap-3 text-left relative group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/20',
                      !n.is_read && 'bg-brand-500/5 dark:bg-brand-500/5'
                    )}
                  >
                    <div className="flex-1 space-y-0.5 min-w-0 pr-8">
                      <p className={cn('text-xs font-semibold truncate', n.is_read ? 'text-slate-700 dark:text-slate-350' : 'text-slate-950 dark:text-slate-100')}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-450 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 block mt-1 uppercase tracking-wider font-sans">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="absolute right-2 top-2 flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {!n.is_read && (
                        <button
                          onClick={() => markReadMutation.mutate(n.id)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                          title="Mark read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotifMutation.mutate(n.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
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
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
              aria-label="Select theme"
            >
              {theme === 'light' && <Sun size={18} />}
              {theme === 'dark' && <Moon size={18} />}
              {theme === 'system' && <Monitor size={18} />}
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-36">
            <DropdownLabel>Appearance</DropdownLabel>
            <DropdownSeparator />
            <DropdownItem onClick={() => handleThemeChange('light')} className={cn(theme === 'light' && 'text-brand-600 dark:text-brand-400')}>
              <Sun size={14} className="mr-2" /> Light
            </DropdownItem>
            <DropdownItem onClick={() => handleThemeChange('dark')} className={cn(theme === 'dark' && 'text-brand-600 dark:text-brand-400')}>
              <Moon size={14} className="mr-2" /> Dark
            </DropdownItem>
            <DropdownItem onClick={() => handleThemeChange('system')} className={cn(theme === 'system' && 'text-brand-600 dark:text-brand-400')}>
              <Monitor size={14} className="mr-2" /> System
            </DropdownItem>
          </DropdownContent>
        </Dropdown>

        {/* User Account Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer focus:outline-none">
              <Avatar
                src={user?.profile_picture}
                fallbackText={userDisplayName}
                className="h-8 w-8"
              />
            </button>
          </DropdownTrigger>
          <DropdownContent className="w-56" align="end">
            <div className="flex flex-col px-3 py-2 text-left">
              <span className="text-sm font-semibold font-display text-slate-800 dark:text-slate-100 truncate">
                {userDisplayName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </span>
            </div>
            <DropdownSeparator />
            <DropdownItem asChild className="cursor-pointer">
              <Link to="/profile" className="flex items-center w-full">
                <UserIcon size={14} className="mr-2.5 text-slate-500" />
                My Profile
              </Link>
            </DropdownItem>
            <DropdownItem asChild className="cursor-pointer">
              <Link to="/settings" className="flex items-center w-full">
                <Settings size={14} className="mr-2.5 text-slate-500" />
                Account Settings
              </Link>
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem onClick={logout} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer">
              <LogOut size={14} className="mr-2.5" />
              Sign Out
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  )
}

