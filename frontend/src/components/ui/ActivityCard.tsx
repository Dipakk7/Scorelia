import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

interface ActivityItem {
  id: string | number
  title: string
  description: string
  timestamp: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  badgeText?: string
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
}

interface ActivityCardProps {
  title: string
  description?: string
  items: ActivityItem[]
  className?: string
}

function formatRelativeTime(dateString: string): string {
  if (dateString === 'Today') return 'Today'
  if (dateString === 'Yesterday') return 'Yesterday'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }
  } catch {
    return dateString
  }
}

export function ActivityCard({
  title,
  description,
  items,
  className,
}: ActivityCardProps) {
  return (
    <Card className={cn('border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md rounded-2xl', className)}>
      <CardHeader className="text-left pb-4">
        <CardTitle className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">{title}</CardTitle>
        {description && <CardDescription className="text-xs text-slate-500 dark:text-slate-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <div className="p-3 bg-slate-50/10 dark:bg-slate-900/5 rounded-2xl border border-slate-200/80 dark:border-slate-800/65 text-slate-400 dark:text-slate-550 mb-3 shadow-xs">
              <CheckCircle2 size={24} className="stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">No activity yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              Your recent system events and analyses will appear here.
            </p>
            <Link to="/resumes" className="mt-4">
              <Button size="sm" variant="outline" className="text-xs hover:border-brand-500/30 hover:bg-brand-500/5">
                Upload Resume
              </Button>
            </Link>
          </div>
        ) : (
          <div className="relative pl-1">
            {/* Timeline Vertical Track */}
            <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-800/60" />

            <div className="space-y-6">
              {items.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={item.id || idx} className="relative flex gap-4 items-start text-left group pl-11">
                    {/* Timeline Node Circle */}
                    <div className="absolute left-0 top-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 shadow-sm group-hover:scale-105 group-hover:border-brand-500/40 group-hover:text-brand-500 transition-all duration-200 ease-in-out z-10">
                      {Icon ? <Icon size={16} className="stroke-[1.5]" /> : <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors truncate">
                          {item.title}
                        </p>
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-550 shrink-0 font-sans uppercase tracking-wider">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      {item.badgeText && (
                        <div className="pt-1 flex">
                          <Badge variant={item.badgeVariant || 'default'} className="text-[9px] px-2 py-0">
                            {item.badgeText}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
