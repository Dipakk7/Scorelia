import React from 'react'
import type { NotificationSettingsConfig } from '@/data/ragSettingsMockData'

export interface NotificationSettingsProps {
  config: NotificationSettingsConfig
  onChange: (config: NotificationSettingsConfig) => void
}

export function NotificationSettings({ config, onChange }: NotificationSettingsProps) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-5 select-none">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="text-sm font-bold text-[var(--heading)] uppercase tracking-wider">Alerts & Notification Preferences</h3>
        <p className="text-xs text-[var(--muted)]">Choose when and how you receive alerts for RAG indexing operations.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
          <div>
            <span className="font-bold text-[var(--heading)] block">Processing Complete Notifications</span>
            <span className="text-[11px] text-[var(--muted)]">Receive alert when large document batch finishes indexing.</span>
          </div>
          <input
            type="checkbox"
            checked={config.onProcessingComplete}
            onChange={(e) => onChange({ ...config, onProcessingComplete: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
          <div>
            <span className="font-bold text-[var(--heading)] block">Index Failure Alerts</span>
            <span className="text-[11px] text-[var(--muted)]">High priority alert when vector embedding generation fails.</span>
          </div>
          <input
            type="checkbox"
            checked={config.onIndexFailure}
            onChange={(e) => onChange({ ...config, onIndexFailure: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
          <div>
            <span className="font-bold text-[var(--heading)] block">Diagnostics Warning Digest</span>
            <span className="text-[11px] text-[var(--muted)]">Weekly report on missing embeddings or duplicate chunk warnings.</span>
          </div>
          <input
            type="checkbox"
            checked={config.onDiagnosticsWarning}
            onChange={(e) => onChange({ ...config, onDiagnosticsWarning: e.target.checked })}
            className="w-4 h-4 accent-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings

