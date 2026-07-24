import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  widgetName?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.warn(`[WidgetErrorBoundary] Caught error in ${this.props.widgetName || 'widget'}:`, error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="bg-[#0b0c14]/90 border-amber-800/40 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 backdrop-blur-md min-h-[160px] shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h4 className="text-xs font-bold text-slate-200">
            {this.props.widgetName ? `${this.props.widgetName} Unavailable` : 'Widget Temporarily Unavailable'}
          </h4>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            We encountered an issue rendering this section. Other dashboard features remain fully functional.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-purple-400" />
            <span>Retry Section</span>
          </button>
        </Card>
      )
    }

    return this.props.children
  }
}

export default WidgetErrorBoundary
