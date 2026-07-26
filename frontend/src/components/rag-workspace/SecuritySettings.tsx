import React from 'react'
import type { SecuritySettingsConfig } from '@/data/ragSettingsMockData'

export interface SecuritySettingsProps {
  config: SecuritySettingsConfig
  onChange: (config: SecuritySettingsConfig) => void
}

export function SecuritySettings({ config, onChange }: SecuritySettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-5">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Security, Access & Visibility</h3>
        <p className="text-xs text-slate-400">Configure role-based access control, API keys, and workspace privacy.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Workspace Access Visibility</label>
          <select
            value={config.visibility}
            onChange={(e) => onChange({ ...config, visibility: e.target.value as any })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-sans"
          >
            <option value="Private">Private (Owner Only)</option>
            <option value="Team Shared">Team Shared (Invited Members)</option>
            <option value="Organization Wide">Organization Wide (All Enterprise Users)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 block">Role Permissions Policy</label>
          <select
            value={config.rolePermissions}
            onChange={(e) => onChange({ ...config, rolePermissions: e.target.value as any })}
            className="w-full bg-[#121320] border border-white/10 text-slate-200 p-2.5 rounded-xl font-sans"
          >
            <option value="Admin Only">Admin Only Can Edit Collections</option>
            <option value="Editor & Admin">Editors & Admins Can Edit Collections</option>
            <option value="All Members">All Members Can Edit Collections</option>
          </select>
        </div>

        <div className="space-y-1 flex items-center justify-between pt-4">
          <span className="font-semibold text-slate-300">Enable REST API Key Access</span>
          <input
            type="checkbox"
            checked={config.apiAccessEnabled}
            onChange={(e) => onChange({ ...config, apiAccessEnabled: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1 flex items-center justify-between pt-4">
          <span className="font-semibold text-slate-300">Audit Logging Enabled</span>
          <input
            type="checkbox"
            checked={config.auditLogsEnabled}
            onChange={(e) => onChange({ ...config, auditLogsEnabled: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings
