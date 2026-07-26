import React, { useEffect } from 'react'
import { X, GitCompare, Sparkles, CheckCircle2 } from 'lucide-react'
import { type MockCoverLetterContent, mockCoverLetterVersions } from '@/lib/cover-letter-mock-data'

export interface CompareVersionsModalProps {
  isOpen: boolean
  onClose: () => void
  originalVersion?: MockCoverLetterContent
  activeVersion?: MockCoverLetterContent
}

export const CompareVersionsModal: React.FC<CompareVersionsModalProps> = ({
  isOpen,
  onClose,
  originalVersion = mockCoverLetterVersions[0],
  activeVersion = mockCoverLetterVersions[2],
}) => {
  // Listen for Escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare Cover Letter Versions"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <GitCompare size={20} className="text-purple-400 shrink-0" />
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[var(--heading)] m-0">
                Compare Cover Letter Versions
              </h3>
              <p className="text-xs text-[var(--muted)] font-medium m-0 mt-0.5">
                Side-by-side comparison of initial draft vs AI-enhanced version.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison modal"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={20} />
          </button>
        </div>

        {/* Side by Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 overflow-y-auto max-h-[70vh] text-xs">
          {/* Left Column: Original Draft */}
          <div className="rounded-xl border border-[var(--border)] bg-[#090a10] p-4 sm:p-5 space-y-4 text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                  {originalVersion.versionLabel}
                </span>
              </span>
              <span className="text-[10px] text-slate-400">ATS Score: {originalVersion.atsScore}%</span>
            </div>

            <div className="space-y-3 font-sans leading-relaxed text-slate-300">
              <p className="font-semibold text-slate-100 m-0">{originalVersion.salutation}</p>
              <p className="m-0">{originalVersion.introParagraph}</p>
              <p className="m-0">{originalVersion.bodyParagraph1}</p>
              <p className="m-0">{originalVersion.bodyParagraph2}</p>
              <p className="m-0">{originalVersion.closingParagraph}</p>
            </div>
          </div>

          {/* Right Column: Active / Enhanced Draft */}
          <div className="rounded-xl border border-purple-500/40 bg-[#0c0d16] p-4 sm:p-5 space-y-4 text-slate-200 relative">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-purple-400" />
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activeVersion.versionLabel}
                </span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ATS Score: {activeVersion.atsScore}% (+{activeVersion.atsScore - originalVersion.atsScore}%)
              </span>
            </div>

            <div className="space-y-3 font-sans leading-relaxed text-slate-200">
              <p className="font-semibold text-slate-100 m-0">{activeVersion.salutation}</p>
              <p className="m-0 p-1.5 rounded bg-purple-500/10 border border-purple-500/20">{activeVersion.introParagraph}</p>
              <p className="m-0 p-1.5 rounded bg-purple-500/10 border border-purple-500/20">{activeVersion.bodyParagraph1}</p>
              <p className="m-0 p-1.5 rounded bg-purple-500/10 border border-purple-500/20">{activeVersion.bodyParagraph2}</p>
              <p className="m-0">{activeVersion.closingParagraph}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--surface-hover)]/30">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 rounded-xl cursor-pointer border-none flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 size={16} />
            <span>Keep Active Version</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompareVersionsModal
