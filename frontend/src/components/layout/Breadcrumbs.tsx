import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  // Map route segments to human-readable labels
  const getBreadcrumbLabel = (segment: string) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-[10px] font-bold uppercase tracking-widest font-display', className)}>
      <ol className="flex items-center gap-2 text-[var(--muted)]">
        <li className="flex items-center">
          <Link
            to="/dashboard"
            className="hover:text-[var(--primary)] flex items-center transition-colors focus-visible:ring-1 focus-visible:ring-[var(--primary)] rounded"
          >
            <Home size={13} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          const label = getBreadcrumbLabel(value)

          // Skip root path segment if it's dashboard to avoid home -> dashboard duplicates
          if (value.toLowerCase() === 'dashboard' && index === 0) return null

          return (
            <li key={to} className="flex items-center gap-2">
              <ChevronRight size={11} className="text-[var(--border)]" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-extrabold text-[var(--heading)] tracking-wider"
                >
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-[var(--primary)] transition-colors focus-visible:ring-1 focus-visible:ring-[var(--primary)] rounded"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
