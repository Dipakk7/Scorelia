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
import { cn } from '@/lib/utils'

interface LocalExportDialogProps {
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
}: LocalExportDialogProps) {
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
      <DialogContent className="sm:max-w-md text-left font-sans text-xs">
        <DialogHeader className="pb-4 border-b border-border/60 text-left">
          <DialogTitle className="text-base font-black font-display text-foreground flex items-center gap-2 m-0 leading-none">
            <Download className="text-brand-500 h-5 w-5 animate-bounce" />
            <span>Export Answer Segment</span>
          </DialogTitle>
          <DialogDescription className="text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed font-sans m-0 mt-1.5 font-medium">
            Save the AI advisor response local to your machine.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 text-xs text-left">
          {/* File Name input */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="filename-input" className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block font-display leading-none">
              File Name
            </label>
            <input
              id="filename-input"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full text-xs py-2.5 px-3 border border-border rounded-xl bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-405 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans font-medium transition-colors shadow-2xs h-10"
            />
          </div>

          {/* Format selection */}
          <div className="space-y-2 text-left">
            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block font-display leading-none">
              Select Format
            </label>
            <div className="grid grid-cols-2 gap-3 text-left">
              <button
                type="button"
                onClick={() => setFormat('md')}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs hover:shadow-sm border-slate-205 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750 bg-transparent',
                  format === 'md'
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : ''
                )}
              >
                <FileCode size={20} className="text-brand-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-extrabold text-foreground block text-xs leading-none">Markdown</span>
                  <span className="text-[9px] text-muted-foreground block mt-1 leading-none font-bold">Styled document (.md)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs hover:shadow-sm border-slate-205 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750 bg-transparent',
                  format === 'txt'
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : ''
                )}
              >
                <FileText size={20} className="text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-extrabold text-foreground block text-xs leading-none">Plain Text</span>
                  <span className="text-[9px] text-muted-foreground block mt-1 leading-none font-bold">Raw text file (.txt)</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-slate-100 dark:border-slate-850 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9.5 text-xs font-bold cursor-pointer rounded-xl border border-slate-200 dark:border-slate-850 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all bg-transparent"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-xs h-9.5"
          >
            Export Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default ExportDialog
