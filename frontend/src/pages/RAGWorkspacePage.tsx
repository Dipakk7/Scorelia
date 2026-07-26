import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  }

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' }
    }
  }

  const handleAddNewCollection = () => {
    // Phase 2 placeholder action
  }

  const handleOpenKnowledgeGraph = () => {
    // Phase 2 placeholder action
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 text-left max-w-[1600px] mx-auto font-sans pb-8"
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

      {/* 4. Main 3-Column Responsive Workspace Layout */}
      <motion.div variants={itemVariants} id={`workspace-tabpanel-${activeTab}`}>
        <WorkspaceLayout activeTab={activeTab} />
      </motion.div>

      {/* 5. Bottom Statistics & System Metrics Container */}
      <motion.div variants={itemVariants} className="pt-2">
        <BottomMetrics />
      </motion.div>

      {/* 6. Page Footer Placeholder */}
      <motion.div variants={itemVariants}>
        <PageFooter />
      </motion.div>
    </motion.div>
  )
}

export default RAGWorkspacePage
