import React, { useState } from 'react'
import { X, Key, User, CheckCircle2, AlertCircle, Loader2, LogOut, ExternalLink, ShieldCheck } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { cn } from '@/lib/utils'

export interface GitHubConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnectToken: (token: string) => Promise<void>
  onConnectUsername: (username: string) => Promise<void>
  onDisconnect: () => Promise<void>
  isConnected?: boolean
  currentUsername?: string
  avatarUrl?: string
}

export const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectToken,
  onConnectUsername,
  onDisconnect,
  isConnected = false,
  currentUsername,
  avatarUrl,
}) => {
  const [connectMethod, setConnectMethod] = useState<'token' | 'username'>('token')
  const [tokenInput, setTokenInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmitToken = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput.trim()) {
      setErrorMessage('Please enter a valid GitHub Access Token or PAT.')
      return
    }
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onConnectToken(tokenInput.trim())
      setTokenInput('')
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate with GitHub. Please check your token.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usernameInput.trim()) {
      setErrorMessage('Please enter a GitHub username.')
      return
    }
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onConnectUsername(usernameInput.trim())
      setUsernameInput('')
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch public GitHub profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDisconnect = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onDisconnect()
      onClose()
    } catch (err: any) {
      setErrorMessage('Failed to disconnect GitHub account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-connect-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#121426] p-6 text-left shadow-2xl shadow-purple-950/40 text-slate-100 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Github size={24} />
          </div>
          <div>
            <h3 id="github-connect-title" className="text-lg font-bold text-white m-0">
              {isConnected ? 'GitHub Connection' : 'Connect GitHub Account'}
            </h3>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              {isConnected
                ? 'Manage active GitHub authentication and synchronized repositories'
                : 'Authenticate your GitHub account for live intelligence & velocity metrics'}
            </p>
          </div>
        </div>

        {/* Connected State Overview */}
        {isConnected && (
          <div className="mt-5 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={currentUsername} className="w-8 h-8 rounded-full border border-white/20" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                    {currentUsername?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>@{currentUsername}</span>
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono">Live GitHub Connection Active</div>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold font-mono rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Connected
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                <span>Disconnect Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Selection for Authentication Methods */}
        {!isConnected && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setConnectMethod('token'); setErrorMessage(null) }}
                className={cn(
                  'py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer',
                  connectMethod === 'token'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Key size={13} />
                <span>Access Token (PAT)</span>
              </button>
              <button
                type="button"
                onClick={() => { setConnectMethod('username'); setErrorMessage(null) }}
                className={cn(
                  'py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer',
                  connectMethod === 'username'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <User size={13} />
                <span>GitHub Username</span>
              </button>
            </div>

            {/* Token Method Form */}
            {connectMethod === 'token' && (
              <form onSubmit={handleSubmitToken} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="github-token-input" className="block text-xs font-semibold text-white">
                    Personal Access Token (PAT)
                  </label>
                  <input
                    id="github-token-input"
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full text-xs bg-slate-900 border border-slate-700/80 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-600 font-mono"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-purple-400" /> Required scopes: <code className="text-purple-300 font-mono">repo</code>, <code className="text-purple-300 font-mono">read:user</code>
                    </span>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo,read:user"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline flex items-center gap-0.5"
                    >
                      Generate Token <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-700/80 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    <span>Connect Account</span>
                  </button>
                </div>
              </form>
            )}

            {/* Username Method Form */}
            {connectMethod === 'username' && (
              <form onSubmit={handleSubmitUsername} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="github-username-input" className="block text-xs font-semibold text-white">
                    GitHub Username
                  </label>
                  <input
                    id="github-username-input"
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. octocat or Dipakk7"
                    className="w-full text-xs bg-slate-900 border border-slate-700/80 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-600 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 m-0">
                    Connect any public GitHub profile to analyze public repositories, language distribution, and commit history.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-700/80 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    <span>Analyze Account</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GitHubConnectModal
