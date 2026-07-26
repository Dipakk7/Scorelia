import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { CareerRoadmapHero } from '@/components/career-roadmap/hero/CareerRoadmapHero'
import { CareerRoadmapTabs } from '@/components/career-roadmap/CareerRoadmapTabs'
import type { RoadmapTabId } from '@/components/career-roadmap/CareerRoadmapTabs'
import { CareerRoadmapWorkspace } from '@/components/career-roadmap/CareerRoadmapWorkspace'
import { CareerRoadmapSidebar } from '@/components/career-roadmap/CareerRoadmapSidebar'
import { CareerRoadmapError } from '@/components/career-roadmap/common/CareerRoadmapError'
import { useCareerRoadmap } from '@/hooks/useCareerRoadmap'

export function CareerRoadmapPage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<RoadmapTabId>('roadmap')
  const { isError, refetch } = useCareerRoadmap()

  const handleDownloadRoadmap = () => {
    // UI placeholder action
  }

  const handleRegenerateRoadmap = () => {
    // UI placeholder action
  }

  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <CareerRoadmapError onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6 p-4 sm:p-6 text-left max-w-[1600px] mx-auto font-sans"
    >
      {/* 1. Master Hero Dashboard Section */}
      <CareerRoadmapHero
        onDownloadRoadmap={handleDownloadRoadmap}
        onRegenerateRoadmap={handleRegenerateRoadmap}
      />

      {/* 2. Navigation Tabs */}
      <CareerRoadmapTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. 12-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Workspace (8 Columns on Desktop, Full Width on Tablet/Mobile) */}
        <div className="lg:col-span-8 space-y-6">
          <CareerRoadmapWorkspace activeTab={activeTab} />
        </div>

        {/* Right Sidebar (4 Columns on Desktop, Stacks Vertically on Tablet/Mobile) */}
        <div className="lg:col-span-4 space-y-6">
          <CareerRoadmapSidebar />
        </div>
      </div>
    </motion.div>
  )
}

export default CareerRoadmapPage
