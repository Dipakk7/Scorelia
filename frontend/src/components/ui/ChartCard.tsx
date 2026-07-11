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
    <Card className={cn('border-[var(--border)]/60 bg-[var(--surface)]/40 backdrop-blur-md transition-all hover:shadow-[var(--shadow-md)] rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-7 pb-5 px-6 md:px-8">
        <div className="space-y-1.5 text-left">
          <CardTitle className="text-lg font-bold font-display text-[var(--heading)]">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs text-[var(--muted)] font-sans leading-relaxed">
              {description}
            </CardDescription>
          )}
        </div>
        {headerActions && <div className="shrink-0">{headerActions}</div>}
      </CardHeader>
      <CardContent className="h-72 w-full px-6 md:px-8 pb-6 pt-0">
        {children}
      </CardContent>
    </Card>
  )
}
