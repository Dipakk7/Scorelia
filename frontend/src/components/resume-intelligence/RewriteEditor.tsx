import { useState } from 'react'
import {
  Check,
  X,
  Copy,
  Download,
  RefreshCw,
  ClipboardCheck,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DiffViewer } from './DiffViewer'
import type { ResumeRewriteResponse } from '@/types/resume-intelligence'
import toast from 'react-hot-toast'

interface RewriteEditorProps {
  rewrite: ResumeRewriteResponse
  onAccept: () => void
  onReject: () => void
  onRegenerate?: () => void
  isRejecting?: boolean
  isPending?: boolean
}

// Convert complex parsed resume section data into readable text for diff comparison
function stringifySection(sectionName: string, content: any): string {
  if (!content) return ''
  const section = content[sectionName]
  if (!section) return ''

  const value = section.value !== undefined ? section.value : section

  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return 'No entries specified.'
    
    // Check if it's an array of objects
    if (typeof value[0] === 'object' && value[0] !== null) {
      return value
        .map((item: any) => {
          if (sectionName === 'experience') {
            return `• ${item.title || 'Role'} at ${item.company || 'Company'} (${item.duration || 'N/A'})\n  ${item.description || ''}`
          }
          if (sectionName === 'projects') {
            return `• Project: ${item.name || 'Project'} (${(item.technologies || []).join(', ')})\n  ${item.description || ''}`
          }
          if (sectionName === 'education') {
            return `• ${item.degree || 'Degree'} from ${item.institution || 'Institution'} (${item.year || 'N/A'})\n  ${item.raw_text || ''}`
          }
          return JSON.stringify(item, null, 2)
        })
        .join('\n\n')
    }

    // Array of strings (skills, certifications, links, achievements)
    return value.map((val: string) => `• ${val}`).join('\n')
  }

  if (typeof value === 'object' && value !== null) {
    return value.value || JSON.stringify(value, null, 2)
  }

  return String(value)
}

export function RewriteEditor({
  rewrite,
  onAccept,
  onReject,
  onRegenerate,
  isRejecting = false,
  isPending = false,
}: RewriteEditorProps) {
  const [activeSection, setActiveSection] = useState<'summary' | 'skills' | 'experience' | 'projects'>('summary')
  const [copied, setCopied] = useState(false)

  const sections = [
    { id: 'summary', label: 'Summary / Profile' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
  ] as const

  const originalText = stringifySection(activeSection, rewrite.original_content?.data || rewrite.original_content)
  const rewrittenText = stringifySection(activeSection, rewrite.rewritten_content?.data || rewrite.rewritten_content)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenText)
      setCopied(true)
      toast.success('Rewritten text copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy text.')
    }
  }

  const handleDownloadTxt = () => {
    const rawContent = `=== ${activeSection.toUpperCase()} ORIGINAL ===\n\n${originalText}\n\n=== ${activeSection.toUpperCase()} REWRITTEN ===\n\n${rewrittenText}`
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(rawContent)
    const link = document.createElement('a')
    link.setAttribute('href', dataStr)
    link.setAttribute('download', `resume_rewrite_${activeSection}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Section download initiated.')
  }

  return (
    <div className="space-y-4 text-left font-sans">
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg shadow-lg overflow-hidden">
        {/* Editor Header / Toolbars */}
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Rewrite Draft Evaluation
              </CardTitle>
              <p className="text-[11px] text-slate-550 mt-0.5">
                Mode: <span className="font-bold text-brand-600 dark:text-brand-405">{rewrite.rewrite_mode}</span>
                {rewrite.metadata?.model && ` | Model: ${rewrite.metadata.model}`}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-1 py-1.5 text-xs border-slate-300 dark:border-slate-800 text-slate-655 hover:bg-slate-50 cursor-pointer"
              >
                {copied ? <ClipboardCheck size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy Section'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTxt}
                className="flex items-center gap-1 py-1.5 text-xs border-slate-300 dark:border-slate-800 text-slate-655 hover:bg-slate-50 cursor-pointer"
              >
                <Download size={13} />
                <span>Download TXT</span>
              </Button>
              {onRegenerate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRegenerate}
                  disabled={isPending}
                  className="flex items-center gap-1 py-1.5 text-xs border-slate-300 dark:border-slate-800 text-slate-655 hover:bg-slate-50 cursor-pointer"
                >
                  <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} />
                  <span>Regenerate</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Section Selection Bar */}
        <div className="flex border-b border-slate-100 dark:border-slate-850/60 overflow-x-auto scrollbar-none bg-slate-50/20 dark:bg-slate-900/5 px-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeSection === section.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Diff Viewer Frame */}
        <div className="p-4 bg-slate-50/20 dark:bg-slate-950/5">
          <DiffViewer
            originalText={originalText}
            newText={rewrittenText}
            title={`${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Comparison`}
          />
        </div>

        {/* Bottom confirmation toolbar */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/10">
          <div className="text-[10px] text-slate-500 font-medium">
            Accepting updates the active resume. Rejecting rolls it back.
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              disabled={isRejecting || isPending}
              className="flex items-center gap-1.5 py-1.5 px-4 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 border-rose-200 dark:border-rose-900 cursor-pointer font-bold"
            >
              <X size={14} />
              <span>Reject & Rollback</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onAccept}
              disabled={isPending || isRejecting}
              className="flex items-center gap-1.5 py-1.5 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 border-none cursor-pointer font-bold"
            >
              <Check size={14} />
              <span>Accept Rewrite</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RewriteEditor
