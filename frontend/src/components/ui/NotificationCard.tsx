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
        return { icon: CheckCircle2, color: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/15' }
      case 'WARNING':
        return { icon: AlertTriangle, color: 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/15' }
      case 'ERROR':
        return { icon: AlertCircle, color: 'text-[var(--danger)] bg-[var(--danger)]/10 border-[var(--danger)]/15' }
      case 'ATS':
        return { icon: Scan, color: 'text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/15' }
      case 'INTERVIEW':
        return { icon: MessageSquareCode, color: 'text-[var(--analytics)] bg-[var(--analytics)]/10 border-[var(--analytics)]/15' }
      default:
        return { icon: Info, color: 'text-[var(--muted)] bg-[var(--muted)]/10 border-[var(--border)]' }
    }
  }

  const { icon: TypeIcon, color: iconStyle } = getIcon()
  const formattedTime = new Date(created_at).toLocaleString()

  return (
    <div
      className={cn(
        'p-4 rounded-[var(--radius-card)] border transition-all flex gap-4 text-left relative group',
        is_read
          ? 'border-[var(--border)] bg-[var(--surface)]/40'
          : 'border-[var(--primary)]/20 bg-[var(--primary)]/5 shadow-[var(--shadow-sm)] font-semibold',
        className
      )}
    >
      {/* Icon */}
      <div className={cn('h-10 w-10 shrink-0 rounded-[var(--radius-md)] border flex items-center justify-center shadow-[var(--shadow-sm)]', iconStyle)}>
        <TypeIcon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1 min-w-0 pr-16">
        <div className="flex items-center gap-2">
          <h4 className={cn('text-sm font-bold font-display leading-tight truncate', is_read ? 'text-[var(--muted)]' : 'text-[var(--heading)]')}>
            {title}
          </h4>
          {!is_read && (
            <span className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
          )}
        </div>
        <p className="text-xs text-[var(--body)] font-sans leading-relaxed">
          {message}
        </p>
        <span className="text-[10px] font-medium text-[var(--muted)] font-sans block mt-1.5 uppercase tracking-wider">
          {formattedTime}
        </span>
      </div>

      {/* Hover Actions */}
      <div className="absolute right-3 top-3 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!is_read && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(id)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--success)] hover:bg-[var(--success)]/10 cursor-pointer focus:outline-none transition-colors border border-transparent hover:border-[var(--success)]/15 shadow-[var(--shadow-sm)]"
            title="Mark as read"
          >
            <Check size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 cursor-pointer focus:outline-none transition-colors border border-transparent hover:border-[var(--danger)]/15 shadow-[var(--shadow-sm)]"
            title="Delete notification"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
