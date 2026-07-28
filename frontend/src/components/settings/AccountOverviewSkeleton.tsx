import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface AccountOverviewSkeletonProps {
  className?: string
}

export const AccountOverviewSkeleton: React.FC<AccountOverviewSkeletonProps> = ({ className }) => {
  return (
    <aside className={cn('space-y-4 text-left font-sans animate-fadeIn select-none', className)}>
      {/* 1. Account Overview Skeleton */}
      <Card className="p-4 space-y-3 border-[var(--border)] bg-[var(--surface-elevated)]">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="h-3 w-32 rounded" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0 flex-1">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full shrink-0" />
        </div>
        <div className="space-y-2 pt-2 border-t border-[var(--border)]/30">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
        <Skeleton className="h-8 w-full rounded-md mt-2" />
      </Card>

      {/* 2. Account Health Skeleton */}
      <Card className="p-4 space-y-3 border-[var(--border)] bg-[var(--surface-elevated)]">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
        <div className="flex items-center gap-3 py-1">
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0 flex-1">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        </div>
        <div className="space-y-2 pt-2 border-t border-[var(--border)]/40">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Usage Summary Skeleton */}
      <Card className="p-4 space-y-3 border-[var(--border)] bg-[var(--surface-elevated)]">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <div className="space-y-3 pt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-full rounded pt-2" />
      </Card>

      {/* 4. Recent Activity Skeleton */}
      <Card className="p-4 space-y-3 border-[var(--border)] bg-[var(--surface-elevated)]">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
        <div className="space-y-3 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="space-y-1 min-w-0 flex-1">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-2.5 w-44 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  )
}

export default AccountOverviewSkeleton
