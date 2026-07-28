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
          'p-5 border-[var(--border)] bg-[var(--surface-elevated)] space-y-4 font-sans text-left transition-all duration-[var(--duration-normal)] focus-within:ring-1 focus-within:ring-[var(--primary)]/40',
          className
        )}
      >
        {(title || action || icon) && (
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)]/40 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {icon && (
                <div className="p-1.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-sm font-bold text-[var(--heading)] truncate">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-[var(--muted)] line-clamp-1">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}

        <div className="space-y-4">{children}</div>

        {footer && (
          <div className="pt-3 border-t border-[var(--border)]/40 text-xs text-[var(--muted)]">
            {footer}
          </div>
        )}
      </Card>
    </section>
  )
})

SettingsCategorySection.displayName = 'SettingsCategorySection'
export default SettingsCategorySection
