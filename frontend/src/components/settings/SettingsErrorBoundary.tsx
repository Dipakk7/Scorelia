import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  categoryName?: string
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class SettingsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const category = this.props.categoryName || 'Settings Category Workspace'
    console.error(
      `[SettingsErrorBoundary] Render crash trapped in category "${category}":`,
      {
        category,
        timestamp: new Date().toISOString(),
        error: error?.message || error,
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
      }
    )
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const category = this.props.categoryName || 'Settings Workspace'

      return (
        <div className="rounded-3xl bg-[var(--surface)]/80 border border-amber-500/30 p-8 shadow-xl space-y-4 my-4 font-sans text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--heading)] m-0">
                {category} Temporarily Unavailable
              </h4>
              <p className="text-xs text-[var(--muted)] m-0 mt-1 leading-relaxed">
                An isolated rendering exception occurred in this settings panel. The rest of your Settings workspace remains active.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <span className="text-xs font-mono text-[var(--muted)] truncate max-w-[320px]">
              {this.state.error?.message || 'Render evaluation error'}
            </span>
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Category</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default SettingsErrorBoundary
