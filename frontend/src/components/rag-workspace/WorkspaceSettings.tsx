import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { Settings, Save, RotateCcw, Check } from 'lucide-react'
import { DEFAULT_RAG_SETTINGS } from '@/data/ragSettingsMockData'
import type { RAGSettingsData } from '@/data/ragSettingsMockData'
import { useRAGSettings } from '@/hooks/useRAGSettings'
import { SettingsNavigation } from './SettingsNavigation'
import type { SettingsTabId } from './SettingsNavigation'
import { RetrievalSettings } from './RetrievalSettings'
import { EmbeddingSettings } from './EmbeddingSettings'
import { ChunkingSettings } from './ChunkingSettings'
import { IndexSettings } from './IndexSettings'
import { SecuritySettings } from './SecuritySettings'
import { NotificationSettings } from './NotificationSettings'
import { WorkspacePreferences } from './WorkspacePreferences'
import { cn } from '@/lib/utils'

export interface WorkspaceSettingsProps {
  className?: string
}

export function WorkspaceSettings({ className }: WorkspaceSettingsProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const { settings: fetchedSettings, updateSettings } = useRAGSettings()

  const [activeTab, setActiveTab] = useState<SettingsTabId>('retrieval')
  const [settings, setSettings] = useState<RAGSettingsData>(DEFAULT_RAG_SETTINGS)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings)
    }
  }, [fetchedSettings])

  const handleSave = async () => {
    await updateSettings(settings)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleReset = () => {
    setSettings(DEFAULT_RAG_SETTINGS)
  }

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Workspace Settings Panel"
      className={cn('space-y-6 text-left', className)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
            <Settings className="w-5 h-5 text-purple-400 shrink-0" />
            Workspace Settings
          </h2>
          <p className="text-xs text-slate-400">
            Configure retrieval defaults, neural embedding models, chunking strategies, and security policies.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer min-h-[44px]"
          >
            {isSaved ? <Check size={15} className="text-emerald-300" /> : <Save size={15} />}
            <span>{isSaved ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Settings Tab Navigation */}
      <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Active Tab Panel */}
      {activeTab === 'retrieval' && (
        <RetrievalSettings
          config={settings.retrieval}
          onChange={(retrieval) => setSettings({ ...settings, retrieval })}
        />
      )}

      {activeTab === 'embedding' && (
        <EmbeddingSettings
          config={settings.embedding}
          onChange={(embedding) => setSettings({ ...settings, embedding })}
        />
      )}

      {activeTab === 'chunking' && (
        <ChunkingSettings
          config={settings.chunking}
          onChange={(chunking) => setSettings({ ...settings, chunking })}
        />
      )}

      {activeTab === 'index' && (
        <IndexSettings
          config={settings.index}
          onChange={(index) => setSettings({ ...settings, index })}
        />
      )}

      {activeTab === 'security' && (
        <SecuritySettings
          config={settings.security}
          onChange={(security) => setSettings({ ...settings, security })}
        />
      )}

      {activeTab === 'notifications' && (
        <NotificationSettings
          config={settings.notifications}
          onChange={(notifications) => setSettings({ ...settings, notifications })}
        />
      )}

      {activeTab === 'preferences' && (
        <WorkspacePreferences
          config={settings.preferences}
          onChange={(preferences) => setSettings({ ...settings, preferences })}
        />
      )}
    </motion.div>
  )
}

export default WorkspaceSettings
