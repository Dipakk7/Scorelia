import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { FileDown, FileText, Code, Settings, Loader2 } from 'lucide-react'
import api from '@/api/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  coverLetterId: string
  companyName: string
  jobTitle: string
  content: string
  optimizationId?: string | null
}

type ExportFormat = 'pdf' | 'docx' | 'md' | 'txt' | 'json'

export default function ExportDialog({
  isOpen,
  onClose,
  coverLetterId,
  companyName,
  jobTitle,
  content,
  optimizationId = null,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [templateName, setTemplateName] = useState<string>('Standard')
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const sanitizedFileName = `${companyName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}_Cover_Letter`

  const handleExport = async () => {
    setIsExporting(true)
    const toastId = toast.loading(`Preparing export in ${selectedFormat.toUpperCase()} format...`)

    try {
      if (selectedFormat === 'json') {
        // Client-side JSON download
        const jsonContent = JSON.stringify(
          {
            company_name: companyName,
            job_title: jobTitle,
            exported_at: new Date().toISOString(),
            cover_letter_content: content,
          },
          null,
          2
        )
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${sanitizedFileName}.json`)
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast.success('JSON downloaded successfully!', { id: toastId })
        onClose()
        return
      }

      // Backend API export
      const formatEndpoint = `/ai/cover-letter/export/${selectedFormat}`
      const payload = {
        cover_letter_id: coverLetterId,
        template_name: templateName,
        optimization_id: optimizationId,
      }

      const res = await api.post(formatEndpoint, payload)
      const exportRecord = res.data

      // Download file blob from /ai/cover-letter/export/{id}
      const downloadRes = await api.get(`/ai/cover-letter/export/${exportRecord.id}`, {
        responseType: 'blob',
      })

      const mimeType = (downloadRes.headers['content-type'] as string) || 'application/octet-stream'
      const fileBlob = new Blob([downloadRes.data], { type: mimeType })
      const downloadUrl = window.URL.createObjectURL(fileBlob)

      const downloadLink = document.createElement('a')
      downloadLink.href = downloadUrl
      downloadLink.setAttribute('download', exportRecord.file_name || `${sanitizedFileName}.${selectedFormat}`)
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.parentNode?.removeChild(downloadLink)
      window.URL.revokeObjectURL(downloadUrl)

      toast.success('Document exported and downloaded successfully!', { id: toastId })
      onClose()
    } catch (err: any) {
      console.error('Export error:', err)
      const message = err?.response?.data?.message || err?.message || 'Failed to export document. Verify backend capabilities.'
      toast.error(message, { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }

  const formats: { id: ExportFormat; label: string; desc: string; icon: React.ComponentType<any> }[] = [
    {
      id: 'pdf',
      label: 'PDF Document',
      desc: 'Highly professional, fixed-layout format ideal for printing or uploading directly to job portals.',
      icon: FileText,
    },
    {
      id: 'docx',
      label: 'Word Document (DOCX)',
      desc: 'Editable document standard compatible with Microsoft Word and Google Docs.',
      icon: FileDown,
    },
    {
      id: 'md',
      label: 'Markdown (MD)',
      desc: 'Plain text formatted with markdown tags, perfect for storing in repos or developer sites.',
      icon: Code,
    },
    {
      id: 'txt',
      label: 'Plain Text (TXT)',
      desc: 'Raw unformatted text file suitable for copy-pasting directly into email bodies or applications.',
      icon: FileText,
    },
    {
      id: 'json',
      label: 'JSON Data',
      desc: 'Structured raw data containing the company metadata and letter body, suitable for integrations.',
      icon: Code,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md dark:bg-slate-900 dark:border-slate-855 rounded-2xl p-6 font-sans">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display font-black text-lg text-foreground m-0">
            Export Cover Letter
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs mt-1 leading-relaxed">
            Choose a format to save your tailored cover letter for {companyName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-left">
          {/* Format selection */}
          <div className="space-y-2.5">
            <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
              Choose File Format
            </span>
            <div className="space-y-2">
              {formats.map((fmt) => {
                const Icon = fmt.icon
                const isSelected = selectedFormat === fmt.id
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all duration-300 bg-card/70 backdrop-blur-md hover:scale-[1.01]',
                      isSelected
                        ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 ring-1 ring-brand-500/10'
                        : 'border-border hover:border-slate-350 dark:hover:border-slate-750 bg-transparent'
                    )}
                  >
                    <div
                      className={cn(
                        'p-2 rounded-lg border shrink-0 transition-all duration-200',
                        isSelected
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'bg-slate-50/50 dark:bg-slate-955/20 border-border/60 text-slate-400 dark:text-slate-500'
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-foreground leading-tight">
                        {fmt.label}
                      </span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed mt-1 font-medium">
                        {fmt.desc}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Template select (only for pdf/docx) */}
          {(selectedFormat === 'pdf' || selectedFormat === 'docx') && (
            <div className="space-y-1.5 pt-1 text-left">
              <label
                htmlFor="export-template"
                className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none"
              >
                <Settings size={12} className="text-slate-400" />
                <span>Visual Template Theme</span>
              </label>
              <select
                id="export-template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full text-xs bg-slate-50/50 dark:bg-slate-900/60 border border-border rounded-xl p-2.5 h-10 text-slate-855 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="Standard">Standard (Modern Minimalist)</option>
                <option value="Classic">Classic (Formal Times)</option>
                <option value="Creative">Creative (Asymmetric Header)</option>
                <option value="Executive">Executive (Centered Navy)</option>
              </select>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-150 dark:border-slate-850/60 pt-4 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
            className="h-10 text-xs font-bold cursor-pointer rounded-xl border-slate-200 dark:border-slate-850 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-xs h-10"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown size={14} />
                <span>Download File</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
