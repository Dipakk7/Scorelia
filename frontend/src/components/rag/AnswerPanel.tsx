import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Copy, RefreshCw, Download, Sparkles, BrainCircuit, History, Layers, Cpu } from 'lucide-react'
import type { RAGResponse } from '@/types/rag'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { StreamingText } from '@/components/ui/StreamingText'

interface AnswerPanelProps {
  response: RAGResponse | null
  onRegenerate?: () => void
  onExport?: () => void
  isLoading?: boolean
}

export function AnswerPanel({
  response,
  onRegenerate,
  onExport,
  isLoading = false
}: AnswerPanelProps) {
  if (isLoading) {
    return (
      <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden text-left font-sans text-xs animate-pulse">
        <CardContent className="py-16 flex flex-col items-center justify-center gap-4 text-center">
          <BrainCircuit className="h-10 w-10 text-brand-500 animate-bounce" />
          <div className="text-sm font-bold text-muted-foreground font-display">
            Synthesizing information & generating answer...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!response) {
    return (
      <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden text-left font-sans text-xs">
        <CardContent className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-3.5">
          <div className="h-12 w-12 rounded-full bg-[var(--surface-hover)]/30 flex items-center justify-center border border-[var(--border)]/60">
            <Sparkles className="text-[var(--primary)] h-6 w-6 animate-pulse" />
          </div>
          <h3 className="text-[var(--heading)] font-black font-display text-sm m-0 leading-none">No Answer Generated</h3>
          <p className="max-w-xs text-xs text-[var(--muted)] leading-relaxed m-0 font-medium font-sans">
            Enter a question in the search bar above to query your Knowledge Base and generate an answer.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const searchInput = document.querySelector('input[placeholder*="Ask a career question"]') as HTMLInputElement
              if (searchInput) {
                searchInput.focus()
              }
            }}
            className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer h-8.5 rounded-xl hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 mt-1"
          >
            <Sparkles size={12} className="text-[var(--primary)] animate-pulse" />
            <span>Search Knowledge Base</span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleCopy = () => {
    if (response?.answer) {
      navigator.clipboard.writeText(response.answer)
      toast.success('Answer copied to clipboard!')
    }
  }

  const latencySeconds = (response.latency_ms / 1000).toFixed(2)
  const totalTokens = response.token_usage?.total_tokens ?? 0
  const isCacheHit = response.cache_status?.toUpperCase() === 'HIT'

  return (
    <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden text-left flex flex-col h-full justify-between font-sans text-xs">
      <div>
        <CardHeader className="pb-4 border-b border-[var(--border)]/60 text-left flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-brand-500 h-5 w-5 animate-pulse" />
            <div className="text-left space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-sm font-black font-display text-foreground m-0 leading-none">
                  AI Answer Panel
                </CardTitle>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono bg-brand-500/10 text-brand-500 border border-brand-500/20 select-none">
                  <Sparkles size={9} />
                  <span>Scorelia Copilot</span>
                </span>
              </div>
              <CardDescription className="text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed font-sans m-0 mt-1 font-medium">
                Synthesized from {response.retrieved_document_count} document sources.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isCacheHit && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-655 dark:text-emerald-455 border border-emerald-500/25 text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-[var(--radius-sm)] leading-none shrink-0">
                Cached Response
              </Badge>
            )}
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0.5 px-2 border-[var(--border)] text-slate-500 rounded-[var(--radius-sm)] leading-none shrink-0 bg-transparent">
              Ollama / {response.model.split('/').pop()}
            </Badge>
          </div>
        </CardHeader>

        {/* Answer Content */}
        <CardContent className="p-6 text-left">
          <div className="prose dark:prose-invert prose-xs max-w-none text-slate-800 dark:text-slate-205 font-sans leading-relaxed text-sm whitespace-pre-line font-medium">
            <StreamingText text={response.answer} />
          </div>
        </CardContent>
      </div>

      {/* Stats and Action panel */}
      <div className="border-t border-[var(--border)]/60 p-6 space-y-6 bg-[var(--surface-hover)]/30 text-left">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-sans text-slate-550 dark:text-slate-400 text-left">
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 leading-none">
              <Cpu size={11} className="text-slate-400" /> Latency
            </div>
            <div className="font-mono font-black text-foreground mt-1">{latencySeconds}s</div>
          </div>
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 leading-none">
              <Layers size={11} className="text-slate-400" /> Chunks Used
            </div>
            <div className="font-mono font-black text-foreground mt-1">{response.retrieved_chunk_count} segments</div>
          </div>
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 leading-none">
              <History size={11} className="text-slate-400" /> Tokens
            </div>
            <div className="font-mono font-black text-foreground mt-1">{totalTokens || 'N/A'}</div>
          </div>
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 leading-none">
              <Sparkles size={11} className="text-slate-400" /> Guardrails
            </div>
            <div className="font-sans font-bold text-foreground mt-1">Hallucination Guard</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border)]/60">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs py-1.5 px-3 flex items-center gap-1.5 border border-[var(--border)] bg-white hover:border-brand-500/30 hover:bg-brand-500/5 transition-all rounded-[var(--radius-sm)] h-8 font-bold cursor-pointer dark:bg-transparent bg-transparent"
            >
              <Copy size={13} />
              <span>Copy</span>
            </Button>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="text-xs py-1.5 px-3 flex items-center gap-1.5 border border-[var(--border)] bg-white hover:border-brand-500/30 hover:bg-brand-500/5 transition-all rounded-[var(--radius-sm)] h-8 font-bold cursor-pointer dark:bg-transparent bg-transparent"
              >
                <Download size={13} />
                <span>Export</span>
              </Button>
            )}
          </div>
          {onRegenerate && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRegenerate}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 font-bold cursor-pointer border border-brand-500/15 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all text-[10px] uppercase tracking-wider rounded-[var(--radius-sm)] h-8 bg-transparent text-brand-655 dark:text-brand-400"
            >
              <RefreshCw size={13} />
              <span>Regenerate</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
export default AnswerPanel
