import React from 'react'
import { FileText, Sparkles } from 'lucide-react'

export interface SummaryData {
  summaryText: string
  maxCharacters?: number
}

interface SummarySectionProps {
  data?: SummaryData
  onChange?: (updated: SummaryData) => void
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  data = {
    summaryText:
      'AI/ML Engineer with hands-on experience in machine learning, deep learning, NLP, and data analysis. Skilled in Python, TensorFlow, PyTorch, and building end-to-end AI solutions. Passionate about creating intelligent systems that solve real-world problems.',
    maxCharacters: 300,
  },
  onChange,
}) => {
  const currentLength = (data.summaryText || '').length
  const maxLen = data.maxCharacters || 300

  const handleTextChange = (val: string) => {
    if (onChange) {
      onChange({ ...data, summaryText: val })
    }
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-border-subtle pb-3 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
          <FileText size={14} />
          <span>Professional Summary</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5 m-0">
          Executive Summary
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-sans">
          Write a compelling 2–4 sentence summary highlighting your core expertise, key achievements, and career focus.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-slate-50 dark:bg-surface-l3 border border-slate-200 dark:border-border-subtle rounded-xl p-4 md:p-5 space-y-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Write your brief summary
          </label>
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/30 hover:bg-purple-100 dark:hover:bg-purple-600/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Sparkles size={13} className="animate-pulse text-purple-600 dark:text-purple-400" />
            <span>Generate with AI</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <textarea
            rows={5}
            value={data.summaryText || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="e.g. Driven Software Engineer with 4+ years of experience delivering robust web applications..."
            aria-label="Professional Summary"
            className="w-full bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-xl p-3.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors leading-relaxed resize-none disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Keep under 300 characters for optimal ATS scanning</span>
            <span className={currentLength > maxLen ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>
              {currentLength} / {maxLen}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Tip Alert */}
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4 flex items-start gap-3 transition-colors">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
          <Sparkles size={16} />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6D28D9] dark:text-purple-200">ATS Impact Tip</span>
            <button type="button" className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80 rounded transition-colors">
              Why this tip?
            </button>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 font-sans leading-relaxed m-0">
            Including target role keywords and 2–3 quantified achievements in your summary can boost ATS matching by up to <strong className="text-purple-800 dark:text-purple-300 font-bold">30%</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
