import React from 'react'
import { Award, Zap, ShieldCheck } from 'lucide-react'
import type { AchievementItemData } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface AchievementBadgeProps {
  achievement: AchievementItemData
  className?: string
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, className }) => {
  const iconMap: Record<string, React.ElementType> = {
    Award,
    Zap,
    ShieldCheck,
  }

  const Icon = iconMap[achievement.icon] || Award

  return (
    <div
      className={cn(
        'p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 flex items-center justify-between gap-3 font-sans text-xs text-left select-none',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm text-[var(--heading)] truncate">{achievement.title}</div>
          <div className="text-[10px] text-[var(--muted)] truncate mt-0.5">{achievement.description}</div>
        </div>
      </div>
      <span className="text-[10px] text-[var(--muted)] font-medium shrink-0">{achievement.earnedAt}</span>
    </div>
  )
}
