import React, { useState, useEffect } from 'react'
import { X, Download, FileText, CheckCircle2, Sparkles, Loader2, FileCode, FileSpreadsheet } from 'lucide-react'
import type { MockCoverLetterContent } from '@/lib/cover-letter-mock-data'
import type { DocumentStyleSettings } from './DocumentStylePanel'
import {
  exportAsMarkdown,
  exportAsPlainText,
  exportAsJson,
  exportAsPdf,
  exportAsDocx,
  type ExportFormat,
} from '@/lib/cover-letter-exporter'

export interface ExportCoverLetterModalProps {
  isOpen: boolean
  onClose: () => void
  content: MockCoverLetterContent
  styleSettings: DocumentStyleSettings
}

export const ExportCoverLetterModal: React.FC<ExportCoverLetterModalProps> = ({
  isOpen,
  onClose,
  content,
  styleSettings,
}) => {
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [docTitle, setDocTitle] = useState(`${content.applicantName.replace(/\s+/g, '_')}_Cover_Letter`)
  const [isExporting, setIsExporting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

  const formatOptions: { id: ExportFormat; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'pdf', label: 'PDF Document (.pdf)', desc: 'High-res printable layout', icon: <FileText size={16} className="text-purple-400" /> },
    { id: 'docx', label: 'Word Document (.docx)', desc: 'Editable Microsoft Word file', icon: <FileSpreadsheet size={16} className="text-blue-400" /> },
    { id: 'md', label: 'Markdown (.md)', desc: 'GitHub & developer friendly', icon: <FileCode size={16} className="text-emerald-400" /> },
    { id: 'txt', label: 'Plain Text (.txt)', desc: 'Unformatted plain text', icon: <FileText size={16} className="text-amber-400" /> },
    { id: 'json', label: 'JSON Data (.json)', desc: 'Structured JSON data payload', icon: <FileCode size={16} className="text-teal-400" /> },
  ]

  const handleStartExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      if (format === 'pdf') exportAsPdf(content, styleSettings, docTitle)
      else if (format === 'docx') exportAsDocx(content, styleSettings, docTitle)
      else if (format === 'md') exportAsMarkdown(content, styleSettings, docTitle)
      else if (format === 'txt') exportAsPlainText(content, styleSettings, docTitle)
      else if (format === 'json') exportAsJson(content, styleSettings, docTitle)

      setIsExporting(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1500)
    }, 600)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Cover Letter Document"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-left"
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <Download size={20} className="text-purple-400" />
            <div>
              <h3 className="font-display font-extrabold text-base text-[var(--heading)] m-0">
                Export Cover Letter
              </h3>
              <p className="text-xs text-[var(--muted)] font-medium m-0 mt-0.5">
                Download your tailored cover letter in your preferred format.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Document Title Input */}
          <div className="space-y-1.5">
            <label htmlFor="export-doc-title-input" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block">
              Document File Title
            </label>
            <input
              id="export-doc-title-input"
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3.5 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          {/* Format Selection List */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block">
              Select Export Format
            </label>
            <div className="grid grid-cols-1 gap-2">
              {formatOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormat(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    format === opt.id
                      ? 'border-[var(--primary)] bg-[var(--primary)]/15 shadow-sm'
                      : 'border-[var(--border)] bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      {opt.icon}
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-[var(--heading)]">{opt.label}</span>
                      <span className="block text-[11px] text-[var(--muted)] font-medium">{opt.desc}</span>
                    </div>
                  </div>

                  {format === opt.id && <CheckCircle2 size={16} className="text-[var(--primary)]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Live Export Preview Metadata Summary */}
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 flex items-center justify-between text-[11px] text-[var(--muted)]">
            <span>
              {content.wordCount} words • {content.atsScore}% ATS Score
            </span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles size={11} />
              <span>{content.companyName} Role</span>
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--surface-hover)]/30">
          {isSuccess ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 size={16} />
              <span>Export Successful! File Downloaded.</span>
            </div>
          ) : (
            <span className="text-[11px] text-[var(--muted)] font-medium">Ready to download file</span>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold border border-[var(--border)] rounded-xl hover:bg-[var(--surface-hover)] cursor-pointer text-[var(--heading)] bg-transparent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartExport}
              disabled={isExporting}
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl cursor-pointer border-none flex items-center gap-1.5 shadow-md hover:opacity-95 disabled:opacity-75"
            >
              {isExporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportCoverLetterModal
