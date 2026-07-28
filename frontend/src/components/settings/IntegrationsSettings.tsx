import React, { useState } from 'react'
import {
  Layers,
  Globe,
  Cpu,
  MessageSquare,
  CheckCircle2,
  Plus,
  RefreshCw,
  Loader2,
  Key,
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  useIntegrationsQuery,
  useConnectIntegrationMutation,
  useDisconnectIntegrationMutation,
  useSaveOpenAIKeyMutation,
  useSyncIntegrationMutation,
} from '@/hooks/integrations/useIntegrationHooks'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import { cn } from '@/lib/utils'

const LinkedinIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, width = 24, height = 24, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width={width}
      height={height}
      stroke="currentColor"
      strokeWidth={1.75}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('lucide lucide-linkedin', className)}
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
)
LinkedinIcon.displayName = 'LinkedinIcon'

const renderIntegrationIcon = (iconName: string, className = 'w-6 h-6') => {
  switch (iconName) {
    case 'Github': return <Github className={className} />
    case 'Linkedin': return <LinkedinIcon className={className} />
    case 'Globe': return <Globe className={className} />
    case 'Cpu': return <Cpu className={className} />
    case 'MessageSquare': return <MessageSquare className={className} />
    default: return <Layers className={className} />
  }
}

export const IntegrationsSettings: React.FC = () => {
  // Query & Mutations
  const { data: dbIntegrations = [] } = useIntegrationsQuery()
  const connectMutation = useConnectIntegrationMutation()
  const disconnectMutation = useDisconnectIntegrationMutation()
  const saveOpenAIKeyMutation = useSaveOpenAIKeyMutation()
  const syncMutation = useSyncIntegrationMutation()

  // Modal / OpenAI Key state
  const [showOpenAIModal, setShowOpenAIModal] = useState(false)
  const [openAIKey, setOpenAIKey] = useState('')
  const [openAIError, setOpenAIError] = useState('')

  // Merge real DB records with default list layout
  const items = settingsCategoriesMockData.integrations.map((defaultItem) => {
    const dbItem = dbIntegrations.find((r) => r.provider === defaultItem.id)
    if (dbItem) {
      return {
        id: defaultItem.id,
        name: dbItem.name || defaultItem.name,
        description: dbItem.description || defaultItem.description,
        iconName: dbItem.icon_name || defaultItem.iconName,
        isConnected: dbItem.is_connected,
        statusBadge: dbItem.status_badge,
        lastSynced: dbItem.last_synced_at ? 'Synced recently' : defaultItem.lastSynced,
        accountIdentifier: dbItem.account_identifier,
        maskedKey: dbItem.masked_key,
      }
    }
    return defaultItem
  })

  const handleConnect = (providerId: string) => {
    if (providerId === 'openai') {
      setShowOpenAIModal(true)
      return
    }
    connectMutation.mutate({ provider: providerId })
  }

  const handleDisconnect = (providerId: string) => {
    disconnectMutation.mutate(providerId)
  }

  const handleSync = (providerId: string) => {
    syncMutation.mutate(providerId)
  }

  const handleSaveOpenAIKey = async () => {
    setOpenAIError('')
    if (!openAIKey.startsWith('sk-')) {
      setOpenAIError("API key must start with 'sk-'.")
      return
    }
    try {
      await saveOpenAIKeyMutation.mutateAsync(openAIKey)
      setShowOpenAIModal(false)
      setOpenAIKey('')
    } catch (err: any) {
      setOpenAIError(err?.response?.data?.detail || 'Failed to save OpenAI API key.')
    }
  }

  return (
    <SettingsCategoryLayout
      icon={<Layers className="w-5 h-5 text-[var(--primary)]" />}
      title="Integrations & API Bridges"
      subtitle="Connect external services, code repositories, LLM provider keys, and messaging bots."
    >
      {/* OpenAI Key Modal */}
      {showOpenAIModal && (
        <Card variant="elevated" className="p-4 border-[var(--primary)]/40 bg-[var(--primary)]/5 space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[var(--primary)]" />
            <h4 className="text-xs font-bold text-[var(--heading)]">
              Connect OpenAI API Key
            </h4>
          </div>
          <p className="text-[11px] text-[var(--muted)]">
            Keys are encrypted using AES-256 and never returned in plaintext. Only masked keys are displayed.
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="password"
              placeholder="sk-proj-..."
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              className="text-xs h-8 font-mono"
            />
            <Button
              size="sm"
              onClick={handleSaveOpenAIKey}
              disabled={saveOpenAIKeyMutation.isPending || !openAIKey}
              className="text-xs h-8 shrink-0 gap-1"
            >
              {saveOpenAIKeyMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              Save Key
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOpenAIModal(false)}
              className="text-xs h-8 shrink-0"
            >
              Cancel
            </Button>
          </div>
          {openAIError && <p className="text-[11px] text-red-400 font-medium">{openAIError}</p>}
        </Card>
      )}

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            variant="elevated"
            hoverLift
            className="p-5 border-[var(--border)] bg-[var(--surface-elevated)] flex flex-col justify-between space-y-4 text-left font-sans"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)] shrink-0">
                    {renderIntegrationIcon(item.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--heading)]">
                      {item.name}
                    </h3>
                    {(item.accountIdentifier || item.maskedKey) && (
                      <span className="text-[10px] text-[var(--muted)] block font-mono">
                        {item.maskedKey || item.accountIdentifier}
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant={item.isConnected ? 'success' : 'neutral'}
                  className={cn(
                    'text-[10px] shrink-0',
                    item.isConnected
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
                  )}
                >
                  {item.isConnected && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                  {item.statusBadge}
                </Badge>
              </div>

              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border)]/40 flex items-center justify-between">
              {item.isConnected ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSync(item.id)}
                    disabled={syncMutation.isPending}
                    className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className={cn('w-3 h-3', syncMutation.isPending && 'animate-spin')} />
                    <span>Sync Now</span>
                  </button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisconnect(item.id)}
                    disabled={disconnectMutation.isPending}
                    className="text-xs h-7.5"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-[11px] text-[var(--muted)]">
                    Not connected yet
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleConnect(item.id)}
                    disabled={connectMutation.isPending}
                    className="text-xs h-7.5 gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Connect Account
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </SettingsCategoryLayout>
  )
}

export default IntegrationsSettings
