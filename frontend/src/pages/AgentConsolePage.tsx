import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { Breadcrumb } from '@/components/agent-console/Breadcrumb'
import { TopActionBar } from '@/components/agent-console/TopActionBar'
import { HeroDashboard } from '@/components/agent-console/HeroDashboard'
import { AgentWorkspaceTabs } from '@/components/agent-console/AgentWorkspaceTabs'
import type { AgentTabId } from '@/components/agent-console/AgentWorkspaceTabs'
import { WorkspaceLayout } from '@/components/agent-console/WorkspaceLayout'
import { TaskAutomationKnowledgeWorkspace } from '@/components/agent-console/TaskAutomationKnowledgeWorkspace'
import { AdministrationWorkspace } from '@/components/agent-console/AdministrationWorkspace'
import { LogsStreamWorkspace } from '@/components/agent-console/LogsStreamWorkspace'
import { PageFooter } from '@/components/agent-console/PageFooter'

export function AgentConsolePage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<AgentTabId>('overview')

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.03,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  const handleNewAgentClick = () => {
    // Action handler placeholder
  }

  const isTAKSection = activeTab === 'tasks' || activeTab === 'automations' || activeTab === 'knowledge'
  const isAdminSection = activeTab === 'logs' || activeTab === 'reports' || activeTab === 'admin'

  const mapAdminTab = (tab: AgentTabId) => {
    if (tab === 'logs') return 'audit'
    if (tab === 'reports') return 'reports'
    if (tab === 'admin') return 'admin'
    return 'audit'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-7 text-left max-w-[1720px] mx-auto font-sans px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-7 pb-16 select-none"
    >
      {/* 1. Breadcrumb Navigation & Top Action Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Breadcrumb currentTabLabel={activeTab} />
        <TopActionBar onNewAgentClick={handleNewAgentClick} />
      </motion.div>

      {/* 2. Hero Dashboard Master Container (Rendered on Overview for high-level telemetry) */}
      {activeTab === 'overview' && (
        <motion.div variants={itemVariants}>
          <HeroDashboard onNewAgentClick={handleNewAgentClick} />
        </motion.div>
      )}

      {/* 3. Workspace Navigation Tabs */}
      <motion.div variants={itemVariants}>
        <AgentWorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>

      {/* 4. Main Workspace Layout or Specialized Section View */}
      <motion.div variants={itemVariants} id={`agent-tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`agent-tab-${activeTab}`}>
        {activeTab === 'logs' ? (
          <LogsStreamWorkspace key="logs-stream" />
        ) : isTAKSection ? (
          <TaskAutomationKnowledgeWorkspace key={`tak-${activeTab}`} initialSection={activeTab as any} />
        ) : activeTab === 'admin' ? (
          <AdministrationWorkspace key="admin-panel" initialTab="admin" />
        ) : (
          <WorkspaceLayout key={`workspace-${activeTab}`} activeTab={activeTab} />
        )}
      </motion.div>

      {/* 5. Page Footer */}
      <motion.div variants={itemVariants}>
        <PageFooter />
      </motion.div>
    </motion.div>
  )
}

export default AgentConsolePage
