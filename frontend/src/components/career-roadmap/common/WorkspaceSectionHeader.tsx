import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface WorkspaceSectionHeaderProps {
  title: string
  subtitle: string
  icon?: LucideIcon
  badgeText?: string
  actionContent?: React.ReactNode
  className?: string
}

export function WorkspaceSectionHeader({
  title,
  subtitle,
  icon: Icon,
  badgeText,
  actionContent,
  className,
}: WorkspaceSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#121426] border border-white/10 shadow-sm transition-all text-left',
        className
      )}
    >
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight m-0">
            {title}
          </h2>
          {badgeText && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase tracking-wider">
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-medium m-0 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {actionContent && (
        <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
          {actionContent}
        </div>
      )}
    </div>
  )
}
export default WorkspaceSectionHeader
