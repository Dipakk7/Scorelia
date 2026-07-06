import { Check, Trash2, Info, CheckCircle2, AlertTriangle, AlertCircle, Scan, MessageSquareCode } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

interface NotificationCardProps {
  notification: NotificationItem
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  className,
}: NotificationCardProps) {
  const { id, title, message, type, is_read, created_at } = notification

  // Resolve Icon based on notification type
  const getIcon = () => {
    switch (type.toUpperCase()) {
      case 'SUCCESS':
        return { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10' }
      case 'WARNING':
        return { icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10 border-amber-500/10' }
      case 'ERROR':
        return { icon: AlertCircle, color: 'text-rose-500 bg-rose-500/10 border-rose-500/10' }
      case 'ATS':
        return { icon: Scan, color: 'text-blue-500 bg-blue-500/10 border-blue-500/10' }
      case 'INTERVIEW':
        return { icon: MessageSquareCode, color: 'text-purple-500 bg-purple-500/10 border-purple-500/10' }
      default:
        return { icon: Info, color: 'text-slate-500 bg-slate-500/10 border-slate-200/50' }
    }
  }

  const { icon: TypeIcon, color: iconStyle } = getIcon()
  const formattedTime = new Date(created_at).toLocaleString()

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border transition-all flex gap-4 text-left relative group',
        is_read
          ? 'border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/10'
          : 'border-brand-500/20 bg-brand-500/5 dark:bg-brand-500/5 shadow-xs font-semibold',
        className
      )}
    >
      {/* Icon */}
      <div className={cn('h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center shadow-xs', iconStyle)}>
        <TypeIcon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1 min-w-0 pr-16">
        <div className="flex items-center gap-2">
          <h4 className={cn('text-sm font-bold font-display leading-tight truncate', is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-950 dark:text-slate-50')}>
            {title}
          </h4>
          {!is_read && (
            <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
          {message}
        </p>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 font-sans block mt-1.5 uppercase tracking-wider">
          {formattedTime}
        </span>
      </div>

      {/* Hover Actions */}
      <div className="absolute right-3 top-3 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!is_read && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(id)}
            className="p-1.5 rounded-lg text-slate-450 hover:text-emerald-600 hover:bg-emerald-500/10 dark:text-slate-550 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 cursor-pointer focus:outline-none transition-colors border border-transparent hover:border-emerald-500/15 shadow-2xs"
            title="Mark as read"
          >
            <Check size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg text-slate-450 hover:text-rose-600 hover:bg-rose-500/10 dark:text-slate-550 dark:hover:text-rose-450 dark:hover:bg-rose-500/10 cursor-pointer focus:outline-none transition-colors border border-transparent hover:border-rose-500/15 shadow-2xs"
            title="Delete notification"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
