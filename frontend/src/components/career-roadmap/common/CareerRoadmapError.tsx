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
    <Card className={cn('p-8 sm:p-12 bg-[#121320] border border-rose-500/20 rounded-3xl text-center space-y-4 shadow-sm text-left', className)}>
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
            className="flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Retry Loading</span>
          </Button>
        </div>
      )}
    </Card>
  )
}
export default CareerRoadmapError
