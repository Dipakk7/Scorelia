import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

interface LoaderProps {
  className?: string
  fullScreen?: boolean
  label?: string
}

export function Loader({ className, fullScreen = false, label }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-8 min-h-[200px]',
        fullScreen && 'fixed inset-0 z-50 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-sm min-h-screen',
        className
      )}
    >
      <Spinner size={fullScreen ? 'lg' : 'md'} />
      {label && (
        <span className="text-sm font-medium text-muted-foreground font-display animate-pulse">
          {label}
        </span>
      )}
    </div>
  )
}
