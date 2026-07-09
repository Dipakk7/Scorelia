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
          'border border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-800/80 transition-all duration-200 overflow-hidden text-left font-sans text-xs relative group',
          className
        )}
        {...props}
      >
        {/* Glow accent bar on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-brand-500 via-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/60 text-left mb-4 flex flex-row items-center justify-between space-y-0 select-none">
          <div className="space-y-1.5 text-left">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0 leading-none">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-[9px] text-slate-500 dark:text-slate-400 font-sans block mt-1.5 leading-none">
                {description}
              </CardDescription>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2 shrink-0">{headerActions}</div>}
        </CardHeader>
        
        <CardContent className="min-h-[220px] flex flex-col justify-center text-left">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader label="Computing insights..." />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-rose-600 dark:text-rose-400 gap-2.5">
              <AlertCircle className="h-10 w-10 stroke-[1.5] animate-bounce" />
              <p className="text-sm font-bold leading-none m-0">Failed to load analytics</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal m-0">
                {error.message || 'An unexpected server error occurred.'}
              </p>
            </div>
          ) : empty ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400 gap-2 font-sans font-medium text-xs">
              <p className="m-0 leading-relaxed">{emptyMessage}</p>
            </div>
          ) : (
            <div className="w-full h-full animate-fade-in text-left">{children}</div>
          )}
        </CardContent>
      </Card>
    )
  }
)

AnalyticsCard.displayName = 'AnalyticsCard'
export default AnalyticsCard
