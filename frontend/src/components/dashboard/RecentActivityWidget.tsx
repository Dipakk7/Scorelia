import React from 'react'
import {
  FileText,
  Scan,
  MessageSquareCode,
  Briefcase,
  MapPin,
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'

export interface ActivityLogItem {
  title: string
  time: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
}

const DEFAULT_ACTIVITIES: ActivityLogItem[] = [
  { title: 'Resume updated', time: '2m ago', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { title: 'ATS analysis completed', time: '15m ago', icon: Scan, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { title: 'Mock interview completed', time: '1h ago', icon: MessageSquareCode, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { title: 'Applied to Microsoft', time: '3h ago', icon: Briefcase, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { title: 'GitHub profile analyzed', time: '5h ago', icon: Github, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { title: 'Roadmap updated', time: 'Yesterday', icon: MapPin, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
]

interface RecentActivityWidgetProps {
  activities?: ActivityLogItem[]
  onViewAll?: () => void
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = React.memo(({
  activities = DEFAULT_ACTIVITIES,
  onViewAll,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/90 border border-white/10 backdrop-blur-md space-y-4 shadow-xl select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight">Recent Activity</h3>
        <button
          onClick={onViewAll}
          className="text-[10px] font-mono text-purple-400 hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {activities.map((act, idx) => {
          const Icon = act.icon
          return (
            <div
              key={idx}
              className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg border shrink-0 ${act.color}`}>
                  <Icon size={13} />
                </div>
                <span className="text-slate-300 font-medium truncate text-[11px]">{act.title}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{act.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
export default RecentActivityWidget
