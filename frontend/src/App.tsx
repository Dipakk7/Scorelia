import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { AppRoutes } from '@/routes/AppRoutes'
import './App.css'

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider defaultTheme="system" storageKey="careerpilot-theme">
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
              <ToastProvider />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
