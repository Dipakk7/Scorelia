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
    <Card className={cn('border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/30 transition-all duration-300 overflow-hidden text-left font-sans text-xs flex flex-col', className)}>
      <CardHeader className="pb-4 border-b border-[var(--border)] text-left select-none">
        <CardTitle className="text-xs font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-[9px] text-[var(--muted)] font-sans block mt-1.5 leading-none">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-6 text-left">
        {children}
      </CardContent>
    </Card>
  )
}
export default SettingsCard
