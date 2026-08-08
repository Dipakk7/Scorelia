import React, { useState } from 'react'
import { ShieldCheck, Download, HardDrive, FileText, RefreshCw, Loader2, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react'
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

  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const telemetryEnabled = settings?.telemetry_enabled ?? true
  const retentionPolicy = settings?.retention_policy ?? privacy.retentionPeriod.split(' ')[0]

  const handleTelemetryChange = (checked: boolean) => {
    updatePrivacyMutation.mutate({ telemetry_enabled: checked })
  }

  const handleRetentionChange = (val: string) => {
    updatePrivacyMutation.mutate({ retention_policy: val })
  }

  const handleGenerateArchive = () => {
    setIsExporting(true)
    setExportComplete(false)
    setTimeout(() => {
      setIsExporting(false)
      setExportComplete(true)
      setTimeout(() => setExportComplete(false), 4000)
    }, 1200)
  }

  return (
    <SettingsCategoryLayout
      icon={<ShieldCheck className="w-5 h-5 text-purple-400" />}
      title="Data & Privacy Governance"
      subtitle="Manage data exports, privacy compliance, telemetry consent, and retention rules."
      badge="GDPR & CCPA Compliant"
      badgeVariant="success"
    >
      {/* 1. Export Data Archive */}
      <SettingsCategorySection
        title="Export Account Data Archive"
        description="Download a full machine-readable JSON archive of all your resumes, ATS analyses, and chat history."
        icon={<Download className="w-4 h-4 text-purple-400" />}
        action={
          <Button
            size="sm"
            onClick={handleGenerateArchive}
            disabled={isExporting}
            className="text-xs h-8.5 gap-1.5 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Packaging ZIP Archive...
              </>
            ) : exportComplete ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Archive Ready ({privacy.exportDataSize})
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Generate Data Archive ({privacy.exportDataSize})
              </>
            )}
          </Button>
        }
      >
        <div className="p-4 rounded-xl bg-[#0d0f1e]/80 border border-white/10 space-y-1.5 text-xs text-slate-400 font-medium font-sans">
          <p className="font-bold text-white flex items-center gap-1.5">
            🔒 GDPR & CCPA Data Portability Right
          </p>
          <p className="leading-relaxed">
            Your export archive contains all uploaded PDF resumes, AI career roadmap nodes, agent transcript logs, and preference records in encrypted JSON format.
          </p>
        </div>
      </SettingsCategorySection>

      {/* 2. Privacy & Telemetry Consent */}
      <SettingsCategorySection
        title="Consent & Telemetry Management"
        description="Control how your usage data is processed for platform quality improvement."
        icon={<HardDrive className="w-4 h-4 text-purple-400" />}
      >
        <div className="space-y-1.5 w-full">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
        <SettingsCategorySection
          title="Data Retention Policy"
          description="Automatic deletion window for inactive workspaces."
          icon={<FileText className="w-4 h-4 text-purple-400" />}
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
          icon={<RefreshCw className="w-4 h-4 text-purple-400" />}
          action={
            <Button size="sm" variant="outline" className="text-xs h-8 font-medium">
              Download Audit CSV
            </Button>
          }
        >
          <p className="text-xs text-slate-400 font-medium pt-1 font-sans leading-relaxed">
            All administrative actions, login sessions, and permission changes are timestamped in an append-only audit trail.
          </p>
        </SettingsCategorySection>
      </div>

      {/* 4. Destructive Data Purge Section */}
      <SettingsCategorySection
        title="Account Data & Workspace Purge"
        description="Permanently delete all stored resumes, subagent transcripts, and workspace records."
        icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
        action={
          <Button size="sm" variant="danger" className="text-xs h-8.5 gap-1.5 font-semibold">
            <Trash2 className="w-3.5 h-3.5" />
            Request Account Data Purge
          </Button>
        }
      >
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-medium font-sans leading-relaxed">
          <p className="font-bold text-red-400 flex items-center gap-1.5 mb-1">
            ⚠️ Irreversible Action
          </p>
          Initiating a data purge permanently removes all encrypted cloud backups. This process takes up to 48 hours to propagate across distributed replicas.
        </div>
      </SettingsCategorySection>
    </SettingsCategoryLayout>
  )
}

export default DataPrivacySettings
