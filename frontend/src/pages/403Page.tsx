import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ForbiddenPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="text-[var(--danger)] mb-6 bg-[var(--danger)]/10 p-4 rounded-full border border-[var(--danger)]/20 animate-pulse">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-heading-xl text-[var(--heading)] tracking-tight mb-2">
        403 Access Denied
      </h1>
      <p className="text-body-md text-[var(--body)] max-w-md mb-8 leading-relaxed">
        You do not possess the required workspace authorizations to view this component. Contact the enterprise coordinator for authorization access.
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
