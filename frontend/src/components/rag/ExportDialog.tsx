import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Download, FileText, FileCode } from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  content: string
  query: string
}

export function ExportDialog({
  isOpen,
  onClose,
  content,
  query
}: ExportDialogProps) {
  const [fileName, setFileName] = useState('career-advisor-answer')
  const [format, setFormat] = useState<'md' | 'txt'>('md')

  const handleExport = () => {
    if (!content) return

    const cleanFileName = fileName.trim().replace(/[^a-zA-Z0-9-_]/g, '_') || 'career_answer'
    const fullFileName = `${cleanFileName}.${format}`

    let blobContent = ''
    let mimeType = ''

    if (format === 'md') {
      blobContent = `# Scorelia Advisor Answer\n\n**Query:** _${query}_\n\n---\n\n${content}`
      mimeType = 'text/markdown;charset=utf-8;'
    } else {
      blobContent = `Scorelia Advisor Answer\n\nQuery: ${query}\n\n========================================\n\n${content}`
      mimeType = 'text/plain;charset=utf-8;'
    }

    try {
      const blob = new Blob([blobContent], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fullFileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`Successfully exported to ${fullFileName}!`)
      onClose()
    } catch (e) {
      console.error('Export failed', e)
      toast.error('Failed to export file.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader>
          <DialogTitle className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="text-brand-500 h-5 w-5" />
            <span>Export Answer Segment</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Save the AI advisor response local to your machine.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 text-xs">
          {/* File Name input */}
          <div className="space-y-1">
            <label htmlFor="filename-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
              File Name
            </label>
            <input
              id="filename-input"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
            />
          </div>

          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
              Select Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('md')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  format === 'md'
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <FileCode size={20} className="text-brand-500" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Markdown</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Styled document (.md)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  format === 'txt'
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <FileText size={20} className="text-slate-500" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Plain Text</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Raw text file (.txt)</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-slate-200 dark:border-slate-800"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            className="text-xs bg-brand-600 hover:bg-brand-700 font-bold"
          >
            Export Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default ExportDialog
