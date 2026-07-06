import { useState } from 'react'
import { Sparkles, FileText, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface RewriteToolbarProps {
  onRewrite: (payload: { mode: string; jobDescription?: string }) => void
  isPending: boolean
}

const REWRITE_MODES = [
  { value: 'PROFESSIONAL', label: 'Professional', desc: 'Standard business tone, strong verbs' },
  { value: 'TECHNICAL', label: 'Technical', desc: 'Highlight systems, stacks, frameworks' },
  { value: 'EXECUTIVE', label: 'Executive', desc: 'Focus on strategy, leadership, metrics' },
  { value: 'FRESHER', label: 'Fresher / Entry', desc: 'Academic focus, quick achievements' },
  { value: 'INTERNSHIP', label: 'Internship', desc: 'Projects, courses, potential focus' },
  { value: 'CONCISE', label: 'Concise & Short', desc: 'High impact, minimal filler' },
  { value: 'DETAILED', label: 'Detailed & Comprehensive', desc: 'Thorough descriptions and skills' },
]

export function RewriteToolbar({ onRewrite, isPending }: RewriteToolbarProps) {
  const [selectedMode, setSelectedMode] = useState('PROFESSIONAL')
  const [jobDescription, setJobDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRewrite({
      mode: selectedMode,
      jobDescription: jobDescription.trim() || undefined,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-dark-bg shadow-sm text-left font-sans space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
        <span className="p-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
          <Sparkles size={15} />
        </span>
        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">
          AI Resume Rewrite Panel
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mode Selector */}
        <div className="md:col-span-1 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Target Persona / Style
          </label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            disabled={isPending}
            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {REWRITE_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
          <p className="text-[9px] text-slate-500 leading-tight">
            {REWRITE_MODES.find((m) => m.value === selectedMode)?.desc}
          </p>
        </div>

        {/* Job Description Optional Tailoring */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <FileText size={10} />
            <span>Target Job Description (Optional but Recommended)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isPending}
            placeholder="Paste the target job description here to align the resume language with standard requirements..."
            rows={3}
            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-400 leading-normal"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-850/60">
        <Button
          variant="primary"
          size="sm"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 cursor-pointer font-bold"
        >
          {isPending ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Generating Rewrite...</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>Generate AI Rewrite</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default RewriteToolbar
