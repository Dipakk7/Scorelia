import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  sectionName?: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ATSWidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const section = this.props.sectionName || 'ATS Workspace Section'
    console.error(
      `[ATSWidgetErrorBoundary] Render crash trapped in section "${section}":`,
      {
        section,
        timestamp: new Date().toISOString(),
        error: error?.message || error,
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
      }
    )
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const section = this.props.sectionName || 'ATS Section'

      return (
        <div className="rounded-2xl bg-slate-900/90 border border-amber-500/30 p-5 shadow-lg space-y-3 my-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                {section} temporarily unavailable
              </h4>
              <p className="text-xs text-slate-400">
                An isolated rendering exception occurred in this card. The rest of your ATS workspace is unaffected.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-500 truncate max-w-[280px]">
              {this.state.error?.message || 'Render evaluation error'}
            </span>
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Section</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ATSWidgetErrorBoundary
