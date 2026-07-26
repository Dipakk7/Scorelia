import React from 'react'
import { motion } from 'framer-motion'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { SkillCategoryCard } from './SkillCategoryCard'
import { skillCategoriesMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { SkillCategoryItem } from '@/types/careerRoadmap'

export interface SkillCategoryGridProps {
  categories?: SkillCategoryItem[]
  className?: string
}

export function SkillCategoryGrid({
  categories = skillCategoriesMockData,
  className,
}: SkillCategoryGridProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <section aria-label="Skill Categories Proficiency Breakdown" className="w-full text-left">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch',
          className
        )}
      >
        {categories.map((cat) => (
          <motion.div key={cat.id} variants={itemVariants} className="h-full">
            <SkillCategoryCard item={cat} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
export default SkillCategoryGrid
