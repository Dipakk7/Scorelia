import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Loader } from '@/components/ui/Loader'
import { AlertCircle } from 'lucide-react'

interface AnalyticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  loading?: boolean
  error?: Error | null
  empty?: boolean
  emptyMessage?: string
  headerActions?: React.ReactNode
}

export const AnalyticsCard = React.forwardRef<HTMLDivElement, AnalyticsCardProps>(
  (
    {
      className,
      title,
      description,
      loading = false,
      error = null,
      empty = false,
      emptyMessage = 'No data available for the selected filter.',
      headerActions,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-300 hover:shadow-lg dark:hover:shadow-slate-900/40 border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden relative group',
          className
        )}
        {...props}
      >
        {/* Glow accent bar on hover */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-brand-500 via-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/40 mb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs text-slate-400 dark:text-slate-400 font-sans">
                {description}
              </CardDescription>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </CardHeader>
        
        <CardContent className="min-h-[220px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader label="Computing insights..." />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-rose-500 dark:text-rose-400 gap-2.5">
              <AlertCircle className="h-10 w-10 stroke-[1.5]" />
              <p className="text-sm font-semibold">Failed to load analytics</p>
              <p className="text-xs text-slate-400 dark:text-slate-400">
                {error.message || 'An unexpected server error occurred.'}
              </p>
            </div>
          ) : empty ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500 gap-2">
              <p className="text-sm font-medium">{emptyMessage}</p>
            </div>
          ) : (
            <div className="w-full h-full animate-fade-in">{children}</div>
          )}
        </CardContent>
      </Card>
    )
  }
)

AnalyticsCard.displayName = 'AnalyticsCard'
