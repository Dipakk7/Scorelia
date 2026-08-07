import React, { useState } from 'react'
import { X, Copy, Check, Mail, Globe, QrCode } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface ShareReportDialogProps {
  isOpen: boolean
  onClose: () => void
  shareUrl?: string
  className?: string
}

export function ShareReportDialog({
  isOpen,
  onClose,
  shareUrl = 'https://scorelia.app/reports/share/cr-98234-ai-ml',
  className,
}: ShareReportDialogProps) {
  const [copied, setCopied] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setEmailSent(true)
    setTimeout(() => {
      setEmailSent(false)
      setEmailInput('')
    }, 3000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <Card
        className={cn(
          'w-full max-w-lg p-5 sm:p-6 bg-[#121426] border border-white/10 rounded-2xl space-y-5 shadow-2xl text-left relative',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="space-y-0.5">
            <h3 id="share-dialog-title" className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
              <Globe className="h-4 w-4 text-purple-400" aria-hidden="true" />
              <span>Share Candidate Career Report</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium m-0">
              Share read-only roadmap summary with recruiters, mentors, or hiring managers
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border-none cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* 1. Copy Public Link */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Public Share Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#0b0c14] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer border-none shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </Button>
          </div>
        </div>

        {/* 2. Direct Email Share */}
        <form onSubmit={handleSendEmail} className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Email Report directly to Recruiter / Mentor
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="recruiter@techcompany.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 bg-[#0b0c14] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={!emailInput}
              className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              <span>{emailSent ? 'Sent!' : 'Send'}</span>
            </Button>
          </div>
          {emailSent && (
            <span className="text-[10px] text-emerald-400 font-medium block pt-0.5">
              Report sent successfully to {emailInput}!
            </span>
          )}
        </form>

        {/* 3. Download QR Code Placeholder */}
        <div className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 text-cyan-400">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Download QR Code Badge</span>
              <span className="text-[10px] text-slate-400 block">Embed on your physical resume or portfolio card</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-[11px] font-semibold py-1 px-3 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
          >
            Get QR
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold py-1.5 px-4 rounded-xl border-white/10 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  )
}
export default ShareReportDialog
