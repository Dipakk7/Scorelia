import React from 'react'
import { MessageSquare, Flame, Pin, Sparkles, Target, History } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { CopilotSidebarData } from '@/types/interviewPrep'

export interface CopilotSidebarProps {
  sidebarData: CopilotSidebarData
  onSelectConversation?: (id: string) => void
}

export function CopilotSidebar({ sidebarData, onSelectConversation }: CopilotSidebarProps) {
  return (
    <div className="space-y-4 text-left">
      {/* 1. Daily Goal & Streak */}
      <Card className="bg-gradient-to-br from-purple-900/30 via-[#10121e] to-[#10121e] border border-purple-500/30 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-purple-400" /> Today's Copilot Goal
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            <Flame className="h-3.5 w-3.5 fill-amber-400" />
            <span>{sidebarData.streakDays} Days</span>
          </div>
        </div>
        <p className="text-xs font-semibold text-white leading-snug">
          {sidebarData.todayGoalText}
        </p>
      </Card>

      {/* 2. Quick Statistics */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <CardHeader className="p-0 pb-2 border-b border-white/10">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider">
            Copilot Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2 text-xs">
          {sidebarData.quickStats.map((st, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#141627] border border-white/5">
              <span className="text-slate-400 font-medium">{st.label}</span>
              <span className="font-bold text-white font-mono">{st.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Recent Conversations */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <CardHeader className="p-0 pb-2 border-b border-white/10">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-purple-400" /> Recent Chat Threads
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2 text-xs">
          {sidebarData.recentConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation && onSelectConversation(conv.id)}
              className="p-2.5 rounded-xl bg-[#141627] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer space-y-0.5"
            >
              <span className="font-bold text-white block truncate">{conv.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">{conv.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Pinned Topics */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <CardHeader className="p-0 pb-2 border-b border-white/10">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Pin className="h-3.5 w-3.5 text-purple-400" /> Pinned Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-wrap gap-1.5">
          {sidebarData.pinnedTopics.map((top, i) => (
            <Badge key={i} className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-[10px] font-semibold py-1 px-2.5">
              {top}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
export default CopilotSidebar
