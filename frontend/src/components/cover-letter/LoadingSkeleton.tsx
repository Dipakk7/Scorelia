import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div aria-label="Loading Cover Letter Workspace" className="space-y-6 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-[var(--surface-hover)] rounded-md" />
            <div className="h-8 w-64 bg-[var(--surface-hover)] rounded-lg" />
            <div className="h-4 w-80 bg-[var(--surface-hover)] rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-[var(--surface-hover)] rounded-xl" />
            <div className="h-9 w-36 bg-[var(--surface-hover)] rounded-xl" />
          </div>
        </div>

        {/* Steps Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[var(--border)]">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="h-10 bg-[var(--surface-hover)] rounded-xl" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (70%) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="h-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="h-6 w-48 bg-[var(--surface-hover)] rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-[var(--surface-hover)] rounded-xl" />
              <div className="h-10 bg-[var(--surface-hover)] rounded-xl" />
            </div>
            <div className="h-20 bg-[var(--surface-hover)] rounded-xl" />
          </div>

          <div className="h-96 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-6 w-40 bg-[var(--surface-hover)] rounded-md" />
              <div className="h-6 w-32 bg-[var(--surface-hover)] rounded-md" />
            </div>
            <div className="h-10 bg-[var(--surface-hover)] rounded-xl" />
            <div className="h-56 bg-[var(--surface-hover)] rounded-xl" />
          </div>
        </div>

        {/* Right Sidebar (30%) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-72 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="h-6 w-36 bg-[var(--surface-hover)] rounded-md" />
            <div className="h-32 w-32 mx-auto rounded-full bg-[var(--surface-hover)]" />
            <div className="h-4 w-full bg-[var(--surface-hover)] rounded-md" />
          </div>

          <div className="h-48 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <div className="h-6 w-32 bg-[var(--surface-hover)] rounded-md" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-6 w-20 bg-[var(--surface-hover)] rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton
