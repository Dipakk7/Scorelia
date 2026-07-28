import React from 'react'
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import { SidebarCard } from './SidebarCard'
import { ScoreRing } from '@/components/ui/ScoreRing'
import type { AccountHealthData } from './accountOverviewMockData'
import { cn } from '@/lib/utils'

export interface AccountHealthCardProps {
  healthData: AccountHealthData
  onViewDetails?: () => void
  className?: string
}

export const AccountHealthCard: React.FC<AccountHealthCardProps> = ({
  healthData,
  onViewDetails,
  className,
}) => {
  return (
    <SidebarCard
      title="Account Health"
      icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
      action={
        <a
          href="#health-details"
          onClick={(e) => {
            e.preventDefault()
            onViewDetails?.()
          }}
          className="text-xs text-[var(--primary)] hover:underline font-medium inline-flex items-center gap-0.5"
        >
          Details <ArrowRight className="w-3 h-3" />
        </a>
      }
      className={className}
    >
      {/* Score Gauge Ring */}
      <div className="flex items-center gap-3 py-1">
        <div className="relative shrink-0">
          <ScoreRing
            value={healthData.score}
            max={healthData.maxScore}
            size={80}
            strokeWidth={6}
            color="--success"
          />
        </div>
        <div className="space-y-1 min-w-0">
          <span className="text-xs font-bold text-emerald-400 block">
            {healthData.statusLabel}
          </span>
          <p className="text-[11px] text-[var(--muted)] leading-tight">
            {healthData.description}
          </p>
        </div>
      </div>

      {/* Security Checklist Rows */}
      <div className="space-y-2 pt-2 border-t border-[var(--border)]/40 text-xs">
        {healthData.checklist.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-[var(--body)] min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
            <span className="font-semibold text-emerald-400 font-mono shrink-0">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Recommendations List */}
      {healthData.recommendations.length > 0 && (
        <div className="pt-2 border-t border-[var(--border)]/40 space-y-1 text-left">
          <h4 className="text-[11px] font-bold text-[var(--heading)] uppercase tracking-wider">
            Recommendations
          </h4>
          <ul className="space-y-0.5 text-[11px] text-[var(--muted)]">
            {healthData.recommendations.map((rec, i) => (
              <li key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-1 h-1 rounded-full bg-[var(--primary)] shrink-0" />
                <span className="truncate">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SidebarCard>
  )
}

export default AccountHealthCard
