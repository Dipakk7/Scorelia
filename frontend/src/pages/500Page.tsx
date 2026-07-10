import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ServerErrorPage() {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="text-amber-500 mb-6 bg-amber-50 dark:bg-amber-950/60 p-4 rounded-full border border-amber-100 dark:border-amber-900/50 animate-float">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-3xl font-extrabold font-display text-foreground tracking-tight mb-2">
        500 Internal Server Error
      </h1>
      <p className="text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
        The application synchronization server encountered an unexpected error. Please check back shortly or retry resetting connection parameters.
      </p>
      <Button onClick={handleReload} className="flex items-center gap-2 font-display font-bold">
        <RefreshCw size={16} />
        <span>Reload Workspace</span>
      </Button>
    </div>
  )
}
