import React, { useState } from 'react'
import { Sliders, Cpu, Terminal, Trash2, RotateCcw, AlertTriangle, Sparkles, Clock, Loader2, CheckCircle2 } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { PreferenceToggle } from './PreferenceToggle'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import {
  usePersonalizationQuery,
  useUpdateAIMutation,
  useUpdateProductivityMutation,
  useResetPersonalizationMutation,
} from '@/hooks/personalization/usePersonalizationHooks'

export const AdvancedSettings: React.FC = () => {
  const { data: pData } = usePersonalizationQuery()
  const updateAIMutation = useUpdateAIMutation()
  const updateProdMutation = useUpdateProductivityMutation()
  const resetPersonalizationMutation = useResetPersonalizationMutation()

  const [featureFlags, setFeatureFlags] = useState(settingsCategoriesMockData.advanced.featureFlags)
  const [isClearingCache, setIsClearingCache] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)

  const defaultAIProvider = pData?.default_ai_provider || 'openai'
  const preferredLLM = pData?.preferred_llm || 'gpt-4o'
  const aiTemperature = pData?.ai_temperature ?? 0.7
  const autoSaveInterval = pData?.auto_save_interval ?? 30
  const sessionTimeout = pData?.session_timeout ?? 60

  const handleToggleFlag = (id: string, checked: boolean) => {
    setFeatureFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: checked } : f))
    )
  }

  const handleClearCache = () => {
    setIsClearingCache(true)
    setCacheCleared(false)
    setTimeout(() => {
      setIsClearingCache(false)
      setCacheCleared(true)
      setTimeout(() => setCacheCleared(false), 3000)
    }, 800)
  }

  return (
    <SettingsCategoryLayout
      icon={<Sliders className="w-5 h-5 text-purple-400" />}
      title="Advanced System Configuration"
      subtitle="Developer tools, AI model preferences, temperature sampling, and productivity timing."
      badge="Developer Mode"
      badgeVariant="warning"
    >
      {/* 1. AI Model & Engine Preferences */}
      <SettingsCategorySection
        title="AI Engine & Model Configuration"
        description="Select default LLM providers, model architectures, and sampling temperature."
        icon={<Sparkles className="w-4 h-4 text-purple-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <Select
            label="Default AI Provider"
            value={defaultAIProvider}
            onChange={(e) => updateAIMutation.mutate({ default_ai_provider: e.target.value })}
            disabled={updateAIMutation.isPending}
          >
            <option value="openai">OpenAI (GPT Models)</option>
            <option value="anthropic">Anthropic (Claude Models)</option>
            <option value="google_gemini">Google (Gemini Models)</option>
            <option value="local_ollama">Local Ollama (Offline)</option>
          </Select>

          <Select
            label="Preferred LLM Model"
            value={preferredLLM}
            onChange={(e) => updateAIMutation.mutate({ preferred_llm: e.target.value })}
            disabled={updateAIMutation.isPending}
          >
            <option value="gpt-4o">GPT-4o (High Intelligence)</option>
            <option value="gpt-4o-mini">GPT-4o Mini (Fast Speed)</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="llama-3-70b">Llama 3 70B</option>
          </Select>

          <div className="space-y-1.5 text-left font-sans">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-slate-300">AI Sampling Temperature</label>
              <span className="font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">{aiTemperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={aiTemperature}
              onChange={(e) => updateAIMutation.mutate({ ai_temperature: parseFloat(e.target.value) })}
              disabled={updateAIMutation.isPending}
              className="w-full accent-purple-500 h-2 bg-slate-900 border border-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0 (Exact)</span>
              <span>1.0 (Balanced)</span>
              <span>2.0 (Creative)</span>
            </div>
          </div>
        </div>
      </SettingsCategorySection>

      {/* 2. Experimental Feature Flags & Developer Mode */}
      <SettingsCategorySection
        title="Experimental Feature Flags"
        description="Enable preview LLM subagent features and experimental GPU visualizers."
        icon={<Cpu className="w-4 h-4 text-purple-400" />}
      >
        <div className="space-y-1.5 w-full">
          {featureFlags.map((flag) => (
            <PreferenceToggle
              key={flag.id}
              id={flag.id}
              title={flag.title}
              description={flag.description}
              checked={flag.enabled}
              onChange={(chk) => handleToggleFlag(flag.id, chk)}
            />
          ))}
        </div>
      </SettingsCategorySection>

      {/* 3. Productivity & Timing */}
      <SettingsCategorySection
        title="Productivity & Auto-Save Timing"
        description="Configure background auto-save frequency and inactivity session logout timeout."
        icon={<Clock className="w-4 h-4 text-purple-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
          <Select
            label="Background Auto-Save Interval"
            value={String(autoSaveInterval)}
            onChange={(e) => updateProdMutation.mutate({ auto_save_interval: parseInt(e.target.value, 10) })}
            disabled={updateProdMutation.isPending}
          >
            <option value="10">Every 10 seconds</option>
            <option value="30">Every 30 seconds (Default)</option>
            <option value="60">Every 60 seconds</option>
            <option value="120">Every 2 minutes</option>
          </Select>

          <Select
            label="Inactivity Session Timeout"
            value={String(sessionTimeout)}
            onChange={(e) => updateProdMutation.mutate({ session_timeout: parseInt(e.target.value, 10) })}
            disabled={updateProdMutation.isPending}
          >
            <option value="30">30 Minutes</option>
            <option value="60">60 Minutes (1 Hour - Default)</option>
            <option value="120">120 Minutes (2 Hours)</option>
            <option value="240">240 Minutes (4 Hours)</option>
          </Select>
        </div>
      </SettingsCategorySection>

      {/* 4. Cache & Workspace Reset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
        <SettingsCategorySection
          title="Local Cache & Storage"
          description={`Currently utilizing ${settingsCategoriesMockData.advanced.cacheSize} in local storage.`}
          icon={<RotateCcw className="w-4 h-4 text-purple-400" />}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearCache}
              disabled={isClearingCache}
              className="text-xs h-8.5 gap-1.5 font-medium"
            >
              {isClearingCache ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Clearing...
                </>
              ) : cacheCleared ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Cleared!
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Cache ({settingsCategoriesMockData.advanced.cacheSize})
                </>
              )}
            </Button>
          }
        >
          <p className="text-xs text-slate-400 font-medium pt-1 font-sans leading-relaxed">
            Clearing local storage removes offline cached resumes and temporary subagent drafts without losing cloud data.
          </p>
        </SettingsCategorySection>

        <SettingsCategorySection
          title="Reset Workspace Settings"
          description="Restore all application preferences back to initial production defaults."
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
          action={
            <Button
              size="sm"
              variant="danger"
              onClick={() => resetPersonalizationMutation.mutate()}
              disabled={resetPersonalizationMutation.isPending}
              className="text-xs h-8.5 gap-1.5 font-semibold"
            >
              {resetPersonalizationMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset All Preferences
                </>
              )}
            </Button>
          }
        >
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-medium font-sans leading-relaxed">
            <p className="font-bold text-red-400 flex items-center gap-1.5 mb-0.5">
              ⚠️ Workspace Reset Notice
            </p>
            Resetting workspace will restore production default values across all 9 settings categories.
          </div>
        </SettingsCategorySection>
      </div>
    </SettingsCategoryLayout>
  )
}

export default AdvancedSettings
