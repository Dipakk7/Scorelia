import React from 'react'
import { ShieldCheck, Download, HardDrive, FileText, RefreshCw } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { PreferenceToggle } from './PreferenceToggle'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import { useSettingsQuery, useUpdatePrivacyMutation } from '@/hooks/settings/useSettingsHooks'

export const DataPrivacySettings: React.FC = () => {
  const privacy = settingsCategoriesMockData.privacy
  const { data: settings } = useSettingsQuery()
  const updatePrivacyMutation = useUpdatePrivacyMutation()

  const telemetryEnabled = settings?.telemetry_enabled ?? true
  const retentionPolicy = settings?.retention_policy ?? privacy.retentionPeriod.split(' ')[0]

  const handleTelemetryChange = (checked: boolean) => {
    updatePrivacyMutation.mutate({ telemetry_enabled: checked })
  }

  const handleRetentionChange = (val: string) => {
    updatePrivacyMutation.mutate({ retention_policy: val })
  }

  return (
    <SettingsCategoryLayout
      icon={<ShieldCheck className="w-5 h-5 text-[var(--primary)]" />}
      title="Data & Privacy Governance"
      subtitle="Manage data exports, privacy compliance, telemetry consent, and retention rules."
    >
      {/* 1. Export Data Archive */}
      <SettingsCategorySection
        title="Export Account Data Archive"
        description="Download a full machine-readable JSON archive of all your resumes, ATS analyses, and chat history."
        icon={<Download className="w-4 h-4" />}
        action={
          <Button size="sm" variant="secondary" className="text-xs h-8 gap-1.5 font-medium">
            <Download className="w-3.5 h-3.5" />
            Generate Data Archive ({privacy.exportDataSize})
          </Button>
        }
      >
        <div className="p-3.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1 text-xs text-[var(--muted)]">
          <p className="font-semibold text-[var(--heading)]">
            🔒 GDPR & CCPA Data Portability Right
          </p>
          <p>
            Your export archive contains all uploaded PDF resumes, AI career roadmap nodes, agent transcript logs, and preference records in encrypted JSON format.
          </p>
        </div>
      </SettingsCategorySection>

      {/* 2. Privacy & Telemetry Consent */}
      <SettingsCategorySection
        title="Consent & Telemetry Management"
        description="Control how your usage data is processed for platform quality improvement."
        icon={<HardDrive className="w-4 h-4" />}
      >
        <div className="space-y-1">
          <PreferenceToggle
            id="privacy-analytics"
            title="Anonymous Analytics Telemetry"
            description="Share non-identifiable usage statistics to optimize LLM latency."
            checked={telemetryEnabled}
            onChange={handleTelemetryChange}
            disabled={updatePrivacyMutation.isPending}
          />
          <PreferenceToggle
            id="privacy-marketing"
            title="Personalized Recommendations"
            description="Allow Scorelia AI engine to evaluate global career benchmarks."
            checked={privacy.consentMarketing}
            onChange={() => {}}
          />
        </div>
      </SettingsCategorySection>

      {/* 3. Retention & Audit Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingsCategorySection
          title="Data Retention Policy"
          description="Automatic deletion window for inactive workspaces."
          icon={<FileText className="w-4 h-4" />}
        >
          <Select
            label="Workspace Data Retention Window"
            value={retentionPolicy}
            onChange={(e) => handleRetentionChange(e.target.value)}
            disabled={updatePrivacyMutation.isPending}
          >
            <option value="90">90 Days (3 Months)</option>
            <option value="180">180 Days (6 Months)</option>
            <option value="365">365 Days (1 Year - Default)</option>
            <option value="indefinite">Keep Until Deleted Manually</option>
          </Select>
        </SettingsCategorySection>

        <SettingsCategorySection
          title="Audit Activity Logs"
          description={`Recorded ${privacy.activityLogEntries} compliance audit log events.`}
          icon={<RefreshCw className="w-4 h-4" />}
          action={
            <Button size="sm" variant="outline" className="text-xs h-8">
              Download Audit CSV
            </Button>
          }
        >
          <p className="text-xs text-[var(--muted)] pt-1">
            All administrative actions, login sessions, and permission changes are timestamped in an append-only audit trail.
          </p>
        </SettingsCategorySection>
      </div>
    </SettingsCategoryLayout>
  )
}

export default DataPrivacySettings
