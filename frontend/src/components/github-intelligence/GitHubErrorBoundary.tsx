import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { GitHubErrorState } from './GitHubErrorState'

interface Props {
  children: ReactNode
  sectionName?: string
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class GitHubErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const section = this.props.sectionName || 'GitHub Workspace Component'
    console.error(
      `[GitHubErrorBoundary] Render exception caught in "${section}":`,
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
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <GitHubErrorState
          errorType="500"
          message={`A rendering error occurred in ${this.props.sectionName || 'the GitHub workspace'}: ${this.state.error?.message || 'Unexpected Error'}`}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

export default GitHubErrorBoundary
