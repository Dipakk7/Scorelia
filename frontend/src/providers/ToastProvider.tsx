import { Toaster } from 'react-hot-toast'
import { useTheme } from '@/providers/ThemeProvider'

export function ToastProvider() {
  const { theme } = useTheme()

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: theme === 'dark' ? 'rgba(17, 23, 38, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
          border: theme === 'dark' ? '1px solid rgba(31, 41, 61, 0.5)' : '1px solid rgba(226, 232, 240, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '12px 18px',
          boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: '13px',
          fontWeight: 600,
        },
        success: {
          iconTheme: {
            primary: '#0F9D9A',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  )
}
