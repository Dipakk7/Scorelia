import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface CareerRoadmapErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function CareerRoadmapError({
  title = 'Unable to Load Career Roadmap Data',
  message = 'We encountered an error connecting to the roadmap service. Please try again.',
  onRetry,
  className,
}: CareerRoadmapErrorProps) {
  return (
    <Card className={cn('p-6 sm:p-8 bg-[#121426] border border-rose-500/30 rounded-2xl text-center space-y-4 shadow-sm max-w-xl mx-auto my-4', className)}>
      <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto text-center">
        <h3 className="text-lg font-bold text-white tracking-tight m-0">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium m-0 leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-2 text-xs font-semibold py-2.5 px-4 min-h-[44px] rounded-xl border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Retry Loading</span>
          </Button>
        </div>
      )}
    </Card>
  )
}
export default CareerRoadmapError
