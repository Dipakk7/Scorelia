import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import React from 'react'

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
  emptyMessage?: string
}

export function ActivityCard({
  title,
  description,
  items,
  className,
  emptyMessage = 'No recent activities found.',
}: ActivityCardProps) {
  return (
    <Card className={cn('border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md', className)}>
      <CardHeader className="text-left pb-4">
        <CardTitle className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">{title}</CardTitle>
        {description && <CardDescription className="text-xs text-slate-500 dark:text-slate-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={item.id || idx} className="flex gap-4 items-start text-left group">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-350 shadow-xs group-hover:scale-105 transition-transform">
                    {Icon ? <Icon size={16} /> : <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 font-sans uppercase tracking-wider">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    {item.badgeText && (
                      <div className="pt-1 flex">
                        <Badge variant={item.badgeVariant || 'default'} className="text-[10px] px-1.5 py-0">
                          {item.badgeText}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
