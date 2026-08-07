import React from 'react'
import { cn } from '@/lib/utils'

export function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-label="Loading KPI metric..."
      className={cn(
        'p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-3 animate-pulse text-left select-none',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="w-20 h-3 rounded-md bg-[var(--border)]" />
        <div className="w-8 h-8 rounded-xl bg-[var(--border)]" />
      </div>
      <div className="w-28 h-6 rounded-lg bg-[var(--border)]" />
      <div className="w-16 h-3 rounded-md bg-[var(--border)]" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div
      aria-label="Loading table data..."
      className={cn(
        'p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4 animate-pulse text-left select-none',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="w-36 h-4 rounded-md bg-[var(--border)]" />
        <div className="w-48 h-8 rounded-xl bg-[var(--border)]" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-[var(--border)]" />
              <div className="w-40 h-3.5 rounded-md bg-[var(--border)]" />
            </div>
            <div className="w-24 h-3 rounded-md bg-[var(--border)]" />
            <div className="w-16 h-5 rounded-full bg-[var(--border)]" />
            <div className="w-12 h-3 rounded-md bg-[var(--border)]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-label="Loading telemetry chart..."
      className={cn(
        'p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4 animate-pulse text-left select-none',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="w-48 h-4 rounded-md bg-[var(--border)]" />
        <div className="w-16 h-5 rounded-full bg-[var(--border)]" />
      </div>
      <div className="h-56 w-full rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] flex items-end justify-between p-4 gap-3">
        <div className="w-full h-1/3 rounded-t-lg bg-[var(--border)]" />
        <div className="w-full h-2/3 rounded-t-lg bg-[var(--border)]" />
        <div className="w-full h-1/2 rounded-t-lg bg-[var(--border)]" />
        <div className="w-full h-4/5 rounded-t-lg bg-[var(--border)]" />
        <div className="w-full h-3/5 rounded-t-lg bg-[var(--border)]" />
      </div>
    </div>
  )
}

export function ChatThreadSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-label="Loading AI conversation thread..."
      className={cn(
        'p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4 animate-pulse text-left select-none',
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-[var(--border)] pb-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--border)]" />
        <div className="w-32 h-4 rounded-md bg-[var(--border)]" />
      </div>

      <div className="space-y-4 py-2">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-[var(--border)] shrink-0" />
          <div className="w-3/4 p-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] space-y-2">
            <div className="w-full h-3 rounded-md bg-[var(--border)]" />
            <div className="w-5/6 h-3 rounded-md bg-[var(--border)]" />
          </div>
        </div>

        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="w-7 h-7 rounded-xl bg-[var(--border)] shrink-0" />
          <div className="w-2/3 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div className="w-full h-3 rounded-md bg-[var(--border)]" />
            <div className="w-4/5 h-3 rounded-md bg-[var(--border)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default {
  KPICardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  ChatThreadSkeleton
}

