import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const RepositorySkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full text-left font-sans">
      {/* Statistics Panel Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 h-20 flex flex-col justify-between">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-6 w-12 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Toolbar & Search Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70">
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-8 w-40 rounded-lg" />
      </div>
    </div>
  )
}
