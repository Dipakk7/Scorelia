import { Link } from 'react-router-dom'
import { HelpCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="text-brand-500 mb-6 bg-brand-50 dark:bg-brand-950/60 p-4 rounded-full border border-brand-100 dark:border-brand-900/50 animate-float">
        <HelpCircle size={48} />
      </div>
      <h1 className="text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight mb-2">
        404 Page Not Found
      </h1>
      <p className="text-base text-slate-500 dark:text-slate-450 max-w-md mb-8 leading-relaxed">
        The destination you are trying to reach does not exist or has been shifted. Let's redirect you back to active coordinate dashboard.
      </p>
      <Link to="/dashboard">
        <Button className="flex items-center gap-2 font-display font-bold">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
    </div>
  )
}
