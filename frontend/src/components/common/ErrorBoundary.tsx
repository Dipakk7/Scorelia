import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

import { ErrorState } from '@/components/ui/ErrorState'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled rendering crash:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen flex items-center justify-center p-6 bg-background transition-colors font-sans">
          <div className="max-w-lg w-full bg-card p-6 rounded-2xl border border-border shadow-xl space-y-6">
            <ErrorState
              title="Application Render Crash"
              message="Something went wrong inside the Scorelia workspace. Please try reloading or check the developer logs."
              retryLabel="Reload Application"
              onRetry={this.handleReset}
              className="border-0 bg-transparent dark:bg-transparent min-h-0 p-0"
            />
            {this.state.error && (
              <details className="text-left text-xs bg-muted p-4 rounded-xl border border-border">
                <summary className="font-bold text-muted-foreground cursor-pointer select-none">
                  Diagnostic crash details
                </summary>
                <pre className="mt-3 overflow-x-auto text-[10px] text-destructive font-mono whitespace-pre-wrap leading-normal">
                  {this.state.error.stack || this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
export default ErrorBoundary

