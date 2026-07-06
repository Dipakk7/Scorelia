import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface SettingsCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingsCard({
  title,
  description,
  children,
  className,
}: SettingsCardProps) {
  return (
    <Card className={cn('border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md overflow-hidden text-left', className)}>
      <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <CardTitle className="text-base font-bold font-display text-slate-900 dark:text-slate-50">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1 leading-normal">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  )
}
