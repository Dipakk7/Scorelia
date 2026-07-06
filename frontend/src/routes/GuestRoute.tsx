import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Loader } from '@/components/ui/Loader'

interface GuestRouteProps {
  children?: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <Loader fullScreen label="Checking session..." />
  }

  if (isAuthenticated) {
    // If user is logged in, redirect to dashboard or the redirected-from location
    const from = (location.state as any)?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return children ? <>{children}</> : null
}
