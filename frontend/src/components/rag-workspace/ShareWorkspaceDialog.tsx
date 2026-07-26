import React, { useState } from 'react'
import { Share2, Copy, Check, Lock, Shield, Eye, Edit3, X } from 'lucide-react'
import type { ShareLinkConfig } from '@/data/ragReportsMockData'
import { cn } from '@/lib/utils'

export interface ShareWorkspaceDialogProps {
  isOpen: boolean
  onClose: () => void
  onGenerateLink?: (permission: 'Read-Only' | 'Editable', expiresInDays: number) => Promise<ShareLinkConfig>
  className?: string
}

export function ShareWorkspaceDialog({
  isOpen,
  onClose,
  onGenerateLink,
  className
}: ShareWorkspaceDialogProps) {
  const [permission, setPermission] = useState<'Read-Only' | 'Editable'>('Read-Only')
  const [expiresInDays, setExpiresInDays] = useState<number>(7)
  const [passwordProtected, setPasswordProtected] = useState<boolean>(true)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleGenerate = async () => {
    setIsGenerating(true)
    if (onGenerateLink) {
      const config = await onGenerateLink(permission, expiresInDays)
      setGeneratedLink(config.linkUrl)
    } else {
      setGeneratedLink(`https://scorelia.app/workspace/rag/share?token=xyz8921a`)
    }
    setIsGenerating(false)
  }

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={cn(
          'w-full max-w-md p-6 rounded-2xl bg-[#0e0f1a] border border-purple-500/30 shadow-2xl text-left space-y-4 relative',
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Share2 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">
              Share RAG Workspace
            </h3>
            <p className="text-xs text-slate-400">
              Generate secure access links for team members.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Permission Toggle */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Access Permission
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPermission('Read-Only')}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2',
                  permission === 'Read-Only'
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-[#121320] border-white/5 text-slate-400'
                )}
              >
                <Eye size={14} />
                <span>Read-Only</span>
              </button>

              <button
                type="button"
                onClick={() => setPermission('Editable')}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2',
                  permission === 'Editable'
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-[#121320] border-white/5 text-slate-400'
                )}
              >
                <Edit3 size={14} />
                <span>Editable</span>
              </button>
            </div>
          </div>

          {/* Expiration Select */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Link Expiration
            </label>
            <select
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              className="w-full bg-[#121320] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none cursor-pointer font-mono"
            >
              <option value={1}>1 Day (24 Hours)</option>
              <option value={7}>7 Days (1 Week)</option>
              <option value={30}>30 Days (1 Month)</option>
              <option value={0}>Never Expire</option>
            </select>
          </div>

          {/* Password Protection Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#121320] border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <Lock size={14} className="text-purple-400" />
              <span>Require Access Password</span>
            </div>
            <input
              type="checkbox"
              checked={passwordProtected}
              onChange={(e) => setPasswordProtected(e.target.checked)}
              className="rounded accent-purple-600 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Generated Link Box */}
          {generatedLink && (
            <div className="p-3 rounded-xl bg-[#07080e] border border-purple-500/30 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Active Secure Link
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 bg-transparent text-xs text-slate-200 font-mono focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/40 cursor-pointer min-h-[44px]"
            >
              {isGenerating ? 'Generating Link...' : 'Generate Share Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareWorkspaceDialog
