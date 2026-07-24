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
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
          <FileText size={14} />
          <span>Professional Summary</span>
        </div>
        <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
          Executive Summary
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Write a compelling 2–4 sentence summary highlighting your core expertise, key achievements, and career focus.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 md:p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Write your brief summary
          </label>
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-purple-300 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/40 transition-colors cursor-pointer"
          >
            <Sparkles size={13} className="animate-pulse" />
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
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 transition-colors leading-relaxed resize-none"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Keep under 300 characters for optimal ATS scanning</span>
            <span className={currentLength > maxLen ? 'text-pink-400 font-bold' : 'text-slate-400'}>
              {currentLength} / {maxLen}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Tip Alert */}
      <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
          <Sparkles size={16} />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">ATS Impact Tip</span>
            <button type="button" className="text-[10px] text-purple-400 hover:underline cursor-pointer">
              Why this tip?
            </button>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Including target role keywords and 2–3 quantified achievements in your summary can boost ATS matching by up to <strong className="text-purple-300 font-bold">30%</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
