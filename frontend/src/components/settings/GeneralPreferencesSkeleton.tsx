import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface GeneralPreferencesSkeletonProps {
  className?: string
}

export const GeneralPreferencesSkeleton: React.FC<GeneralPreferencesSkeletonProps> = ({ className }) => {
  return (
    <section className={cn('space-y-4 text-left font-sans animate-fadeIn select-none', className)}>
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[var(--border)]/30">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-3 w-64 md:w-80 rounded" />
        </div>
        <Skeleton className="h-8 w-36 rounded-md self-start sm:self-auto" />
      </div>

      {/* 6 Preference Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-3 border-[var(--border)] bg-[var(--surface-elevated)]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-1.5 min-w-0 flex-1">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
            </div>
            <Skeleton className="h-9 w-full rounded-[var(--radius-input)]" />
          </Card>
        ))}
      </div>
    </section>
  )
}

export default GeneralPreferencesSkeleton
