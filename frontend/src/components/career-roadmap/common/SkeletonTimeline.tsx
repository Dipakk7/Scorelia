import React from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function SkeletonTimeline() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48 bg-white/10" />
        <Skeleton className="h-9 w-36 rounded-xl bg-white/10" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40 bg-white/10" />
              <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
            </div>
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-3 w-3/4 bg-white/10" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-10 rounded-xl bg-white/10" />
              <Skeleton className="h-10 rounded-xl bg-white/10" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
export default SkeletonTimeline
