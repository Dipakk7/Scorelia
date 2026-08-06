import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Bot,
  History as HistoryIcon,
  Award,
  Sparkles,
  FileText,
  Target,
  CheckCircle2,
  Clock,
  GitCompare,
} from 'lucide-react'
import { CoverLetterScoreCard } from './CoverLetterScoreCard'
import { KeywordsMatchedCard } from './KeywordsMatchedCard'
import { PersonalizationInsightsCard } from './PersonalizationInsightsCard'
import { AIAssistantCard } from './AIAssistantCard'
import { SmartSuggestionsCard } from './SmartSuggestionsCard'
import { VersionHistoryPanel } from './VersionHistoryPanel'
import { GenerationHistoryPanel } from './GenerationHistoryPanel'
import { CoverLetterTemplatesCard } from './CoverLetterTemplatesCard'
import { type CoverLetterTab } from './CoverLetterHeader'
import { type MockCoverLetterContent, type GenerationHistoryLog } from '@/lib/cover-letter-mock-data'

export type SidebarPanelTab = 'analysis' | 'copilot' | 'history'

export interface CoverLetterSidebarProps {
  activeWorkspaceTab?: CoverLetterTab
  activeVersionId?: string
  selectedTemplateId?: string
  onSelectTemplate?: (templateId: string) => void
  onSelectVersion?: (version: MockCoverLetterContent) => void
  onOpenCompareModal?: () => void
  onRestoreGeneration?: (log: GenerationHistoryLog) => void
}

export const CoverLetterSidebar: React.FC<CoverLetterSidebarProps> = ({
  activeWorkspaceTab = 'editor',
  activeVersionId = 'v1',
  selectedTemplateId = 'modern',
  onSelectTemplate,
  onSelectVersion,
  onOpenCompareModal,
  onRestoreGeneration,
}) => {
  // Determine contextual default panel tab based on workspace tab
  const getContextualPanel = (wsTab: CoverLetterTab): SidebarPanelTab => {
    switch (wsTab) {
      case 'setup':
        return 'analysis'
      case 'editor':
        return 'copilot'
      case 'optimization':
        return 'analysis'
      case 'review':
        return 'history'
      default:
        return 'copilot'
    }
  }

  const [activeSidebarPanel, setActiveSidebarPanel] = useState<SidebarPanelTab>(
    getContextualPanel(activeWorkspaceTab)
  )

  // Sync sidebar panel when workspace tab changes
  useEffect(() => {
    setActiveSidebarPanel(getContextualPanel(activeWorkspaceTab))
  }, [activeWorkspaceTab])

  const PANEL_TABS: { id: SidebarPanelTab; label: string; icon: React.ElementType }[] = [
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'history', label: 'History & Presets', icon: HistoryIcon },
  ]

  return (
    <aside
      aria-label="Cover Letter Sidebar Tools"
      className="rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-b from-[#14162a] via-[#111324] to-[#14162a] p-3 sm:p-4 shadow-lg shadow-purple-950/10 space-y-4 text-left w-full min-w-0"
    >
      {/* 3-Panel Tab Switcher Header matching ATS Analysis */}
      <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1 w-full">
        {PANEL_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeSidebarPanel === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSidebarPanel(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs transition-all duration-200 cursor-pointer select-none border-none z-10 ${
                isActive
                  ? 'text-white font-bold bg-purple-600/40 border border-purple-500/50 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-200' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeSidebarPanelIndicator"
                  className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Dynamic Panel Content Switching */}
      <AnimatePresence mode="wait">
        {/* PANEL 1: ANALYSIS & MATCH */}
        {activeSidebarPanel === 'analysis' && (
          <motion.div
            key="panel-analysis"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <CoverLetterScoreCard />
            <KeywordsMatchedCard />
            <PersonalizationInsightsCard />
          </motion.div>
        )}

        {/* PANEL 2: AI COPILOT & ASSISTANT */}
        {activeSidebarPanel === 'copilot' && (
          <motion.div
            key="panel-copilot"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <AIAssistantCard />
            <SmartSuggestionsCard />
          </motion.div>
        )}

        {/* PANEL 3: HISTORY & PRESETS */}
        {activeSidebarPanel === 'history' && (
          <motion.div
            key="panel-history"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <VersionHistoryPanel
              activeVersionId={activeVersionId}
              onSelectVersion={onSelectVersion}
              onOpenCompareModal={onOpenCompareModal}
            />
            <GenerationHistoryPanel onRestoreGeneration={onRestoreGeneration} />
            <CoverLetterTemplatesCard
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={onSelectTemplate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}

export default CoverLetterSidebar
