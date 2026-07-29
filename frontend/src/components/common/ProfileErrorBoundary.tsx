import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from '@/components/ui/ErrorState'

interface Props {
  children?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ProfileErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ProfileErrorBoundary] Render crash trapped in Profile module:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-transparent font-sans text-left">
          <div className="max-w-lg w-full bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-xl space-y-6">
            <ErrorState
              title="Profile Workspace Error"
              message="An isolated rendering exception occurred in the Profile module. The rest of your Scorelia workspace remains active."
              retryLabel="Retry Profile"
              onRetry={this.handleRetry}
              className="border-0 bg-transparent min-h-0 p-0"
            />
            {this.state.error && (
              <details className="text-left text-xs bg-[var(--surface-hover)] p-4 rounded-xl border border-[var(--border)]">
                <summary className="font-bold text-[var(--muted)] cursor-pointer select-none">
                  Diagnostic Exception Stack
                </summary>
                <pre className="mt-3 overflow-x-auto text-[10px] text-rose-400 font-mono whitespace-pre-wrap leading-normal m-0">
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

export default ProfileErrorBoundary
