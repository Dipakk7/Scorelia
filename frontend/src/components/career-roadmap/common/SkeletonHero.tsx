import React from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function SkeletonHero() {
  return (
    <Card className="p-5 sm:p-6 bg-[#121426] border border-white/10 rounded-2xl space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-8 w-64 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-xl bg-white/10" />
          <Skeleton className="h-9 w-28 rounded-xl bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl bg-white/10" />
        ))}
      </div>
    </Card>
  )
}
export default SkeletonHero
