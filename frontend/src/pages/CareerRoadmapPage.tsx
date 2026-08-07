import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { CareerRoadmapHero } from '@/components/career-roadmap/hero/CareerRoadmapHero'
import { CareerRoadmapTabs } from '@/components/career-roadmap/CareerRoadmapTabs'
import type { RoadmapTabId } from '@/components/career-roadmap/CareerRoadmapTabs'
import { CareerRoadmapWorkspace } from '@/components/career-roadmap/CareerRoadmapWorkspace'
import { CareerRoadmapSidebar } from '@/components/career-roadmap/CareerRoadmapSidebar'
import ReportsWorkspace from '@/components/career-roadmap/reports/ReportsWorkspace'
import { CareerRoadmapError } from '@/components/career-roadmap/common/CareerRoadmapError'
import { useCareerRoadmap } from '@/hooks/useCareerRoadmap'

export function CareerRoadmapPage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getSectionVariants(shouldReduceMotion)

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
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-4 sm:space-y-5"
      >
        {/* 1. Master Hero & Overview Section */}
        <motion.div variants={itemVariants}>
          <CareerRoadmapHero
            onDownloadRoadmap={handleDownloadRoadmap}
            onRegenerateRoadmap={handleRegenerateRoadmap}
          />
        </motion.div>

        {/* 2. Navigation Tabs (Matching ATS Analysis Reference) */}
        <motion.div variants={itemVariants}>
          <CareerRoadmapTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* 3. Responsive Workspace Layout */}
        <AnimatePresence mode="wait">
          {activeTab === 'reports' ? (
            <main aria-label="Career Reports Workspace" className="w-full max-w-full overflow-x-hidden">
              <ReportsWorkspace />
            </main>
          ) : (
            <main
              aria-label="Career Roadmap Main Workspace"
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start w-full max-w-full overflow-x-hidden"
            >
              {/* Main Content Workspace (8 Columns on Desktop) */}
              <section
                aria-label="Career Roadmap Main Content"
                className="lg:col-span-8 space-y-4 sm:space-y-5 w-full min-w-0"
              >
                <CareerRoadmapWorkspace activeTab={activeTab} />
              </section>

              {/* Right Sidebar (4 Columns on Desktop) */}
              <aside
                aria-label="Career Roadmap Sidebar"
                className="lg:col-span-4 space-y-4 sm:space-y-5 w-full min-w-0"
              >
                <CareerRoadmapSidebar />
              </aside>
            </main>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CareerRoadmapPage
