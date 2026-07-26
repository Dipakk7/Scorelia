import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal,
  X,
  Layout,
  LayoutGrid,
  Bookmark,
  Star,
  Pin,
  RefreshCw,
  Save,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import {
  useAnalyticsPreferences,
  useUpdateAnalyticsPreferences,
  useResetAnalyticsPreferences,
} from '@/features/analytics/preferences/analyticsPreferencesQueries'
import type {
  DashboardPresetItem,
  WidgetItemPreference,
  WidgetSize,
} from '@/features/analytics/preferences/analyticsPreferencesTypes'
import { WidgetManager } from './WidgetManager'
import { DashboardPresetCard } from './DashboardPresetCard'
import { SavedLayoutsPanel } from './SavedLayoutsPanel'
import { FavoriteReportsPanel } from './FavoriteReportsPanel'
import { PinnedInsightsPanel } from './PinnedInsightsPanel'
import { DashboardResetDialog } from './DashboardResetDialog'

interface PersonalizationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const builtInPresets: DashboardPresetItem[] = [
  { id: 'exec_overview', name: 'Executive Overview', description: 'Full executive KPI dashboard with activity charts, performance SLAs, and AI recommendations.', isDefault: true, widgetIds: ['hero_kpis', 'platform_activity', 'active_users', 'top_features', 'performance_overview', 'ai_insights'] },
  { id: 'perf_monitoring', name: 'Performance Monitoring', description: 'Deep-dive engineering telemetry focused on endpoint latency, error rates, and cluster health.', isDefault: false, widgetIds: ['performance_overview', 'hero_kpis'] },
  { id: 'recruitment_analytics', name: 'Recruitment Analytics', description: 'Candidate pipeline funnel, resume parsing throughput, and interview drill statistics.', isDefault: false, widgetIds: ['hero_kpis', 'top_features', 'active_users'] },
  { id: 'ai_intelligence', name: 'AI Intelligence Focus', description: 'AI insights, executive recommendations, and automated event log streams.', isDefault: false, widgetIds: ['ai_insights', 'activity_timeline', 'hero_kpis'] },
  { id: 'reports_focus', name: 'Reports & Export Hub', description: 'Focus on report generation templates, scheduled jobs, and dataset exports.', isDefault: false, widgetIds: ['hero_kpis', 'quick_actions'] },
  { id: 'minimal_dashboard', name: 'Minimal Dashboard', description: 'Streamlined minimal view with core KPIs and essential charts.', isDefault: false, widgetIds: ['hero_kpis', 'platform_activity'] },
]

export function PersonalizationDrawer({ isOpen, onClose }: PersonalizationDrawerProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const { data: userPreferences } = useAnalyticsPreferences()
  const updateMutation = useUpdateAnalyticsPreferences()
  const resetMutation = useResetAnalyticsPreferences()

  const [activeDrawerTab, setActiveDrawerTab] = useState<'presets' | 'widgets' | 'layouts' | 'favorites' | 'insights'>('presets')
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  // Local draft state for drawer edits
  const [localPrefs, setLocalPrefs] = useState(userPreferences)

  const currentPrefs = localPrefs || userPreferences

  const handleToggleVisibility = (id: string, visible: boolean) => {
    if (!currentPrefs) return
    const updated = {
      ...currentPrefs,
      widgets: currentPrefs.widgets.map((w) => (w.id === id ? { ...w, visible } : w)),
    }
    setLocalPrefs(updated)
    updateMutation.mutate(updated)
  }

  const handleTogglePin = (id: string, pinned: boolean) => {
    if (!currentPrefs) return
    const updated = {
      ...currentPrefs,
      widgets: currentPrefs.widgets.map((w) => (w.id === id ? { ...w, pinned } : w)),
    }
    setLocalPrefs(updated)
    updateMutation.mutate(updated)
  }

  const handleChangeSize = (id: string, size: WidgetSize) => {
    if (!currentPrefs) return
    const updated = {
      ...currentPrefs,
      widgets: currentPrefs.widgets.map((w) => (w.id === id ? { ...w, size } : w)),
    }
    setLocalPrefs(updated)
    updateMutation.mutate(updated)
  }

  const handleSelectPreset = (preset: DashboardPresetItem) => {
    if (!currentPrefs) return
    const updatedWidgets = currentPrefs.widgets.map((w) => ({
      ...w,
      visible: preset.widgetIds.includes(w.id),
    }))
    const updated = {
      ...currentPrefs,
      selectedPresetId: preset.id,
      widgets: updatedWidgets,
    }
    setLocalPrefs(updated)
    updateMutation.mutate(updated)
  }

  const handleConfirmReset = () => {
    resetMutation.mutate()
    setLocalPrefs(undefined)
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 right-0 max-w-full flex pl-10"
          >
            <div className="w-screen max-w-md bg-[#0b0c14] border-l border-white/10 shadow-2xl flex flex-col justify-between text-left">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <SlidersHorizontal size={18} className="stroke-[2]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-100 m-0">
                        Customize Dashboard
                      </h2>
                      <p className="text-xs text-slate-400 font-medium m-0">
                        Personalize layouts, presets & widget visibility
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Nav Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveDrawerTab('presets')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeDrawerTab === 'presets'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layout size={13} />
                    <span>Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDrawerTab('widgets')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeDrawerTab === 'widgets'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LayoutGrid size={13} />
                    <span>Widgets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDrawerTab('layouts')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeDrawerTab === 'layouts'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Bookmark size={13} />
                    <span>Saved</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDrawerTab('favorites')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeDrawerTab === 'favorites'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Star size={13} />
                    <span>Favorites</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDrawerTab('insights')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeDrawerTab === 'insights'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Pin size={13} />
                    <span>Pinned</span>
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-5">
                {activeDrawerTab === 'presets' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono block">
                      Built-in Dashboard Presets
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {builtInPresets.map((preset) => (
                        <DashboardPresetCard
                          key={preset.id}
                          preset={preset}
                          isSelected={currentPrefs?.selectedPresetId === preset.id}
                          onSelect={handleSelectPreset}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeDrawerTab === 'widgets' && currentPrefs && (
                  <WidgetManager
                    widgets={currentPrefs.widgets}
                    onToggleVisibility={handleToggleVisibility}
                    onTogglePin={handleTogglePin}
                    onChangeSize={handleChangeSize}
                  />
                )}

                {activeDrawerTab === 'layouts' && <SavedLayoutsPanel />}

                {activeDrawerTab === 'favorites' && (
                  <FavoriteReportsPanel favoriteReportIds={currentPrefs?.favoriteReportIds} />
                )}

                {activeDrawerTab === 'insights' && (
                  <PinnedInsightsPanel pinnedInsightIds={currentPrefs?.pinnedInsightIds} />
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between gap-3 bg-[#0f101c]">
                <button
                  type="button"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-md shadow-purple-900/40 cursor-pointer"
                >
                  <Save size={14} />
                  <span>Done</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <DashboardResetDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </>
  )
}

export default PersonalizationDrawer
