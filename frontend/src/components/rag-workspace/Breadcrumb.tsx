import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbProps {
  className?: string
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs font-medium text-[var(--muted)] select-none', className)}>
      <ol className="flex items-center gap-1.5 sm:gap-2 m-0 p-0 list-none">
        <li className="flex items-center">
          <Link
            to="/rag-workspace"
            className="hover:text-[var(--heading)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded px-1 -mx-1 text-[var(--muted)] font-medium"
          >
            RAG Workspace
          </Link>
        </li>
        <li className="flex items-center gap-1.5" aria-hidden="true">
          <ChevronRight size={13} className="text-[var(--muted)] opacity-60 shrink-0" />
        </li>
        <li className="flex items-center">
          <span
            aria-current="page"
            className="text-[var(--heading)] font-semibold tracking-tight"
          >
            Overview
          </span>
        </li>
      </ol>
    </nav>
  )
}

export default Breadcrumb

