import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false)

  const handleCheckConnectivity = () => {
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      if (navigator.onLine) {
        toast.success('We are back online! Syncing...')
        window.location.reload()
      } else {
        toast.error('Still offline. Check your router or internet connection.')
      }
    }, 1500)
  }

  useEffect(() => {
    const handleOnline = () => {
      toast.success('Connection restored!')
      window.location.reload()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-dark-bg font-sans">
      <div className="text-slate-400 mb-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-full border border-slate-200 dark:border-slate-700 animate-pulse">
        <WifiOff size={48} />
      </div>
      <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight mb-2">
        You are offline
      </h1>
      <p className="text-base text-slate-500 dark:text-slate-455 max-w-sm mb-8 leading-relaxed">
        Scorelia cannot reach the services. Please inspect your connection status and select refresh.
      </p>
      <Button
        onClick={handleCheckConnectivity}
        disabled={isChecking}
        className="flex items-center gap-2 font-display font-bold"
      >
        <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
        <span>{isChecking ? 'Checking status...' : 'Check Connection'}</span>
      </Button>
    </div>
  )
}
