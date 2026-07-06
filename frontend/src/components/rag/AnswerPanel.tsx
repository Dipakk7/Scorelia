import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Copy, RefreshCw, Download, Sparkles, BrainCircuit, History, Layers, Cpu } from 'lucide-react'
import type { RAGResponse } from '@/types/rag'
import toast from 'react-hot-toast'

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
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md animate-pulse">
        <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
          <BrainCircuit className="h-10 w-10 text-brand-500 animate-bounce" />
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Synthesizing information & generating answer...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!response) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <CardContent className="py-16 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center">
            <Sparkles className="text-slate-400 h-6 w-6" />
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 font-bold font-display m-0">No Answer Generated</h3>
          <p className="max-w-xs text-xs leading-relaxed m-0">
            Enter a question in the search bar above to query your Knowledge Base and generate an answer.
          </p>
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
    <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md text-left flex flex-col h-full justify-between">
      <div>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-brand-500 h-5 w-5 animate-pulse-slow" />
            <div>
              <CardTitle className="text-sm font-bold font-display text-slate-900 dark:text-white m-0">
                AI Answer Panel
              </CardTitle>
              <CardDescription className="text-[10px] mt-0.5">
                Synthesized from {response.retrieved_document_count} document sources.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isCacheHit && (
              <Badge variant="success" className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5">
                Cached Response
              </Badge>
            )}
            <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5">
              Ollama / {response.model.split('/').pop()}
            </Badge>
          </div>
        </CardHeader>

        {/* Answer Content */}
        <CardContent className="py-5">
          <div className="prose dark:prose-invert prose-xs max-w-none text-slate-805 dark:text-slate-200 font-sans leading-relaxed text-sm whitespace-pre-line">
            {response.answer}
          </div>
        </CardContent>
      </div>

      {/* Stats and Action panel */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans text-slate-500 dark:text-slate-400">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Cpu size={10} /> Latency
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{latencySeconds}s</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Layers size={10} /> Chunks Used
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{response.retrieved_chunk_count} segments</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <History size={10} /> Tokens Consumed
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{totalTokens || 'N/A'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> Guardrails
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Hallucination Guard</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs py-1.5 px-3 flex items-center gap-1.5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <Copy size={13} />
              <span>Copy</span>
            </Button>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="text-xs py-1.5 px-3 flex items-center gap-1.5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
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
              className="text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
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
