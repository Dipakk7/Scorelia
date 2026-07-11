import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--surface)',
          color: 'var(--heading)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-md)',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: '13px',
          fontWeight: 600,
        },
        success: {
          iconTheme: {
            primary: 'var(--success)',
            secondary: 'var(--surface)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--danger)',
            secondary: 'var(--surface)',
          },
        },
      }}
    />
  )
}
