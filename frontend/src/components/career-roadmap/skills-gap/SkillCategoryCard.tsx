import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Code, Award, Zap, Sparkles, Cpu, Database, Server, Cloud, Settings } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SkillProgressBar } from './SkillProgressBar'
import { getCardVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { SkillCategoryItem } from '@/types/careerRoadmap'

export interface SkillCategoryCardProps {
  item: SkillCategoryItem
  className?: string
}

export const SkillCategoryCard = memo(function SkillCategoryCard({ item, className }: SkillCategoryCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const cardVariants = getCardVariants(shouldReduceMotion)

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="h-4 w-4 text-emerald-400" aria-hidden="true" />
      case 'award':
        return <Award className="h-4 w-4 text-amber-400" aria-hidden="true" />
      case 'zap':
        return <Zap className="h-4 w-4 text-blue-400" aria-hidden="true" />
      case 'sparkles':
        return <Sparkles className="h-4 w-4 text-purple-400" aria-hidden="true" />
      case 'cpu':
        return <Cpu className="h-4 w-4 text-cyan-400" aria-hidden="true" />
      case 'database':
        return <Database className="h-4 w-4 text-emerald-400" aria-hidden="true" />
      case 'server':
        return <Server className="h-4 w-4 text-blue-400" aria-hidden="true" />
      case 'cloud':
        return <Cloud className="h-4 w-4 text-amber-400" aria-hidden="true" />
      case 'settings':
      default:
        return <Settings className="h-4 w-4 text-rose-400" aria-hidden="true" />
    }
  }

  const getStatusBadgeStyle = () => {
    switch (item.status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'missing':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      case 'in-progress':
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  return (
    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="h-full">
      <Card
        className={cn(
          'p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-3 shadow-sm hover:border-purple-500/30 transition-all text-left flex flex-col justify-between h-full',
          className
        )}
      >
        <div className="space-y-2">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/10 shrink-0">
                {renderIcon(item.iconName)}
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight truncate m-0">
                {item.name}
              </h4>
            </div>
            <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border', getStatusBadgeStyle())}>
              {item.status.replace('-', ' ')}
            </span>
          </div>

          {/* Progress Bar & Value */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span className="text-[11px]">Proficiency</span>
              <span className="font-bold text-white font-mono">{item.completion}%</span>
            </div>
            <SkillProgressBar value={item.completion} status={item.status} height="h-2" />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>Difficulty: <strong className="text-slate-300">{item.difficulty}</strong></span>
          <span className="font-mono text-purple-400 font-bold">Category</span>
        </div>
      </Card>
    </motion.div>
  )
})
export default SkillCategoryCard
