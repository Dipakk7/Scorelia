import React from 'react'
import { Link } from 'react-router-dom'
import { Bot, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbProps {
  className?: string
  currentTabLabel?: string
}

export function Breadcrumb({ className, currentTabLabel = 'Overview' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-slate-400', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li className="flex items-center gap-1.5">
          <Link
            to="/agents"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded px-1 py-0.5"
          >
            <Bot size={14} className="text-purple-400" />
            <span>Agent Console</span>
          </Link>
        </li>
        <li aria-hidden="true" className="text-slate-600 select-none">
          <ChevronRight size={13} />
        </li>
        <li>
          <span
            aria-current="page"
            className="font-semibold text-slate-200 px-1 py-0.5 capitalize"
          >
            {currentTabLabel}
          </span>
        </li>
      </ol>
    </nav>
  )
}

export default Breadcrumb
