import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Sparkles, Check, Copy, RefreshCw, ArrowRight, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AIRewriteSuggestion } from '@/lib/mock-ai-insights'

interface AIRewriteSuggestionsCardProps {
  suggestions?: AIRewriteSuggestion[]
}

const defaultSuggestions: AIRewriteSuggestion[] = [
  {
    id: 'rw1',
    sectionName: 'Professional Summary',
    scoreBoost: 8,
    originalText:
      'Experienced Software Engineer with experience in Python and Machine Learning building AI models and web APIs for various client projects.',
    aiImprovedText:
      'Senior AI & ML Engineer with 5+ years of experience building and scaling production LLM infrastructure, real-time inference APIs (FastAPI, PyTorch), and cloud pipelines. Reduced model latency by 42% while managing $120k GPU compute budgets.',
    rationale: 'Replaced vague statements with quantified metrics, senior keywords, and business impact.',
  },
  {
    id: 'rw2',
    sectionName: 'Work Experience Bullet',
    scoreBoost: 5,
    originalText:
      'Worked on training deep learning models for image classification and deployed them on cloud servers for company application.',
    aiImprovedText:
      'Architected and trained PyTorch ResNet & Transformer models achieving 96.4% precision; containerized and deployed via Docker/AWS EKS, serving 2M+ daily active requests.',
    rationale: 'Added exact frameworks (PyTorch, Docker, EKS), precision metrics (96.4%), and request scale (2M+ daily).',
  },
]

export const AIRewriteSuggestionsCard: React.FC<AIRewriteSuggestionsCardProps> = ({
  suggestions = defaultSuggestions,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const active = suggestions[selectedIdx] || suggestions[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(active.aiImprovedText)
    setCopied(true)
    toast.success('AI Rewrite copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAccept = () => {
    setAccepted(true)

    // Interactive Toast with Undo Action
    toast(
      (t) => (
        <div className="flex items-center justify-between gap-3 text-xs text-slate-100 font-medium">
          <span>AI Rewrite suggestion accepted (+{active.scoreBoost} pts)!</span>
          <button
            onClick={() => {
              setAccepted(false)
              toast.dismiss(t.id)
              toast('Reverted suggestion change.', { icon: '↩️' })
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      ),
      { duration: 4000, icon: '✨' }
    )
  }

  const handleRegenerate = () => {
    toast.loading('Generating alternative AI rewrite...', { duration: 1500 })
  }

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
              AI Rewrite & Optimization Engine
            </h3>
            <p className="text-[11px] text-slate-400">
              Transform weak phrasing into recruiter-optimized impact statements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar">
          {suggestions.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedIdx(idx)
                setAccepted(false)
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {item.sectionName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Diff Content Container */}
      {active && (
        <div className="flex flex-col gap-4 flex-1 justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Text Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-900 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Original Text
                </span>
                <span className="text-[10px] text-slate-500">Before AI</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans line-through decoration-rose-500/50">
                {active.originalText}
              </p>
            </div>

            {/* AI Improved Version Box */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex flex-col gap-2 relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  AI Improved Version
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  +{active.scoreBoost} Score Boost
                </span>
              </div>
              <p className="text-xs text-white leading-relaxed font-medium">
                {active.aiImprovedText}
              </p>
            </div>
          </div>

          {/* AI Rationale Bar */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
            <span className="font-bold text-purple-400 shrink-0">AI Rationale:</span>
            <span className="text-slate-300 leading-snug">{active.rationale}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Regenerate</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleAccept}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md"
              >
                {accepted ? <Check className="w-3.5 h-3.5 text-white" /> : <ArrowRight className="w-3.5 h-3.5" />}
                <span>{accepted ? 'Accepted!' : 'Accept Suggestion'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default AIRewriteSuggestionsCard
