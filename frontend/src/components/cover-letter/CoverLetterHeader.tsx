import React from 'react'
import { Sparkles, Download, ArrowLeft, History } from 'lucide-react'

export interface CoverLetterHeaderProps {
  onGenerateClick?: () => void
  onExportClick?: () => void
}

export const CoverLetterHeader: React.FC<CoverLetterHeaderProps> = ({
  onGenerateClick,
  onExportClick,
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)] text-left">
      <div className="flex items-center gap-3">
        {/* Back Link */}
        <a
          href="/dashboard"
          className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft size={18} />
        </a>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-xl sm:text-2xl text-[var(--heading)] tracking-tight m-0">
              Cover Letter Generator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              AI Engine V3
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] font-medium m-0 mt-0.5">
            Create tailored, high-impact cover letters optimized for ATS scanners and recruiters.
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onGenerateClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:opacity-95 transition-opacity cursor-pointer border-none"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>New AI Cover Letter</span>
        </button>

        <button
          type="button"
          onClick={onExportClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-bold text-[var(--heading)] shadow-sm transition-colors cursor-pointer"
        >
          <Download size={14} />
          <span>Export Document</span>
        </button>
      </div>
    </header>
  )
}

export default CoverLetterHeader
