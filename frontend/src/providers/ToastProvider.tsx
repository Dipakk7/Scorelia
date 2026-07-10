import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--card) / 0.9)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-lg)',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: '13px',
          fontWeight: 600,
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--color-primary-foreground)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-destructive)',
            secondary: 'var(--color-primary-foreground)',
          },
        },
      }}
    />
  )
}
