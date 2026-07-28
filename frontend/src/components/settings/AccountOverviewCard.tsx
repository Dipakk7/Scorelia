import React from 'react'
import { User, ShieldCheck, ArrowRight } from 'lucide-react'
import { SidebarCard } from './SidebarCard'
import { SidebarStatRow } from './SidebarStatRow'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { AccountUserProfile } from './accountOverviewMockData'
import { cn } from '@/lib/utils'

export interface AccountOverviewCardProps {
  userProfile: AccountUserProfile
  onViewProfile?: () => void
  className?: string
}

export const AccountOverviewCard: React.FC<AccountOverviewCardProps> = ({
  userProfile,
  onViewProfile,
  className,
}) => {
  return (
    <SidebarCard
      title="Account Overview"
      subtitle={userProfile.memberSince}
      icon={<User className="w-4 h-4 text-indigo-400" />}
      action={
        <Badge variant="info" className="text-[10px] bg-indigo-500/15 text-indigo-400 border-indigo-500/30">
          {userProfile.plan}
        </Badge>
      }
      footer={
        <Button
          variant="secondary"
          size="sm"
          onClick={onViewProfile}
          type="button"
          className="w-full text-xs h-7.5 justify-center gap-1 font-medium border-[var(--border)]/60"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3" />
        </Button>
      }
      className={className}
    >
      {/* User Header Info */}
      <div className="flex items-center gap-3 py-1">
        <Avatar
          src={userProfile.avatarUrl}
          alt={userProfile.name}
          fallbackText="DK"
          className="h-11 w-11 ring-2 ring-indigo-500/30 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-[var(--heading)] truncate">
              {userProfile.name}
            </h4>
          </div>
          <p className="text-[11px] text-[var(--muted)] truncate">
            {userProfile.email}
          </p>
        </div>
        {userProfile.isVerified && (
          <Badge variant="success" className="text-[10px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shrink-0">
            Verified
          </Badge>
        )}
      </div>

      {/* Quick Details Stat Rows */}
      <div className="space-y-0.5 pt-1 border-t border-[var(--border)]/30">
        <SidebarStatRow
          icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
          label="Account ID"
          value={userProfile.accountId}
        />
        <SidebarStatRow
          label="Profile Completion"
          value={`${userProfile.profileCompletion}%`}
          badge="Complete"
          badgeVariant="success"
        />
      </div>
    </SidebarCard>
  )
}

export default AccountOverviewCard
