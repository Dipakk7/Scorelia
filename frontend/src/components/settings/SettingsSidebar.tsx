import React from 'react'
import { AccountOverviewCard } from './AccountOverviewCard'
import { AccountHealthCard } from './AccountHealthCard'
import { UsageSummaryCard } from './UsageSummaryCard'
import { RecentActivityCard } from './RecentActivityCard'
import { accountOverviewMockData } from './accountOverviewMockData'
import { cn } from '@/lib/utils'

export interface SettingsSidebarProps {
  onViewProfile?: () => void
  onViewHealthDetails?: () => void
  onViewBilling?: () => void
  onViewAllActivity?: () => void
  className?: string
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  onViewProfile,
  onViewHealthDetails,
  onViewBilling,
  onViewAllActivity,
  className,
}) => {
  return (
    <aside className={cn('space-y-4 text-left font-sans', className)}>
      {/* 1. Account Overview Card */}
      <AccountOverviewCard
        userProfile={accountOverviewMockData.userProfile}
        onViewProfile={onViewProfile}
      />

      {/* 2. Account Health Card */}
      <AccountHealthCard
        healthData={accountOverviewMockData.health}
        onViewDetails={onViewHealthDetails}
      />

      {/* 3. Usage Summary Card */}
      <UsageSummaryCard
        usageData={accountOverviewMockData.usage}
        onViewBilling={onViewBilling}
      />

      {/* 4. Recent Activity Card */}
      <RecentActivityCard
        activities={accountOverviewMockData.activities}
        onViewAll={onViewAllActivity}
      />
    </aside>
  )
}

export default SettingsSidebar
