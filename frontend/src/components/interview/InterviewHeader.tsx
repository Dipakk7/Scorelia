import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Sparkles, 
  Play, 
  FileText, 
  MoreVertical, 
  ChevronDown, 
  RotateCcw, 
  Settings, 
  Download,
  LayoutDashboard,
  BarChart3,
  Loader2
} from 'lucide-react'
import type { AdaptedResumeOption } from '@/lib/interview-adapter'

export interface InterviewHeaderProps {
  resumes?: AdaptedResumeOption[]
  selectedResumeId?: string
  onSelectResume?: (id: string) => void
  sessionState?: 'idle' | 'greeting' | 'active_question' | 'ai_thinking' | 'completed'
  activeTab?: 'workspace' | 'analysis'
  onTabChange?: (tab: 'workspace' | 'analysis') => void
  onStartSession?: () => void
  onResetSession?: () => void
  isCreating?: boolean
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  resumes = [],
  selectedResumeId = '',
  onSelectResume,
  sessionState = 'idle',
  activeTab = 'workspace',
  onTabChange,
  onStartSession,
  onResetSession,
  isCreating = false,
}) => {
  const [showMoreActions, setShowMoreActions] = React.useState(false)

  const isSessionActive = sessionState === 'greeting' || sessionState === 'active_question' || sessionState === 'ai_thinking'
  const isCompleted = sessionState === 'completed'

  const statusLabel = isCompleted
    ? 'Completed'
    : isSessionActive
    ? 'In Progress'
    : 'Not Started'

  return (
    <header className="relative w-full rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex flex-col gap-6">
        {/* Top Header Row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Title & Subtitle */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--heading)] md:text-3xl">
                AI Mock Interview
              </h1>
              <Badge
                variant={isCompleted ? 'success' : isSessionActive ? 'info' : 'secondary'}
                className="px-3 py-1 text-xs font-semibold"
              >
                <span
                  className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                    isCompleted ? 'bg-[var(--success)]' : isSessionActive ? 'bg-[var(--primary)] animate-ping' : 'bg-[var(--muted)]'
                  }`}
                />
                {statusLabel}
              </Badge>
            </div>
            <p className="max-w-2xl text-sm text-[var(--muted)] leading-relaxed md:text-base">
              Practice realistic technical & behavioral interviews with real-time AI feedback and performance tracking.
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Resume Selector Dropdown */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <label htmlFor="header-resume-select" className="sr-only">
                Select Target Resume
              </label>
              <div className="relative flex items-center">
                <FileText className="absolute left-3.5 h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                <select
                  id="header-resume-select"
                  value={selectedResumeId}
                  onChange={(e) => onSelectResume && onSelectResume(e.target.value)}
                  className="h-10 w-full rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--surface-hover)] pl-10 pr-9 text-xs font-medium text-[var(--body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
                >
                  <option value="">Select Target Resume...</option>
                  {(resumes ?? []).map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 h-4 w-4 pointer-events-none text-[var(--muted)]" aria-hidden="true" />
              </div>
            </div>

            {/* Start / Reset Session Button */}
            {!isSessionActive && !isCompleted ? (
              <Button
                variant="primary"
                onClick={onStartSession}
                isLoading={isCreating}
                disabled={isCreating}
                className="h-10 min-h-[44px] min-w-[150px] gap-2 text-sm font-semibold cursor-pointer shadow-md"
                aria-label="Start AI Mock Interview Session"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <span>Start Interview</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onResetSession}
                className="h-10 min-h-[44px] min-w-[140px] gap-2 text-xs font-semibold cursor-pointer"
                aria-label="Reset Interview Configuration"
              >
                <RotateCcw className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
                <span>Reset Session</span>
              </Button>
            )}

            {/* More Actions Dropdown Menu */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 min-h-[44px] min-w-[44px]"
                aria-label="More Actions Menu"
                aria-expanded={showMoreActions}
                onClick={() => setShowMoreActions((prev) => !prev)}
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>

              {showMoreActions && (
                <div
                  className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-lg animate-fade-in"
                  role="menu"
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--body)] hover:bg-[var(--surface-hover)] focus:outline-none cursor-pointer"
                    onClick={() => {
                      if (onResetSession) onResetSession()
                      setShowMoreActions(false)
                    }}
                  >
                    <RotateCcw className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                    Reset Session
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--body)] hover:bg-[var(--surface-hover)] focus:outline-none cursor-pointer"
                    onClick={() => setShowMoreActions(false)}
                  >
                    <Settings className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                    Interview Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-[var(--border)] pt-4" role="tablist" aria-label="Interview Navigation Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'workspace'}
            onClick={() => onTabChange && onTabChange('workspace')}
            className={`flex h-10 min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] px-4 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'workspace'
                ? 'border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm'
                : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            <span>Interview Workspace</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'analysis'}
            onClick={() => onTabChange && onTabChange('analysis')}
            className={`flex h-10 min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] px-4 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'analysis'
                ? 'border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm'
                : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)]'
            }`}
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            <span>Answer Analysis & Feedback</span>
            {isCompleted && (
              <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default InterviewHeader
