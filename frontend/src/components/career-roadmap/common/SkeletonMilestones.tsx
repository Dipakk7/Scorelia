import React from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function SkeletonMilestones() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl bg-white/10" />
        ))}
      </div>
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm">
        <Skeleton className="h-6 w-48 bg-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl bg-white/10" />
          ))}
        </div>
      </Card>
    </div>
  )
}
export default SkeletonMilestones
