import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { HeroDashboard } from '@/components/rag-workspace/HeroDashboard'
import { WorkspaceTabs } from '@/components/rag-workspace/WorkspaceTabs'
import type { RAGTabId } from '@/components/rag-workspace/WorkspaceTabs'
import { WorkspaceLayout } from '@/components/rag-workspace/WorkspaceLayout'
export function RAGWorkspacePage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<RAGTabId>('collections')

  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getSectionVariants(shouldReduceMotion)

  const handleAddNewCollection = () => {
    setActiveTab('collections')
  }

  const handleOpenKnowledgeGraph = () => {
    setActiveTab('knowledge-graph')
  }

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 text-slate-100 selection:bg-purple-500/30 font-sans max-w-[1920px] mx-auto text-left">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-4 sm:space-y-5"
      >
        {/* 1. Dynamic Page Header & Actions */}
        <motion.div variants={itemVariants}>
          <HeroDashboard
            onAddNewCollection={handleAddNewCollection}
            onOpenKnowledgeGraph={handleOpenKnowledgeGraph}
            showKpiGrid={false}
          />
        </motion.div>

        {/* 2. Workspace Navigation Tabs */}
        <motion.div variants={itemVariants}>
          <WorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* 3. Main Specialized Workspace Layout */}
        <motion.div variants={itemVariants} id={`workspace-tabpanel-${activeTab}`}>
          <WorkspaceLayout activeTab={activeTab} />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RAGWorkspacePage


