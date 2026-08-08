import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { AgentHeroHeader } from '@/components/agent-console/AgentHeroHeader'
import { TopActionBar } from '@/components/agent-console/TopActionBar'
import { HeroDashboard } from '@/components/agent-console/HeroDashboard'
import { AgentWorkspaceTabs } from '@/components/agent-console/AgentWorkspaceTabs'
import type { AgentTabId } from '@/components/agent-console/AgentWorkspaceTabs'
import { WorkspaceLayout } from '@/components/agent-console/WorkspaceLayout'
import { AgentManagementWorkspace } from '@/components/agent-console/AgentManagementWorkspace'
import { TasksWorkspace } from '@/components/agent-console/TasksWorkspace'
import { AutomationsWorkspace } from '@/components/agent-console/AutomationsWorkspace'
import { KnowledgeWorkspace } from '@/components/agent-console/KnowledgeWorkspace'
import { LogsStreamWorkspace } from '@/components/agent-console/LogsStreamWorkspace'
import { ReportsAnalyticsWorkspace } from '@/components/agent-console/ReportsAnalyticsWorkspace'
import { AdministrationWorkspace } from '@/components/agent-console/AdministrationWorkspace'
import { ConsoleSettingsWorkspace } from '@/components/agent-console/ConsoleSettingsWorkspace'

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

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 text-slate-100 selection:bg-purple-500/30 font-sans max-w-[1920px] mx-auto text-left select-none">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-5 w-full max-w-full"
      >
        {/* 1. Master Page Header Row (Title & Description on Left, Action Controls on Right) */}
        <motion.div variants={itemVariants} className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#14162a] via-[#111324] to-[#0d0f1e] border border-white/10 shadow-2xl shadow-purple-950/20 backdrop-blur-md transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 text-left w-full max-w-full">
          {/* Ambient Glow Effects matching RAG Workspace */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 w-full">
            <AgentHeroHeader />
            <TopActionBar onNewAgentClick={handleNewAgentClick} />
          </div>
        </motion.div>

        {/* 2. Workspace Navigation Tabs (Consistently positioned right under the Header Row) */}
        <motion.div variants={itemVariants} className="w-full max-w-full">
          <AgentWorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* 3. Purpose-Built Main Workspace Layout per Tab */}
        <motion.div variants={itemVariants} id={`agent-tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`agent-tab-${activeTab}`} className="w-full max-w-full">
          {activeTab === 'overview' && <WorkspaceLayout key="workspace-overview" activeTab="overview" />}
          {activeTab === 'agents' && <AgentManagementWorkspace key="workspace-agents" onCreateAgentClick={handleNewAgentClick} />}
          {activeTab === 'tasks' && <TasksWorkspace key="workspace-tasks" />}
          {activeTab === 'automations' && <AutomationsWorkspace key="workspace-automations" />}
          {activeTab === 'knowledge' && <KnowledgeWorkspace key="workspace-knowledge" />}
          {activeTab === 'logs' && <LogsStreamWorkspace key="workspace-logs" />}
          {activeTab === 'reports' && <ReportsAnalyticsWorkspace key="workspace-reports" />}
          {activeTab === 'admin' && <AdministrationWorkspace key="workspace-admin" />}
          {activeTab === 'settings' && <ConsoleSettingsWorkspace key="workspace-settings" />}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AgentConsolePage
