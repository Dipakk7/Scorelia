import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { Breadcrumb } from '@/components/rag-workspace/Breadcrumb'
import { HeroDashboard } from '@/components/rag-workspace/HeroDashboard'
import { WorkspaceTabs } from '@/components/rag-workspace/WorkspaceTabs'
import type { RAGTabId } from '@/components/rag-workspace/WorkspaceTabs'
import { WorkspaceLayout } from '@/components/rag-workspace/WorkspaceLayout'
import { BottomMetrics } from '@/components/rag-workspace/BottomMetrics'
import { PageFooter } from '@/components/rag-workspace/PageFooter'

export function RAGWorkspacePage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<RAGTabId>('collections')

  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getSectionVariants(shouldReduceMotion)

  const handleAddNewCollection = () => {
    // Phase 2 placeholder action
  }

  const handleOpenKnowledgeGraph = () => {
    // Phase 2 placeholder action
  }

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 text-slate-100 selection:bg-purple-500/30 font-sans max-w-[1920px] mx-auto">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-4 sm:space-y-5 text-left"
      >
        {/* 1. Breadcrumb Navigation */}
        <motion.div variants={itemVariants}>
          <Breadcrumb />
        </motion.div>

        {/* 2. Master Hero Dashboard Section (Header, Actions & KPI Overview Grid) */}
        <motion.div variants={itemVariants}>
          <HeroDashboard
            onAddNewCollection={handleAddNewCollection}
            onOpenKnowledgeGraph={handleOpenKnowledgeGraph}
          />
        </motion.div>

        {/* 3. Workspace Navigation Tabs */}
        <motion.div variants={itemVariants}>
          <WorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* 4. Main Responsive Workspace Layout */}
        <motion.div variants={itemVariants} id={`workspace-tabpanel-${activeTab}`}>
          <WorkspaceLayout activeTab={activeTab} />
        </motion.div>

        {/* 5. Bottom Statistics & System Metrics Container */}
        <motion.div variants={itemVariants} className="pt-1">
          <BottomMetrics />
        </motion.div>

        {/* 6. Page Footer Placeholder */}
        <motion.div variants={itemVariants}>
          <PageFooter />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RAGWorkspacePage

