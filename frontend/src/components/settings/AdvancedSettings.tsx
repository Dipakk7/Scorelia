import React from 'react'
import { Sliders, Cpu, Terminal, Trash2, RotateCcw, AlertTriangle, Sparkles, Clock } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { PreferenceToggle } from './PreferenceToggle'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
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

  const defaultAIProvider = pData?.default_ai_provider || 'openai'
  const preferredLLM = pData?.preferred_llm || 'gpt-4o'
  const aiTemperature = pData?.ai_temperature ?? 0.7
  const autoSaveInterval = pData?.auto_save_interval ?? 30
  const sessionTimeout = pData?.session_timeout ?? 60

  return (
    <SettingsCategoryLayout
      icon={<Sliders className="w-5 h-5 text-[var(--primary)]" />}
      title="Advanced System Configuration"
      subtitle="Developer tools, AI model preferences, temperature sampling, and productivity timing."
      badge="Developer Mode"
      badgeVariant="warning"
    >
      {/* 1. AI Model & Engine Preferences */}
      <SettingsCategorySection
        title="AI Engine & Model Configuration"
        description="Select default LLM providers, model architectures, and sampling temperature."
        icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-[var(--muted)]">AI Sampling Temperature</label>
              <span className="font-mono font-bold text-[var(--primary)]">{aiTemperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={aiTemperature}
              onChange={(e) => updateAIMutation.mutate({ ai_temperature: parseFloat(e.target.value) })}
              disabled={updateAIMutation.isPending}
              className="w-full accent-[var(--primary)] h-1.5 bg-[var(--border)] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[var(--muted)] font-mono">
              <span>0.0 (Exact)</span>
              <span>1.0 (Balanced)</span>
              <span>2.0 (Creative)</span>
            </div>
          </div>
        </div>
      </SettingsCategorySection>

      {/* 2. Productivity & Timing */}
      <SettingsCategorySection
        title="Productivity & Auto-Save Timing"
        description="Configure background auto-save frequency and inactivity session logout timeout."
        icon={<Clock className="w-4 h-4 text-emerald-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* 3. Cache & Workspace Reset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingsCategorySection
          title="Local Cache & Storage"
          description="Currently utilizing 124.8 MB in local IndexedDB & memory."
          icon={<RotateCcw className="w-4 h-4" />}
          action={
            <Button size="sm" variant="outline" className="text-xs h-8">
              Clear Cache (124.8 MB)
            </Button>
          }
        >
          <p className="text-xs text-[var(--muted)] pt-1">
            Clearing local storage removes offline cached resumes and temporary subagent drafts without losing cloud data.
          </p>
        </SettingsCategorySection>

        <SettingsCategorySection
          title="Reset Workspace Settings"
          description="Restore all application preferences back to initial production defaults."
          icon={<AlertTriangle className="w-4 h-4 text-[var(--danger)]" />}
          action={
            <Button
              size="sm"
              variant="danger"
              onClick={() => resetPersonalizationMutation.mutate()}
              disabled={resetPersonalizationMutation.isPending}
              className="text-xs h-8 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset All Preferences
            </Button>
          }
        >
          <p className="text-xs text-[var(--danger)]/90 pt-1 font-medium">
            ⚠️ Warning: Resetting workspace will restore default values across all 8 settings categories.
          </p>
        </SettingsCategorySection>
      </div>
    </SettingsCategoryLayout>
  )
}

export default AdvancedSettings
