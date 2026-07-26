import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Award, Zap, Database, Server, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { getCardVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { AchievementItem } from '@/types/careerRoadmap'

export interface AchievementCardProps {
  achievement: AchievementItem
  className?: string
}

export const AchievementCard = memo(function AchievementCard({ achievement, className }: AchievementCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const cardVariants = getCardVariants(shouldReduceMotion)

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="h-5 w-5 text-amber-400" aria-hidden="true" />
      case 'zap':
        return <Zap className="h-5 w-5 text-purple-400" aria-hidden="true" />
      case 'database':
        return <Database className="h-5 w-5 text-emerald-400" aria-hidden="true" />
      case 'server':
      default:
        return <Server className="h-5 w-5 text-blue-400" aria-hidden="true" />
    }
  }

  return (
    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="h-full">
      <Card
        className={cn(
          'p-4 bg-[#121320] border border-white/10 rounded-2xl space-y-3 shadow-sm hover:border-amber-500/30 transition-all text-left flex flex-col justify-between h-full',
          className
        )}
      >
        <div className="space-y-2">
          {/* Header Badge */}
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              {renderIcon(achievement.iconName)}
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300">
              {achievement.badgeRibbon}
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1 text-left">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 m-0">
              <span>{achievement.title}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 m-0">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Unlock Date */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-medium text-slate-400">
          <span>Unlocked:</span>
          <strong className="text-slate-300 font-mono">{achievement.unlockDate}</strong>
        </div>
      </Card>
    </motion.div>
  )
})
export default AchievementCard
