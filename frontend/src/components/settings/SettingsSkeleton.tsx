import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface SettingsSkeletonProps {
  className?: string
}

export const SettingsSkeleton: React.FC<SettingsSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('space-y-6 text-left font-sans animate-fadeIn select-none', className)}>
      {/* 1. Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-[var(--border)]/40 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40 rounded-md" />
          <Skeleton className="h-4 w-72 md:w-96 rounded" />
        </div>
        <div className="flex items-center gap-3 self-start md:self-center">
          <Skeleton className="h-9 w-48 sm:w-64 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. Tabs Skeleton */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md shrink-0" />
        ))}
      </div>

      {/* 3. Main Two-Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Workspace Skeleton (Col 8/9) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          {/* General Preferences Skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-1">
              <div className="space-y-1">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-3 w-64 rounded" />
              </div>
              <Skeleton className="h-8 w-32 rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-3 w-36 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full rounded" />
                </Card>
              ))}
            </div>
          </div>

          {/* System Preferences Skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-1">
              <div className="space-y-1">
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>
              <Skeleton className="h-4 w-36 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-4">
                  <div className="flex items-center gap-2 pb-2">
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex justify-between items-center">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-5 w-9 rounded-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-6 w-full rounded pt-2" />
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Settings Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-36 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4 flex flex-col items-center space-y-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton (Col 4/3) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1 min-w-0 flex-1">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-full shrink-0" />
              <div className="space-y-1 min-w-0 flex-1">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="space-y-3 pt-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Bottom Status Bar Skeleton */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </Card>
    </div>
  )
}

export default SettingsSkeleton
