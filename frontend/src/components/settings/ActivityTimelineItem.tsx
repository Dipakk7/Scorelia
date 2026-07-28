import React from 'react'
import {
  Key,
  Globe,
  Mail,
  Shield,
  FileText,
  Sliders,
  UserCheck,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { TimelineActivityItem } from './accountOverviewMockData'
import { cn } from '@/lib/utils'

export interface ActivityTimelineItemProps {
  item: TimelineActivityItem
  isLast?: boolean
  className?: string
}

const renderTimelineIcon = (iconName: string, className = 'w-3.5 h-3.5') => {
  switch (iconName) {
    case 'Key': return <Key className={cn(className, 'text-emerald-400')} />
    case 'Globe': return <Globe className={cn(className, 'text-blue-400')} />
    case 'Mail': return <Mail className={cn(className, 'text-indigo-400')} />
    case 'Shield': return <Shield className={cn(className, 'text-cyan-400')} />
    case 'FileText': return <FileText className={cn(className, 'text-emerald-400')} />
    case 'Sliders': return <Sliders className={cn(className, 'text-amber-400')} />
    case 'UserCheck': return <UserCheck className={cn(className, 'text-purple-400')} />
    default: return <CheckCircle2 className={cn(className, 'text-emerald-400')} />
  }
}

export const ActivityTimelineItem: React.FC<ActivityTimelineItemProps> = ({
  item,
  isLast = false,
  className,
}) => {
  return (
    <div
      tabIndex={0}
      aria-label={`${item.title} - ${item.timestamp}`}
      className={cn('relative flex items-start gap-3 text-left font-sans group py-1.5 focus:outline-none', className)}
    >
      {/* Timeline Node Icon & Connector Line */}
      <div className="flex flex-col items-center shrink-0 self-stretch">
        <div className="p-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/10 transition-colors z-10">
          {renderTimelineIcon(item.iconName)}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-[var(--border)]/60 group-hover:bg-[var(--primary)]/30 transition-colors my-1" />
        )}
      </div>

      {/* Item Body */}
      <div className="min-w-0 flex-1 space-y-0.5 pb-1">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-xs font-semibold text-[var(--heading)] truncate group-hover:text-[var(--primary)] transition-colors">
              {item.title}
            </h4>
            {item.badge && (
              <Badge variant="success" className="text-[9px] px-1 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shrink-0">
                {item.badge}
              </Badge>
            )}
          </div>
          <span className="text-[10px] text-[var(--muted)] shrink-0 font-mono">
            {item.timestamp}
          </span>
        </div>
        <p className="text-[11px] text-[var(--muted)] leading-tight line-clamp-1">
          {item.description}
        </p>
      </div>
    </div>
  )
}

export default ActivityTimelineItem
