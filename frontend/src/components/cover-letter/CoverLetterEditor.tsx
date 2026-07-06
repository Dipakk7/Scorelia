import { useState, useEffect, useRef } from 'react'
import {
  Undo,
  Redo,
  Copy,
  Sparkles,
  Check,
  GitCompare,
  BookOpen,
  AlertCircle,
  Award,
  ShieldCheck,
  Info,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DiffViewer } from '@/components/resume-intelligence/DiffViewer'
import api from '@/api/api'
import type { CoverLetterResponse, CoverLetterOptimizationResponse } from '@/types/cover-letter'
import { cn } from '@/lib/utils'

interface CoverLetterEditorProps {
  coverLetter: CoverLetterResponse
  onUpdateContent: (newContent: string) => void
}

type PanelTab = 'analysis' | 'suggestions' | 'comparison'

export default function CoverLetterEditor({ coverLetter, onUpdateContent }: CoverLetterEditorProps) {
  const [editorContent, setEditorContent] = useState<string>('')
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<PanelTab>('analysis')

  // Undo/Redo history stack
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const isTypingRef = useRef<boolean>(false)
  const debounceTimerRef = useRef<number | null>(null)

  // AI Optimization state
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false)
  const [optimization, setOptimization] = useState<CoverLetterOptimizationResponse | null>(null)
  const [bypassCache, setBypassCache] = useState<boolean>(false)

  // Initialize and synchronize with props
  useEffect(() => {
    if (coverLetter) {
      // Check if there is a local auto-saved draft
      const savedDraft = localStorage.getItem(`cover_letter_draft_${coverLetter.id}`)
      const initialText = savedDraft || coverLetter.generated_content || ''
      setEditorContent(initialText)

      // Initialize history stack
      setHistory([initialText])
      setHistoryIndex(0)

      if (savedDraft && savedDraft !== coverLetter.generated_content) {
        toast.success('Restored draft auto-saved on your device.', { duration: 3000 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverLetter.id])

  // Clean draft upon save/sync or unmount if desired, or keep it.
  const handleContentChange = (val: string) => {
    setEditorContent(val)
    localStorage.setItem(`cover_letter_draft_${coverLetter.id}`, val)

    // Handle Undo/Redo stack with debounce
    isTypingRef.current = true
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = window.setTimeout(() => {
      isTypingRef.current = false
      setHistory((prev) => {
        const pruned = prev.slice(0, historyIndex + 1)
        // Only push if content is actually different from top of stack
        if (pruned[pruned.length - 1] === val) return prev
        const nextStack = [...pruned, val]
        setHistoryIndex(nextStack.length - 1)
        return nextStack
      })
    }, 450)
  }

  // Trigger content save back to parent layout
  const handleSave = () => {
    onUpdateContent(editorContent)
    toast.success('Document changes saved!')
  }

  // Undo / Redo triggers
  const triggerUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1
      setHistoryIndex(prevIdx)
      const text = history[prevIdx]
      setEditorContent(text)
      localStorage.setItem(`cover_letter_draft_${coverLetter.id}`, text)
    }
  }

  const triggerRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      const text = history[nextIdx]
      setEditorContent(text)
      localStorage.setItem(`cover_letter_draft_${coverLetter.id}`, text)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorContent)
      toast.success('Content copied to clipboard!')
    } catch {
      toast.error('Failed to copy text.')
    }
  }

  // AI Optimization API call
  const handleOptimize = async (mode: 'STANDARD' | 'DETAILED') => {
    setIsOptimizing(true)
    const toastId = toast.loading('AI is analyzing and optimizing your cover letter...')

    try {
      const res = await api.post(`/ai/cover-letter/optimize?mode=${mode}`, {
        cover_letter_id: coverLetter.id,
        bypass_cache: bypassCache,
        job_description: coverLetter.job_description || '',
      })

      setOptimization(res.data)
      toast.success('AI Optimization Analysis complete!', { id: toastId })
      setActiveTab('comparison') // Switch to diff view to show original vs optimized
    } catch (err: any) {
      console.error(err)
      const message = err?.response?.data?.message || err?.message || 'Optimization request failed.'
      toast.error(message, { id: toastId })
    } finally {
      setIsOptimizing(false)
    }
  }

  // Accept optimized text
  const handleAcceptOptimization = () => {
    if (optimization) {
      handleContentChange(optimization.optimized_content)
      toast.success('Accepted AI optimized content!')
      // Clear comparison tab
      setOptimization(null)
      setActiveTab('analysis')
    }
  }

  // Text Stats
  const wordCount = editorContent.trim() ? editorContent.trim().split(/\s+/).length : 0
  const charCount = editorContent.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
      {/* Editor Panel */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-100 dark:bg-slate-900/60 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={cn(
                'px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all duration-150',
                !isPreviewMode
                  ? 'bg-white dark:bg-dark-bg text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className={cn(
                'px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all duration-150',
                isPreviewMode
                  ? 'bg-white dark:bg-dark-bg text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Preview
            </button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={triggerUndo}
              disabled={historyIndex <= 0}
              className="h-8 w-8 p-0 cursor-pointer text-slate-500 hover:text-slate-800 disabled:opacity-50"
              title="Undo"
            >
              <Undo size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={triggerRedo}
              disabled={historyIndex >= history.length - 1}
              className="h-8 w-8 p-0 cursor-pointer text-slate-500 hover:text-slate-800 disabled:opacity-50"
              title="Redo"
            >
              <Redo size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 cursor-pointer text-slate-500 hover:text-slate-800"
              title="Copy"
            >
              <Copy size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="h-8 px-3 font-semibold text-xs cursor-pointer text-brand-600 border-brand-500/20 hover:bg-brand-500/5 dark:text-brand-400"
            >
              Save Draft
            </Button>
          </div>
        </div>

        <Card className="flex-1 flex flex-col border-slate-200/85 dark:border-dark-border dark:bg-dark-card overflow-hidden min-h-[480px]">
          <CardContent className="p-0 flex-1 flex flex-col">
            {isPreviewMode ? (
              <div className="flex-1 p-8 overflow-y-auto whitespace-pre-wrap font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50/50 dark:bg-dark-bg">
                {editorContent || (
                  <span className="text-slate-400 italic">No content generated. Start typing or use the Generator.</span>
                )}
              </div>
            ) : (
              <textarea
                value={editorContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Type or generate your cover letter here..."
                className="flex-1 w-full p-6 text-sm font-sans leading-relaxed text-slate-850 dark:text-slate-200 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none min-h-[440px]"
              />
            )}

            {/* Bottom info bar */}
            <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span>
                  Words: <strong className="font-semibold text-slate-700 dark:text-slate-350">{wordCount}</strong>
                </span>
                <span>
                  Characters:{' '}
                  <strong className="font-semibold text-slate-700 dark:text-slate-350">{charCount}</strong>
                </span>
              </div>
              <div>
                Auto-saved to draft
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Side Panel */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-brand-500" />
            <span>AI Optimization Workspace</span>
          </h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-[10px] text-slate-450 dark:text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={bypassCache}
                onChange={(e) => setBypassCache(e.target.checked)}
                className="rounded-sm border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 h-3 w-3"
              />
              <span>Bypass cache</span>
            </label>
          </div>
        </div>

        {/* Optimise trigger buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => handleOptimize('STANDARD')}
            disabled={isOptimizing || !editorContent}
            className="text-xs gap-1.5 h-9 font-semibold"
          >
            {isOptimizing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Sparkles size={13} />
            )}
            <span>Standard Audit</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOptimize('DETAILED')}
            disabled={isOptimizing || !editorContent}
            className="text-xs gap-1.5 h-9 font-semibold text-brand-600 border-brand-500/20 hover:bg-brand-500/5 dark:text-brand-400"
          >
            {isOptimizing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <GitCompare size={13} />
            )}
            <span>Detailed Audit</span>
          </Button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800">
          {(['analysis', 'suggestions', 'comparison'] as PanelTab[]).map((tab) => {
            const isTabDisabled = tab === 'comparison' && !optimization
            return (
              <button
                key={tab}
                disabled={isTabDisabled}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-2 px-4 text-xs font-semibold capitalize border-b-2 transition-all cursor-pointer focus:outline-none -mb-[2px]',
                  activeTab === tab
                    ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700',
                  isTabDisabled && 'opacity-40 cursor-not-allowed hover:text-slate-550'
                )}
              >
                {tab === 'analysis' && 'Metric Analytics'}
                {tab === 'suggestions' && 'Key Suggestions'}
                {tab === 'comparison' && 'Optimized Diff'}
              </button>
            )
          })}
        </div>

        {/* Dynamic content rendering */}
        <div className="flex-1">
          {activeTab === 'analysis' && (
            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card p-5 space-y-5 h-full min-h-[380px]">
              {optimization ? (
                <div className="space-y-4 text-xs">
                  {/* Score */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/40 dark:border-slate-800">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Overall Quality Score
                      </span>
                      <p className="text-slate-500 dark:text-slate-400 leading-normal">
                        Score based on ATS friendliness, tone, grammar, and alignment.
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-brand-500/10 text-brand-500 rounded-full flex flex-col items-center justify-center border border-brand-500/20">
                      <span className="text-lg font-bold font-display">{optimization.quality_score.overall_score}</span>
                      <span className="text-[7px] uppercase font-bold">/100</span>
                    </div>
                  </div>

                  {/* Category Scores Grid */}
                  <div className="space-y-2.5">
                    <span className="block font-bold text-slate-700 dark:text-slate-350 text-[10px] uppercase tracking-wider">
                      Evaluation Breakdown
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(optimization.quality_score.category_scores).map(([key, score]) => (
                        <div
                          key={key}
                          className="p-2.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/80 rounded-lg flex items-center justify-between"
                        >
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keyword analysis */}
                  <div className="space-y-2">
                    <span className="block font-bold text-slate-700 dark:text-slate-350 text-[10px] uppercase tracking-wider">
                      Keyword Densities
                    </span>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-450 block mb-1">Matched Keywords:</span>
                        <div className="flex flex-wrap gap-1">
                          {optimization.keyword_analysis.matched_keywords.length > 0 ? (
                            optimization.keyword_analysis.matched_keywords.map((kw, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-emerald-500/5 text-emerald-600 border-emerald-500/10 text-[9px] py-0 px-1.5"
                              >
                                {kw}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None found</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-450 block mb-1">Recommended / Missing:</span>
                        <div className="flex flex-wrap gap-1">
                          {optimization.keyword_analysis.missing_keywords.length > 0 ? (
                            optimization.keyword_analysis.missing_keywords.map((kw, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-amber-500/5 text-amber-600 border-amber-500/10 text-[9px] py-0 px-1.5"
                              >
                                {kw}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None recommended</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company alignment */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-350 text-[10px] uppercase tracking-wider">
                        Corporate Alignment
                      </span>
                      <span className="text-[10px] font-semibold text-brand-500">
                        Match Confidence: {(optimization.company_alignment.alignment_confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
                      <strong>Culture Fit:</strong> {optimization.company_alignment.culture_fit}
                    </p>
                    <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
                      <strong>Mission Fit:</strong> {optimization.company_alignment.mission_alignment}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Audit Pending</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[240px] leading-normal font-sans">
                    Run standard or detailed AI Audits to inspect readability scores, keyword distributions, and company alignment.
                  </p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'suggestions' && (
            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card p-5 space-y-4 h-full min-h-[380px] overflow-y-auto max-h-[460px]">
              {optimization ? (
                <div className="space-y-4">
                  {/* High Priority */}
                  {optimization.suggestions.high_priority.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                        <AlertCircle size={12} />
                        <span>High Priority</span>
                      </span>
                      <div className="space-y-2">
                        {optimization.suggestions.high_priority.map((sug, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg border border-rose-200/50 bg-rose-500/5 dark:border-rose-950/20 dark:bg-rose-950/5 space-y-1"
                          >
                            <h5 className="font-semibold text-xs text-rose-900 dark:text-rose-350">{sug.suggested_improvement}</h5>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans leading-normal">
                              {sug.reason}
                            </p>
                            <span className="text-[9px] text-rose-600 dark:text-rose-455 font-medium block">
                              Impact: +{sug.estimated_ats_improvement}% ATS Score (Expected: {sug.expected_benefit})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medium Priority */}
                  {optimization.suggestions.medium_priority.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <Info size={12} />
                        <span>Medium Priority</span>
                      </span>
                      <div className="space-y-2">
                        {optimization.suggestions.medium_priority.map((sug, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg border border-amber-200/50 bg-amber-500/5 dark:border-amber-950/20 dark:bg-amber-950/5 space-y-1"
                          >
                            <h5 className="font-semibold text-xs text-amber-900 dark:text-amber-350">{sug.suggested_improvement}</h5>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans leading-normal">
                              {sug.reason}
                            </p>
                            <span className="text-[9px] text-amber-600 dark:text-amber-455 font-medium block">
                              Impact: +{sug.estimated_ats_improvement}% ATS Score (Expected: {sug.expected_benefit})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Low Priority */}
                  {optimization.suggestions.low_priority.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span>Minor Enhancements</span>
                      </span>
                      <div className="space-y-2">
                        {optimization.suggestions.low_priority.map((sug, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-1"
                          >
                            <h5 className="font-semibold text-xs text-slate-850 dark:text-slate-250">{sug.suggested_improvement}</h5>
                            <p className="text-[10px] text-slate-550 dark:text-slate-400 font-sans leading-normal">
                              {sug.reason}
                            </p>
                            <span className="text-[9px] text-brand-600 dark:text-brand-400 font-medium block">
                              Impact: +{sug.estimated_ats_improvement}% ATS Score (Expected: {sug.expected_benefit})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {optimization.suggestions.high_priority.length === 0 &&
                    optimization.suggestions.medium_priority.length === 0 &&
                    optimization.suggestions.low_priority.length === 0 && (
                      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <ShieldCheck size={18} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">Zero Flaws Found!</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] leading-normal font-sans">
                          Awesome job! Your document contains no major suggestions for improvement.
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <BookOpen size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Suggestions Pending</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[240px] leading-normal font-sans">
                    Run an AI audit to receive priority based structural recommendations, spelling edits, and ATS improvements.
                  </p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'comparison' && optimization && (
            <div className="space-y-4 h-full min-h-[380px]">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800 rounded-xl">
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    Quality Optimization
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    AI estimates quality gain of{' '}
                    <strong className="text-slate-700 dark:text-slate-350">
                      +{optimization.version_comparison.estimated_quality_gain}%
                    </strong>
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleAcceptOptimization}
                  className="text-xs gap-1.5 h-8 font-semibold cursor-pointer"
                >
                  <Check size={12} />
                  <span>Accept AI Text</span>
                </Button>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                <DiffViewer
                  originalText={optimization.original_content}
                  newText={optimization.optimized_content}
                  title="Cover Letter Comparison Diff"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
