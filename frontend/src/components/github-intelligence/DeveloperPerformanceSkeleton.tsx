import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const DeveloperPerformanceSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full text-left font-sans">
      {/* Row 1 Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Row 2 Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="lg:col-span-6">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>

      {/* Row 3 Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="lg:col-span-6">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
