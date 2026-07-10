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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left font-sans text-xs">
      {/* Editor Panel */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-100/50 dark:bg-slate-900/40 p-1 border border-border/80 rounded-2xl text-[9px] font-black uppercase tracking-wider gap-1">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-[9px] uppercase font-black tracking-wider cursor-pointer border-none bg-transparent transition-all',
                 !isPreviewMode
                  ? 'bg-card text-foreground dark:text-white shadow-2xs font-extrabold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-[9px] uppercase font-black tracking-wider cursor-pointer border-none bg-transparent transition-all',
                isPreviewMode
                  ? 'bg-card text-foreground dark:text-white shadow-2xs font-extrabold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              Preview
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={triggerUndo}
              disabled={historyIndex <= 0}
              className="h-8 w-8 p-0 cursor-pointer text-slate-400 hover:text-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 rounded-lg flex items-center justify-center transition-all bg-transparent border-none disabled:opacity-40 disabled:pointer-events-none"
              title="Undo"
            >
              <Undo size={13} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={triggerRedo}
              disabled={historyIndex >= history.length - 1}
              className="h-8 w-8 p-0 cursor-pointer text-slate-400 hover:text-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 rounded-lg flex items-center justify-center transition-all bg-transparent border-none disabled:opacity-40 disabled:pointer-events-none"
              title="Redo"
            >
              <Redo size={13} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 cursor-pointer text-slate-400 hover:text-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 rounded-lg flex items-center justify-center transition-all bg-transparent border-none"
              title="Copy"
            >
              <Copy size={13} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="h-8 px-3.5 font-bold text-[10px] uppercase tracking-wider cursor-pointer text-brand-600 border-border hover:border-brand-500/30 hover:bg-brand-500/5 rounded-xl transition-all bg-transparent"
            >
              Save Draft
            </Button>
          </div>
        </div>

        <Card className="flex-1 flex flex-col border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden min-h-[480px]">
          <CardContent className="p-0 flex-1 flex flex-col">
            {isPreviewMode ? (
              <div className="flex-1 p-8 overflow-y-auto whitespace-pre-wrap font-sans text-sm text-slate-850 dark:text-slate-250 leading-relaxed bg-slate-50/20 dark:bg-slate-955/10 font-medium">
                {editorContent || (
                  <span className="text-slate-400 dark:text-slate-500 italic">No content generated. Start typing or use the Generator.</span>
                )}
              </div>
            ) : (
              <textarea
                value={editorContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Type or generate your cover letter here..."
                className="flex-1 w-full p-6 text-sm font-sans leading-relaxed text-slate-850 dark:text-slate-200 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none min-h-[440px] font-medium"
              />
            )}

            {/* Bottom info bar */}
            <div className="px-5 py-2.5 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  Words: <strong className="font-extrabold text-slate-700 dark:text-slate-350">{wordCount}</strong>
                </span>
                <span>
                  Characters:{' '}
                  <strong className="font-extrabold text-slate-700 dark:text-slate-350">{charCount}</strong>
                </span>
              </div>
              <div className="font-bold text-slate-400">
                Draft Auto-Saved
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Side Panel */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-xs uppercase tracking-widest text-foreground flex items-center gap-2 m-0">
            <Sparkles size={16} className="text-brand-500 animate-pulse" />
            <span>AI Optimization Workspace</span>
          </h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer select-none font-bold uppercase tracking-wider">
              <input
                type="checkbox"
                checked={bypassCache}
                onChange={(e) => setBypassCache(e.target.checked)}
                className="rounded-sm border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5 bg-transparent cursor-pointer"
              />
              <span>Bypass cache</span>
            </label>
          </div>
        </div>

        {/* Optimise trigger buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="sm"
            onClick={() => handleOptimize('STANDARD')}
            disabled={isOptimizing || !editorContent}
            className="text-[10px] font-bold uppercase tracking-wider gap-1.5 h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs border-none cursor-pointer flex items-center justify-center"
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
            className="text-[10px] font-bold uppercase tracking-wider gap-1.5 h-9 text-brand-600 border-border hover:border-brand-500/30 hover:bg-brand-500/5 rounded-xl transition-all cursor-pointer bg-transparent"
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
        <div className="flex border-b border-border/60 gap-1">
          {(['analysis', 'suggestions', 'comparison'] as PanelTab[]).map((tab) => {
            const isTabDisabled = tab === 'comparison' && !optimization
            return (
              <button
                key={tab}
                disabled={isTabDisabled}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-2 px-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer focus:outline-none -mb-[2px] bg-transparent border-none',
                  activeTab === tab
                    ? 'border-brand-500 text-brand-500 font-extrabold'
                    : 'border-transparent text-muted-foreground hover:text-slate-800 dark:hover:text-slate-350',
                  isTabDisabled && 'opacity-40 cursor-not-allowed hover:text-slate-400'
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
            <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl p-5 space-y-5 h-full min-h-[380px] shadow-sm text-left hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
              {optimization ? (
                <div className="space-y-4 text-xs font-sans">
                  {/* Score */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-850">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
                        Overall Quality Score
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed m-0 font-medium">
                        Score based on ATS friendliness, tone, grammar, and alignment.
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-brand-500/10 text-brand-500 rounded-full flex flex-col items-center justify-center border border-brand-500/30 font-black shadow-2xs font-mono shrink-0">
                      <span className="text-base font-black">{optimization.quality_score.overall_score}</span>
                      <span className="text-[7px] uppercase font-bold tracking-wider leading-none mt-0.5">/100</span>
                    </div>
                  </div>

                  {/* Category Scores Grid */}
                  <div className="space-y-2.5">
                    <span className="block font-black text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider">
                      Evaluation Breakdown
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(optimization.quality_score.category_scores).map(([key, score]) => (
                        <div
                          key={key}
                          className="p-2.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-xl flex items-center justify-between font-bold text-[10px] font-sans"
                        >
                          <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-200">{score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keyword analysis */}
                  <div className="space-y-2.5">
                    <span className="block font-black text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider">
                      Keyword Densities
                    </span>
                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[9px] text-muted-foreground font-extrabold uppercase block mb-1.5">Matched Keywords:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {optimization.keyword_analysis.matched_keywords.length > 0 ? (
                            optimization.keyword_analysis.matched_keywords.map((kw, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-emerald-500/5 text-emerald-600 border-emerald-500/15 text-[9px] font-bold py-0 px-2 rounded-lg"
                              >
                                {kw}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">None found</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground font-extrabold uppercase block mb-1.5">Recommended / Missing:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {optimization.keyword_analysis.missing_keywords.length > 0 ? (
                            optimization.keyword_analysis.missing_keywords.map((kw, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-rose-500/5 text-rose-600 border-rose-500/15 text-[9px] font-bold py-0 px-2 rounded-lg"
                              >
                                {kw}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">None recommended</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company alignment */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider">
                        Corporate Alignment
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                        Match: {(optimization.company_alignment.alignment_confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-655 dark:text-slate-405 font-medium m-0">
                      <strong>Culture Fit:</strong> {optimization.company_alignment.culture_fit}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-655 dark:text-slate-405 font-medium m-0 mt-1">
                      <strong>Mission Fit:</strong> {optimization.company_alignment.mission_alignment}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-foreground m-0">Audit Pending</h4>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 max-w-[240px] leading-relaxed font-sans m-0 font-medium">
                    Run standard or detailed AI Audits to inspect readability scores, keyword distributions, and company alignment.
                  </p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'suggestions' && (
            <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl p-5 space-y-4 h-full min-h-[380px] overflow-y-auto max-h-[460px] shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
              {optimization ? (
                <div className="space-y-4">
                  {/* High Priority */}
                  {optimization.suggestions.high_priority.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1.5">
                        <AlertCircle size={12} className="text-rose-500" />
                        <span>High Priority</span>
                      </span>
                      <div className="space-y-2.5">
                        {optimization.suggestions.high_priority.map((sug, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 space-y-1.5 text-left"
                          >
                            <h5 className="font-bold text-xs text-destructive m-0">{sug.suggested_improvement}</h5>
                            <p className="text-[11px] text-slate-655 dark:text-slate-400 font-sans leading-relaxed m-0 font-medium">
                              {sug.reason}
                            </p>
                            <span className="text-[9px] font-bold text-destructive uppercase tracking-wider block mt-1">
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
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                        <Info size={12} className="text-amber-500" />
                        <span>Medium Priority</span>
                      </span>
                      <div className="space-y-2.5">
                        {optimization.suggestions.medium_priority.map((sug, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl border border-amber-200/50 bg-amber-500/5 dark:border-amber-955/20 dark:bg-amber-955/5 space-y-1.5 text-left"
                          >
                            <h5 className="font-bold text-xs text-amber-700 dark:text-amber-400 m-0">{sug.suggested_improvement}</h5>
                            <p className="text-[11px] text-slate-655 dark:text-slate-400 font-sans leading-relaxed m-0 font-medium">
                              {sug.reason}
                            </p>
                            <span className="text-[9px] font-bold text-amber-605 dark:text-amber-455 uppercase tracking-wider block mt-1">
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
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span>Minor Enhancements</span>
                      </span>
                      <div className="space-y-2.5">
                        {optimization.suggestions.low_priority.map((sug, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/10 space-y-1.5 text-left"
                          >
                            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-250 m-0">{sug.suggested_improvement}</h5>
                            <p className="text-[11px] text-slate-550 dark:text-slate-400 font-sans leading-relaxed m-0 font-medium">
                              {sug.reason}
                            </p>
                            <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block mt-1">
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
                      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <ShieldCheck size={18} />
                        </div>
                        <h4 className="text-xs font-bold text-foreground mt-2">Zero Flaws Found!</h4>
                        <p className="text-[11px] text-muted-foreground max-w-[200px] leading-normal font-sans">
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
                  <h4 className="text-xs font-bold text-foreground m-0">Suggestions Pending</h4>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 max-w-[240px] leading-relaxed font-sans m-0 font-medium">
                    Run an AI audit to receive priority based structural recommendations, spelling edits, and ATS improvements.
                  </p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'comparison' && optimization && (
            <div className="space-y-4 h-full min-h-[380px]">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                <div className="space-y-0.5 text-left">
                  <span className="block text-[9px] font-black uppercase tracking-wider text-emerald-500">
                    Quality Optimization
                  </span>
                  <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-normal m-0 font-medium">
                    AI estimates quality gain of{' '}
                    <strong className="text-slate-800 dark:text-white font-extrabold">
                      +{optimization.version_comparison.estimated_quality_gain}%
                    </strong>
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleAcceptOptimization}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-[10px] uppercase tracking-wider h-8"
                >
                  <Check size={12} className="stroke-[3]" />
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
