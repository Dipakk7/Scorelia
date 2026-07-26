import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { analyticsHeroMockData } from '@/data/analyticsHeroMockData'
import type { KPIMetricItem } from '@/data/analyticsHeroMockData'
import { useAnalyticsOverview } from '@/services/analytics/analyticsQueries'
import { AnalyticsBreadcrumb } from '@/components/analytics-center/AnalyticsBreadcrumb'
import { AnalyticsHeroDashboard } from '@/components/analytics-center/AnalyticsHeroDashboard'
import { AnalyticsTabs } from '@/components/analytics-center/AnalyticsTabs'
import type { AnalyticsTabId } from '@/components/analytics-center/AnalyticsTabs'
import { AnalyticsWorkspace } from '@/components/analytics-center/AnalyticsWorkspace'
import { ReportsWorkspace } from '@/components/analytics-center/ReportsWorkspace'
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
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.02,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  }

  const mapTabToLabel = (tab: AnalyticsTabId): string => {
    switch (tab) {
      case 'overview':
        return 'Overview'
      case 'user_analytics':
        return 'User Analytics'
      case 'feature_usage':
        return 'Feature Usage'
      case 'performance':
        return 'Performance'
      case 'reports':
        return 'Reports'
      case 'trends':
        return 'Trends'
      case 'custom_reports':
        return 'Custom Reports'
      default:
        return 'Overview'
    }
  }

  const handleRefreshData = () => {
    refetch()
  }

  const handleKPICardClick = (kpi: KPIMetricItem) => {
    setSelectedKPI(kpi)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 text-left max-w-[1680px] mx-auto font-sans p-3 sm:p-5 lg:p-6 pb-16 min-h-screen text-slate-100"
    >
      {/* 1. Breadcrumb Navigation */}
      <motion.div variants={itemVariants}>
        <AnalyticsBreadcrumb currentTabLabel={mapTabToLabel(activeTab)} />
      </motion.div>

      {/* 2. Executive Hero Dashboard (Hero, Toolbar & 6 Interactive KPI Cards) */}
      <motion.div variants={itemVariants}>
        <AnalyticsHeroDashboard
          data={heroData}
          isLoading={isLoading}
          onRefreshData={handleRefreshData}
          onCustomizeDashboard={() => setIsPersonalizationOpen(true)}
          onCardClick={handleKPICardClick}
        />
      </motion.div>

      {/* 3. Navigation Tabs & Filters */}
      <motion.div variants={itemVariants}>
        <AnalyticsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onFilterClick={() => setIsPersonalizationOpen(true)}
        />
      </motion.div>

      {/* 4. Main Content Workspace Layout */}
      <motion.div
        variants={itemVariants}
        id={`analytics-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`analytics-tab-${activeTab}`}
      >
        {activeTab === 'reports' || activeTab === 'custom_reports' ? (
          <ReportsWorkspace />
        ) : (
          <AnalyticsWorkspace onNavigateTab={setActiveTab} />
        )}
      </motion.div>

      {/* 5. Personalization & Widget Management Slide-over Drawer */}
      <PersonalizationDrawer
        isOpen={isPersonalizationOpen}
        onClose={() => setIsPersonalizationOpen(false)}
      />
    </motion.div>
  )
}

export default AnalyticsCenterPage
