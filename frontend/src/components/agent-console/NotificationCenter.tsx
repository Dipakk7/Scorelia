import React, { useState, useMemo, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import {
  mockNotificationsList,
  type NotificationItem,
} from '@/data/insightsSystemHealthMockData'
import { Bell, Check, Trash2, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const { notifications: queryNotifications, markAsRead, dismissNotification } = useNotifications()
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotificationsList)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    if (queryNotifications && queryNotifications.length > 0) {
      setNotifications(queryNotifications)
    }
  }, [queryNotifications])

  const handleToggleRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    )
    await markAsRead(id)
  }

  const handleDismiss = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await dismissNotification(id)
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const filteredNotifications = useMemo(() => {
    if (categoryFilter === 'all') return notifications
    return notifications.filter((n) => n.category === categoryFilter)
  }, [notifications, categoryFilter])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className={cn('space-y-4 text-left', className)}>
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-purple-400" />
          <span className="font-bold text-white">Notification Feed</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-extrabold text-[10px]">
              {unreadCount} Unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
            <Filter size={12} className="text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111322]">All Types</option>
              <option value="agent" className="bg-[#111322]">Agent</option>
              <option value="automation" className="bg-[#111322]">Automation</option>
              <option value="knowledge" className="bg-[#111322]">Knowledge</option>
              <option value="system" className="bg-[#111322]">System</option>
              <option value="security" className="bg-[#111322]">Security</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold transition-all cursor-pointer"
          >
            <Check size={12} />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {(filteredNotifications || []).map((n) => (
          <div
            key={n.id}
            className={cn(
              'p-4 rounded-xl border transition-all flex items-start justify-between gap-3 shadow-md',
              n.isRead
                ? 'bg-[#0b0c14] border-white/5 opacity-70'
                : 'bg-[#111322] border-purple-500/30 hover:border-purple-500/50'
            )}
          >
            <div className="space-y-1 text-xs min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight">{n.title}</span>
                {!n.isRead && (
                  <span className="h-2 w-2 rounded-full bg-purple-400 shrink-0" />
                )}
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">{n.description}</p>
              <span className="text-[10px] font-mono text-slate-500 block pt-1">{n.timestamp}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleRead(n.id)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={n.isRead ? 'Mark Unread' : 'Mark Read'}
              >
                <Check size={14} className={n.isRead ? 'text-emerald-400' : 'text-slate-400'} />
              </button>
              <button
                type="button"
                onClick={() => handleDismiss(n.id)}
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationCenter
