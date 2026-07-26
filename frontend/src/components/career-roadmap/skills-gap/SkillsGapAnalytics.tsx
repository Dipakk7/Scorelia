import React from 'react'
import { SkillsGapOverview } from './SkillsGapOverview'
import { SkillCategoryGrid } from './SkillCategoryGrid'
import { MissingSkillsCard } from './MissingSkillsCard'
import { PriorityMatrix } from './PriorityMatrix'
import { MarketDemandCard } from './MarketDemandCard'
import { CertificationCard } from './CertificationCard'
import { LearningPathCard } from './LearningPathCard'
import { SkeletonAnalytics } from '../common/SkeletonAnalytics'
import { useSkillsGap } from '@/hooks/useSkillsGap'
import { cn } from '@/lib/utils'

export interface SkillsGapAnalyticsProps {
  className?: string
}

export function SkillsGapAnalytics({ className }: SkillsGapAnalyticsProps) {
  const {
    skillsOverview,
    skillCategories,
    missingSkills,
    priorityMatrix,
    marketDemand,
    certificationRecommendations,
    learningPath,
    isLoading,
  } = useSkillsGap()

  if (isLoading && !skillsOverview) {
    return <SkeletonAnalytics />
  }

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* 1. Overview KPIs */}
      <SkillsGapOverview overview={skillsOverview} />

      {/* 2. Recommended Learning Path Sequence */}
      <LearningPathCard steps={learningPath.length > 0 ? learningPath : undefined} />

      {/* 3. Skill Categories Grid (9 categories) */}
      <SkillCategoryGrid categories={skillCategories.length > 0 ? skillCategories : undefined} />

      {/* 4. Top Missing Skills */}
      <MissingSkillsCard skills={missingSkills.length > 0 ? missingSkills : undefined} />

      {/* 5. 2x2 Priority Matrix */}
      <PriorityMatrix items={priorityMatrix.length > 0 ? priorityMatrix : undefined} />

      {/* 6. Market Demand & Salary Insights */}
      <MarketDemandCard marketData={marketDemand} />

      {/* 7. Industry Certification Recommendations */}
      <CertificationCard certifications={certificationRecommendations.length > 0 ? certificationRecommendations : undefined} />
    </div>
  )
}
export default SkillsGapAnalytics
