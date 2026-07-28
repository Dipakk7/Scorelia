import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface SettingsCategorySkeletonProps {
  className?: string
}

export const SettingsCategorySkeleton: React.FC<SettingsCategorySkeletonProps> = ({ className }) => {
  return (
    <div className={cn('space-y-6 text-left font-sans animate-fadeIn select-none', className)}>
      {/* Category Header Skeleton */}
      <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]/40">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-3 w-80 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>

      {/* Section Cards Skeleton */}
      <div className="space-y-6">
        <Card className="p-5 space-y-4 border-[var(--border)] bg-[var(--surface-elevated)]">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]/40">
            <Skeleton className="h-6 w-6 rounded-md shrink-0" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </Card>

        <Card className="p-5 space-y-4 border-[var(--border)] bg-[var(--surface-elevated)]">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]/40">
            <Skeleton className="h-6 w-6 rounded-md shrink-0" />
            <Skeleton className="h-4 w-44 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-2.5 w-56 rounded" />
                </div>
                <Skeleton className="h-5 w-9 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SettingsCategorySkeleton
