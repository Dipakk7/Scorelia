import React from 'react'
import { ChevronRight } from 'lucide-react'

interface AnalyticsBreadcrumbProps {
  currentTabLabel?: string
  className?: string
}

export function AnalyticsBreadcrumb({
  currentTabLabel = 'Overview',
  className = '',
}: AnalyticsBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-xs font-medium text-slate-400 select-none ${className}`}
    >
      <span className="hover:text-slate-200 transition-colors cursor-pointer">
        Analytics Center
      </span>
      <ChevronRight size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
      <span className="text-slate-100 font-semibold tracking-tight" aria-current="page">
        {currentTabLabel}
      </span>
    </nav>
  )
}

export default AnalyticsBreadcrumb
