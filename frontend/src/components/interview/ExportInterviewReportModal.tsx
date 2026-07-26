import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Download, 
  X, 
  FileText, 
  FileType, 
  Code, 
  Check, 
  Sparkles,
  Info,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import type { AdaptedInterviewSession } from '@/lib/interview-adapter'
import { 
  exportInterviewReportAsMarkdown,
  exportInterviewReportAsPlainText,
  exportInterviewReportAsJson,
  exportInterviewReportAsPdf,
  exportInterviewReportAsDocx,
  type ExportFormat
} from '@/lib/interview-exporter'

export interface ExportInterviewReportModalProps {
  isOpen: boolean
  onClose: () => void
  session?: AdaptedInterviewSession | null
}

export const ExportInterviewReportModal: React.FC<ExportInterviewReportModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [documentTitle, setDocumentTitle] = useState(
    `Scorelia_Interview_Report_${session?.id ? session.id.slice(0, 8) : 'export'}`
  )
  const [isExporting, setIsExporting] = useState(false)

  const formats = [
    {
      id: 'pdf' as ExportFormat,
      name: 'PDF Document',
      ext: '.pdf',
      icon: FileText,
      description: 'Formatted printable PDF document with visual styling.',
    },
    {
      id: 'docx' as ExportFormat,
      name: 'Microsoft Word',
      ext: '.docx',
      icon: FileType,
      description: 'Editable Word document for offline archiving.',
    },
    {
      id: 'md' as ExportFormat,
      name: 'Markdown',
      ext: '.md',
      icon: Code,
      description: 'Clean Markdown for documentation & developer repos.',
    },
    {
      id: 'txt' as ExportFormat,
      name: 'Plain Text',
      ext: '.txt',
      icon: FileText,
      description: 'Simple unformatted text file.',
    },
    {
      id: 'json' as ExportFormat,
      name: 'JSON Payload',
      ext: '.json',
      icon: Code,
      description: 'Raw structured JSON data for API integrations.',
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      switch (selectedFormat) {
        case 'md':
          exportInterviewReportAsMarkdown(session, documentTitle)
          break
        case 'txt':
          exportInterviewReportAsPlainText(session, documentTitle)
          break
        case 'json':
          exportInterviewReportAsJson(session, documentTitle)
          break
        case 'docx':
          exportInterviewReportAsDocx(session, documentTitle)
          break
        case 'pdf':
        default:
          exportInterviewReportAsPdf(session, documentTitle)
          break
      }

      toast.success(`Interview report exported as ${selectedFormat.toUpperCase()}!`)
      setIsExporting(false)
      onClose()
    } catch (err) {
      toast.error('Failed to export interview report. Please try again.')
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-hover)]/40 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Download className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 id="export-modal-title" className="text-lg font-bold text-[var(--heading)]">
                  Export Interview Report
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Select your preferred document format and download session transcript.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 min-h-[44px] min-w-[44px]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">
            {/* Document Title Input */}
            <div className="space-y-1.5">
              <label htmlFor="export-doc-title" className="text-xs font-semibold text-[var(--heading)]">
                Document File Title
              </label>
              <input
                id="export-doc-title"
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter file name..."
                className="h-10 min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-xs text-[var(--body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            {/* Format Selection List */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--heading)]">
                Select Export Format
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Export Formats">
                {formats.map((fmt) => {
                  const Icon = fmt.icon
                  const isSelected = selectedFormat === fmt.id

                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedFormat(fmt.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/20'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-hover)] text-[var(--muted)]'}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>

                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--heading)]">{fmt.name}</span>
                          <Badge variant="neutral" className="px-1.5 py-0 text-[10px]">{fmt.ext}</Badge>
                        </div>
                        <p className="text-[11px] text-[var(--muted)] leading-tight">{fmt.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Export Notice */}
            <div className="flex items-center gap-2 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3 text-xs text-[var(--muted)]">
              <Info className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
              <span>Includes complete session transcripts, target role metadata, and timestamps.</span>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--surface-hover)]/30 p-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
              className="h-10 min-h-[44px] px-4 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleExport}
              isLoading={isExporting}
              disabled={isExporting}
              className="h-10 min-h-[44px] gap-2 px-6 text-xs font-semibold cursor-pointer shadow-md"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Export {selectedFormat.toUpperCase()}</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ExportInterviewReportModal
