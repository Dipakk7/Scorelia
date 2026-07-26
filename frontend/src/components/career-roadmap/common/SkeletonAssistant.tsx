import React from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function SkeletonAssistant() {
  return (
    <Card className="p-5 bg-[#121320] border border-white/10 rounded-2xl space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-36 bg-white/10" />
        <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-16 w-3/4 rounded-xl bg-white/10" />
        <Skeleton className="h-12 w-2/3 ml-auto rounded-xl bg-white/10" />
        <Skeleton className="h-20 w-4/5 rounded-xl bg-white/10" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
    </Card>
  )
}
export default SkeletonAssistant
