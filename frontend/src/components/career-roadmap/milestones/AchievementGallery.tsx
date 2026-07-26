import React from 'react'
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { AchievementCard } from './AchievementCard'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { achievementGalleryMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { AchievementItem } from '@/types/careerRoadmap'

export interface AchievementGalleryProps {
  achievements?: AchievementItem[]
  className?: string
}

export function AchievementGallery({
  achievements = achievementGalleryMockData,
  className,
}: AchievementGalleryProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Award className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>Career Achievement Gallery</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Earned career badges and verified skill milestones
          </p>
        </div>
        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
          4 Badges Unlocked
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
      >
        {achievements.map((ach) => (
          <motion.div key={ach.id} variants={itemVariants} className="h-full">
            <AchievementCard achievement={ach} />
          </motion.div>
        ))}
      </motion.div>
    </Card>
  )
}
export default AchievementGallery
