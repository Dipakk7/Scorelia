import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface SystemPreferencesSkeletonProps {
  className?: string
}

export const SystemPreferencesSkeleton: React.FC<SystemPreferencesSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('space-y-8 text-left font-sans animate-fadeIn select-none', className)}>
      {/* 3 Category Cards Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-1 border-b border-[var(--border)]/30">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
          <Skeleton className="h-4 w-36 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-4 border-[var(--border)] bg-[var(--surface-elevated)]">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]/40">
                <Skeleton className="h-6 w-6 rounded-md shrink-0" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center py-1">
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <Skeleton className="h-3.5 w-28 rounded" />
                      <Skeleton className="h-2.5 w-40 rounded" />
                    </div>
                    <Skeleton className="h-5 w-9 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-6 w-full rounded pt-2" />
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Settings Panel Skeleton */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3 w-64 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4 flex flex-col items-center space-y-3 border-[var(--border)] bg-[var(--surface-elevated)]">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-8 w-full rounded-md mt-2" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemPreferencesSkeleton
