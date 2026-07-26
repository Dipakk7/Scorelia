import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbProps {
  className?: string
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs font-medium text-slate-400', className)}>
      <ol className="flex items-center gap-2 m-0 p-0 list-none">
        <li className="flex items-center">
          <Link
            to="/rag-workspace"
            className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded px-1 -mx-1 text-slate-300"
          >
            RAG Workspace
          </Link>
        </li>
        <li className="flex items-center gap-2" aria-hidden="true">
          <ChevronRight size={13} className="text-slate-500 shrink-0" />
        </li>
        <li className="flex items-center">
          <span
            aria-current="page"
            className="text-slate-200 font-semibold tracking-wide"
          >
            Overview
          </span>
        </li>
      </ol>
    </nav>
  )
}

export default Breadcrumb
