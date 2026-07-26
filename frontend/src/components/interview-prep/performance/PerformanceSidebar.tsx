import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Award, Flame, AlertTriangle, Sparkles, CheckCircle2, Code2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { PerformanceSidebarData } from '@/types/interviewPrep'

export interface PerformanceSidebarProps {
  sidebarData: PerformanceSidebarData
}

export function PerformanceSidebar({ sidebarData }: PerformanceSidebarProps) {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2
      case 'Flame':
        return Flame
      default:
        return Award
    }
  }

  return (
    <div className="space-y-4 text-left">
      {/* 1. Best Performance Spotlight */}
      <Card className="bg-gradient-to-br from-purple-900/40 via-[#10121e] to-[#10121e] border border-purple-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>Best Performance Spotlight</span>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold">
            {sidebarData.bestPerformanceScore}% Peak Score
          </Badge>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white leading-tight">
            {sidebarData.bestPerformanceTitle}
          </h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Rated highest across STAR methodology, storytelling structure, and tone clarity.
          </p>
        </div>
      </Card>

      {/* 2. Quick Statistics */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <CardHeader className="p-0 pb-2 border-b border-white/10">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider">
            Quick Key Statistics
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

      {/* 3. Weekly Highlights */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <CardHeader className="p-0 pb-2 border-b border-white/10">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Weekly Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2 text-xs">
          {sidebarData.weeklyHighlights.map((hl, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{hl}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Areas Requiring Attention */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <CardHeader className="p-0 pb-2 border-b border-white/10">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Areas Requiring Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2 text-xs">
          {sidebarData.areasRequiringAttention.map((area, i) => (
            <div key={i} className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300 font-medium">
              {area}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Achievement Badges */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <CardHeader className="p-0 pb-2 border-b border-white/10">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-purple-400" /> Achievement Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2 text-xs">
          {sidebarData.achievementBadges.map((badge) => {
            const Icon = getBadgeIcon(badge.iconName)

            return (
              <div key={badge.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#141627] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block leading-tight">{badge.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Earned {badge.dateEarned}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
export default PerformanceSidebar
