import React from 'react'
import { ShieldCheck, HelpCircle, Server, ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SettingsBottomStatusProps {
  className?: string
  isSaving?: boolean
  lastSavedAt?: string
}

export const SettingsBottomStatus: React.FC<SettingsBottomStatusProps> = React.memo(({
  className,
  isSaving = false,
  lastSavedAt = 'Just now',
}) => {
  return (
    <footer
      aria-label="Settings Status Bar"
      className={cn(
        'w-full p-4 rounded-[var(--radius-card)] bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm font-sans text-left mt-8',
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center divide-y md:divide-y-0 md:divide-x divide-[var(--border)]/40">
        {/* 1. Security & Auto-Save Live Status */}
        <div className="flex items-center gap-3 pr-0 md:pr-4 py-2 md:py-0" aria-live="polite">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            {isSaving ? (
              <span className="w-5 h-5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin block" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--heading)] flex items-center gap-1.5">
              <span>{isSaving ? 'Saving preferences...' : 'Preferences synchronized'}</span>
              {!isSaving && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
            </h4>
            <p className="text-[11px] text-[var(--muted)]">
              {isSaving ? 'Persisting changes to Scorelia cloud...' : `Last saved ${lastSavedAt}`}
            </p>
          </div>
        </div>

        {/* 2. Help Center */}
        <div className="flex items-center gap-3 px-0 md:px-4 py-2 md:py-0">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--heading)]">
              Need help?
            </h4>
            <p className="text-[11px] text-[var(--muted)]">
              Visit our{' '}
              <a
                href="#help"
                onClick={(e) => e.preventDefault()}
                className="text-[var(--primary)] hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] rounded"
              >
                help center
              </a>{' '}
              or{' '}
              <a
                href="#support"
                onClick={(e) => e.preventDefault()}
                className="text-[var(--primary)] hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] rounded"
              >
                contact support
              </a>
            </p>
          </div>
        </div>

        {/* 3. System Status */}
        <div className="flex items-center justify-between gap-3 pl-0 md:pl-4 py-2 md:py-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--heading)]">
                System Status
              </h4>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </p>
            </div>
          </div>
          <a
            href="#status"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-medium text-[var(--primary)] hover:underline inline-flex items-center gap-0.5 shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] rounded"
          >
            View Status Page <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  )
})

SettingsBottomStatus.displayName = 'SettingsBottomStatus'
export default SettingsBottomStatus
