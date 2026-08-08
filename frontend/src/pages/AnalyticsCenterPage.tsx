import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { analyticsHeroMockData } from '@/data/analyticsHeroMockData'
import type { KPIMetricItem } from '@/data/analyticsHeroMockData'
import { useAnalyticsOverview } from '@/services/analytics/analyticsQueries'
import { AnalyticsHeroDashboard } from '@/components/analytics-center/AnalyticsHeroDashboard'
import type { AnalyticsTabId } from '@/components/analytics-center/AnalyticsTabs'
import { AnalyticsWorkspace } from '@/components/analytics-center/AnalyticsWorkspace'
import { ReportsWorkspace } from '@/components/analytics-center/ReportsWorkspace'
import { PerformanceDashboard } from '@/components/analytics-center/PerformanceDashboard'
import { ActiveUsersGrowthChart } from '@/components/analytics-center/ActiveUsersGrowthChart'
import { PlatformActivityChart } from '@/components/analytics-center/PlatformActivityChart'
import { TopFeaturesChart } from '@/components/analytics-center/TopFeaturesChart'
import { AnalyticsSidebar } from '@/components/analytics-center/AnalyticsSidebar'
import { InsightCardsSection } from '@/components/analytics-center/InsightCardsSection'
import { PerformanceSection } from '@/components/analytics-center/PerformanceSection'
import { PersonalizationDrawer } from '@/components/analytics-center/PersonalizationDrawer'

export function AnalyticsCenterPage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<AnalyticsTabId>('overview')
  const [selectedKPI, setSelectedKPI] = useState<KPIMetricItem | null>(null)
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false)

  // Live Backend Query with Fallback
  const { data: overviewMetrics, isLoading, refetch } = useAnalyticsOverview()

  const heroData = {
    ...analyticsHeroMockData,
    kpis: overviewMetrics && overviewMetrics.length > 0 ? overviewMetrics : analyticsHeroMockData.kpis,
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: shouldReduceMotion ? 0 : 0.02,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: 'easeOut' },
    },
  }

  const handleRefreshData = () => {
    refetch()
  }

  const handleKPICardClick = (kpi: KPIMetricItem) => {
    setSelectedKPI(kpi)
  }

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 lg:space-y-6 text-slate-100 selection:bg-purple-500/30 font-sans max-w-[1920px] mx-auto text-left min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-5"
      >
        {/* 1. Executive Hero Dashboard (Hero, Toolbar & Navigation Tabs) */}
        <motion.div variants={itemVariants}>
          <AnalyticsHeroDashboard
            data={heroData}
            selectedKpiId={selectedKPI?.id}
            isLoading={isLoading}
            onRefreshData={handleRefreshData}
            onCustomizeDashboard={() => setIsPersonalizationOpen(true)}
            onCardClick={handleKPICardClick}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </motion.div>

        {/* 2. Main Content Tab Workspace Layout */}
        <motion.div
          variants={itemVariants}
          id={`analytics-tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`analytics-tab-${activeTab}`}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <AnalyticsWorkspace onNavigateTab={setActiveTab} />
              </motion.div>
            )}

            {activeTab === 'user_analytics' && (
              <motion.div
                key="user_analytics"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-8 space-y-5">
                    <ActiveUsersGrowthChart />
                    <PlatformActivityChart />
                  </div>
                  <div className="lg:col-span-4 space-y-5">
                    <AnalyticsSidebar />
                  </div>
                </div>
                <InsightCardsSection onNavigateTab={setActiveTab} />
              </motion.div>
            )}

            {activeTab === 'feature_usage' && (
              <motion.div
                key="feature_usage"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-8 space-y-5">
                    <TopFeaturesChart />
                    <PlatformActivityChart />
                  </div>
                  <div className="lg:col-span-4 space-y-5">
                    <AnalyticsSidebar />
                  </div>
                </div>
                <InsightCardsSection onNavigateTab={setActiveTab} />
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <PerformanceDashboard />
              </motion.div>
            )}

            {(activeTab === 'reports' || activeTab === 'custom_reports') && (
              <motion.div
                key="reports"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <ReportsWorkspace />
              </motion.div>
            )}

            {activeTab === 'trends' && (
              <motion.div
                key="trends"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-8 space-y-5">
                    <PlatformActivityChart />
                    <ActiveUsersGrowthChart />
                  </div>
                  <div className="lg:col-span-4 space-y-5">
                    <AnalyticsSidebar />
                  </div>
                </div>
                <PerformanceSection />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. Personalization & Widget Management Slide-over Drawer */}
        <PersonalizationDrawer
          isOpen={isPersonalizationOpen}
          onClose={() => setIsPersonalizationOpen(false)}
        />
      </motion.div>
    </div>
  )
}

export default AnalyticsCenterPage
