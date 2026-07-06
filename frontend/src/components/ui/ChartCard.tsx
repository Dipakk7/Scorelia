import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerActions?: React.ReactNode
}

export function ChartCard({
  title,
  description,
  children,
  className,
  headerActions,
}: ChartCardProps) {
  return (
    <Card className={cn('border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md transition-all hover:shadow-lg', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1 text-left">
          <CardTitle className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </CardDescription>
          )}
        </div>
        {headerActions && <div>{headerActions}</div>}
      </CardHeader>
      <CardContent className="h-72 w-full pb-6">
        {children}
      </CardContent>
    </Card>
  )
}
