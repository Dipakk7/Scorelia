import React from 'react'
import { cn } from '@/lib/utils'
import { SystemStatusCard } from './SystemStatusCard'
import { NewAgentButton } from './NewAgentButton'

export interface TopActionBarProps {
  className?: string
  onNewAgentClick?: () => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
}

export function TopActionBar({
  className,
  onNewAgentClick,
}: TopActionBarProps) {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap justify-end shrink-0', className)}>
      {/* 1. System Status Card */}
      <SystemStatusCard />

      {/* 2. Primary New Agent Button */}
      <NewAgentButton onClick={onNewAgentClick} />
    </div>
  )
}

export default TopActionBar
