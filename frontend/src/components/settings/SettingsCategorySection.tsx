import React from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface SettingsCategorySectionProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const SettingsCategorySection: React.FC<SettingsCategorySectionProps> = React.memo(({
  title,
  description,
  icon,
  action,
  footer,
  children,
  className,
}) => {
  return (
    <section
      aria-label={title || 'Settings Section'}
      className="outline-none"
    >
      <Card
        variant="elevated"
        hoverLift
        className={cn(
          'p-5 sm:p-6 rounded-2xl bg-[#121426] border border-white/10 shadow-xl space-y-4 font-sans text-left transition-all duration-200 focus-within:ring-1 focus-within:ring-purple-400/40 w-full',
          className
        )}
      >
        {(title || action || icon) && (
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 sm:pb-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              {icon && (
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate font-sans">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-slate-400 font-medium line-clamp-1 font-sans">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}

        <div className="space-y-4 w-full">{children}</div>

        {footer && (
          <div className="pt-3 border-t border-white/10 text-xs text-slate-400 font-medium">
            {footer}
          </div>
        )}
      </Card>
    </section>
  )
})

SettingsCategorySection.displayName = 'SettingsCategorySection'
export default SettingsCategorySection
