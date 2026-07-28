import React from 'react'
import { Activity } from 'lucide-react'
import { SidebarCard } from './SidebarCard'
import type { UsageSummaryData } from './accountOverviewMockData'
import { cn } from '@/lib/utils'

export interface UsageSummaryCardProps {
  usageData: UsageSummaryData
  onViewBilling?: () => void
  className?: string
}

export const UsageSummaryCard: React.FC<UsageSummaryCardProps> = ({
  usageData,
  onViewBilling,
  className,
}) => {
  return (
    <SidebarCard
      title="Usage Summary"
      icon={<Activity className="w-4 h-4 text-cyan-400" />}
      action={
        <span className="text-[11px] text-[var(--muted)] font-sans">
          {usageData.resetDaysText}
        </span>
      }
      footer={
        <a
          href="#billing"
          onClick={(e) => {
            e.preventDefault()
            onViewBilling?.()
          }}
          className="w-full text-center block text-xs font-semibold text-[var(--primary)] hover:underline"
        >
          View Billing & Usage →
        </a>
      }
      className={className}
    >
      <div className="space-y-3 pt-1">
        {usageData.metrics.map((metric) => (
          <div key={metric.id} className="space-y-1 text-left">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--body)] font-medium">{metric.label}</span>
              <span className="text-[var(--muted)] font-mono">
                {metric.used} / {metric.total}{' '}
                <span className="font-bold text-[var(--heading)]">
                  {metric.percentage}%
                </span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', metric.colorClass)}
                style={{ width: `${metric.percentage}%` }}
                role="progressbar"
                aria-valuenow={metric.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={metric.label}
              />
            </div>
          </div>
        ))}
      </div>
    </SidebarCard>
  )
}

export default UsageSummaryCard
