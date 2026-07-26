import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, FileText, Code2, FileCode, Sparkles } from 'lucide-react'
import type { ExportFormat, ATSReportPayload } from '@/lib/ats-export'
import { exportATSReportJSON, exportATSReportMarkdown, exportATSReportPDF } from '@/lib/ats-export'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ATSExportDialogModalProps {
  isOpen: boolean
  onClose: () => void
  payload?: ATSReportPayload
}

export const ATSExportDialogModal: React.FC<ATSExportDialogModalProps> = ({
  isOpen,
  onClose,
  payload,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [isExporting, setIsExporting] = useState(false)

  // Listen to keyboard Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleDownload = () => {
    if (!payload) {
      toast.error('No analysis report available to export.')
      return
    }

    setIsExporting(true)

    setTimeout(() => {
      try {
        if (selectedFormat === 'json') {
          exportATSReportJSON(payload)
        } else if (selectedFormat === 'markdown') {
          exportATSReportMarkdown(payload)
        } else {
          exportATSReportPDF(payload)
        }

        toast.success(`ATS Analysis Report exported as ${selectedFormat.toUpperCase()}!`, {
          id: 'ats-export-toast',
        })
      } catch (err) {
        toast.error('Failed to export report.', { id: 'ats-export-toast' })
      } finally {
        setIsExporting(false)
        onClose()
      }
    }, 400)
  }

  if (!isOpen) return null

  const resumeTitle = payload?.resumeTitle ?? 'Software_Engineer_Resume.pdf'
  const overallScore = payload?.overview?.overallScore ?? 92
  const status = payload?.overview?.status ?? 'Excellent'
  const percentile = payload?.overview?.percentile ?? 'Top 10%'
  const verdict = payload?.recruiterFeedback?.verdict ?? 'Strong Candidate'
  const recsCount = (payload?.recommendations ?? []).length

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 id="export-modal-title" className="text-lg font-bold text-white tracking-tight">
                  Export ATS Analysis Report
                </h3>
                <p className="text-xs text-slate-400">
                  Download a comprehensive ATS evaluation report for {resumeTitle}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close export dialog"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Choose Export Format
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'pdf', name: 'PDF Report', icon: FileText, desc: 'Printable HTML/PDF document' },
                { id: 'markdown', name: 'Markdown', icon: FileCode, desc: '.md Markdown table format' },
                { id: 'json', name: 'JSON Export', icon: Code2, desc: 'Raw machine payload' },
              ].map((fmt) => {
                const Icon = fmt.icon
                const isSelected = selectedFormat === fmt.id

                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id as ExportFormat)}
                    className={cn(
                      'flex flex-col items-center text-center p-3 rounded-xl border text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none',
                      isSelected
                        ? 'bg-purple-600/25 border-purple-500/60 text-white font-semibold shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-purple-500/30 hover:bg-slate-900/60'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 mb-1.5', isSelected ? 'text-purple-300' : 'text-slate-500')} />
                    <span>{fmt.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{fmt.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Report Summary Preview Box */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Sparkles className="w-3.5 h-3.5" /> Report Preview Summary
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                {overallScore} / 100 ATS Score
              </span>
            </div>

            <div className="space-y-1 text-slate-400">
              <p>• <strong>Target Resume:</strong> {resumeTitle}</p>
              <p>• <strong>Status:</strong> {status} ({percentile})</p>
              <p>• <strong>Recruiter Impression:</strong> {verdict}</p>
              <p>• <strong>Priority Recommendations:</strong> {recsCount} action items included</p>
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : `Download ${selectedFormat.toUpperCase()} Report`}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
