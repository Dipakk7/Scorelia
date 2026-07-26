import React from 'react'
import type { WorkspacePreferencesConfig } from '@/data/ragSettingsMockData'

export interface WorkspacePreferencesProps {
  config: WorkspacePreferencesConfig
  onChange: (config: WorkspacePreferencesConfig) => void
}

export function WorkspacePreferences({ config, onChange }: WorkspacePreferencesProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-5">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Workspace Interface Preferences</h3>
        <p className="text-xs text-slate-400">Customize layout density, theme variants, default view, and motion.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Theme Variant</label>
          <select
            value={config.theme}
            onChange={(e) => onChange({ ...config, theme: e.target.value as any })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-sans"
          >
            <option value="Midnight Glass">Midnight Glass (Default)</option>
            <option value="Dark Standard">Dark Standard</option>
            <option value="Cyber Purple">Cyber Purple Accent</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Layout Density</label>
          <select
            value={config.density}
            onChange={(e) => onChange({ ...config, density: e.target.value as any })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-sans"
          >
            <option value="Comfortable">Comfortable (Balanced padding)</option>
            <option value="Compact">Compact (High info density)</option>
            <option value="Spacious">Spacious (Relaxed spacing)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Default Tab View on Launch</label>
          <select
            value={config.defaultView}
            onChange={(e) => onChange({ ...config, defaultView: e.target.value as any })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-sans"
          >
            <option value="Collections">Collections Workspace</option>
            <option value="Query Playground">Query Playground</option>
            <option value="Analytics">Retrieval Analytics</option>
          </select>
        </div>

        <div className="space-y-1 flex items-center justify-between pt-4">
          <span className="font-semibold text-slate-300">Enable UI Micro-Animations</span>
          <input
            type="checkbox"
            checked={config.animationsEnabled}
            onChange={(e) => onChange({ ...config, animationsEnabled: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default WorkspacePreferences
