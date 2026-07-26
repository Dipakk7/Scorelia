import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  className?: string
}

export const SkeletonBox: React.FC<SkeletonLoaderProps> = ({ className }) => (
  <div className={cn('bg-slate-800/60 animate-pulse rounded-xl', className)} />
)

export const ATSHeaderSkeleton: React.FC = () => (
  <div className="space-y-4 mb-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-8 w-64" />
        <SkeletonBox className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex gap-2 self-start">
        <SkeletonBox className="h-9 w-24" />
        <SkeletonBox className="h-9 w-32" />
        <SkeletonBox className="h-9 w-36" />
      </div>
    </div>
    <SkeletonBox className="h-10 w-full sm:w-3/4 rounded-xl" />
  </div>
)

export const ATSHeroSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 space-y-4 mb-6">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-4 flex flex-col items-center p-4">
        <SkeletonBox className="h-40 w-40 rounded-full" />
        <SkeletonBox className="h-4 w-32 mt-4" />
      </div>
      <div className="lg:col-span-8 space-y-3">
        <SkeletonBox className="h-6 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export const ATSMetricsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonBox key={i} className="h-32 w-full" />
    ))}
  </div>
)

export const ATSWorkspaceSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-8 space-y-6">
      <SkeletonBox className="h-48 w-full" />
      <SkeletonBox className="h-56 w-full" />
      <SkeletonBox className="h-48 w-full" />
    </div>
    <div className="lg:col-span-4 space-y-5">
      <SkeletonBox className="h-40 w-full" />
      <SkeletonBox className="h-44 w-full" />
      <SkeletonBox className="h-52 w-full" />
    </div>
  </div>
)
