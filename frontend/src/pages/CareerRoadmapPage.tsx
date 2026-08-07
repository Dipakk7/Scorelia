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
    <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 text-slate-100 selection:bg-purple-500/30 font-sans text-left">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="space-y-4 sm:space-y-5"
      >
        {/* 1. Master Hero & Overview Section */}
        <CareerRoadmapHero
          onDownloadRoadmap={handleDownloadRoadmap}
          onRegenerateRoadmap={handleRegenerateRoadmap}
        />

        {/* 2. Navigation Tabs */}
        <CareerRoadmapTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 3. 12-Column Responsive Workspace Layout Grid */}
        <main
          aria-label="Career Roadmap Main Workspace"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start w-full max-w-full overflow-x-hidden"
        >
          {/* Main Content Workspace (8 Columns on Desktop, Full Width on Tablet/Mobile) */}
          <section
            aria-label="Career Roadmap Main Content"
            className="lg:col-span-8 space-y-4 sm:space-y-5 w-full min-w-0"
          >
            <CareerRoadmapWorkspace activeTab={activeTab} />
          </section>

          {/* Right Sidebar (4 Columns on Desktop, Stacks Vertically on Tablet/Mobile) */}
          <aside
            aria-label="Career Roadmap Sidebar"
            className="lg:col-span-4 space-y-4 sm:space-y-5 w-full min-w-0"
          >
            <CareerRoadmapSidebar />
          </aside>
        </main>
      </motion.div>
    </div>
  )
}

export default CareerRoadmapPage
