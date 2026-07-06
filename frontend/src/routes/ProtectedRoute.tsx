import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Loader } from '@/components/ui/Loader'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <Loader fullScreen label="Authenticating session..." />
  }

  if (!isAuthenticated) {
    // Redirect to login but save current location for post-login redirection
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ? <>{children}</> : null
}
