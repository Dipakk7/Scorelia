import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ServerErrorPage() {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="text-[var(--warning)] mb-6 bg-[var(--warning)]/10 p-4 rounded-full border border-[var(--warning)]/20 animate-float">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-heading-xl text-[var(--heading)] tracking-tight mb-2">
        500 Internal Server Error
      </h1>
      <p className="text-body-md text-[var(--muted)] max-w-md mb-8 leading-relaxed">
        The application synchronization server encountered an unexpected error. Please check back shortly or retry resetting connection parameters.
      </p>
      <Button onClick={handleReload} className="flex items-center gap-2 font-display font-bold">
        <RefreshCw size={16} />
        <span>Reload Workspace</span>
      </Button>
    </div>
  )
}
