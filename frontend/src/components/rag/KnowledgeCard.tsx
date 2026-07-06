import { Card, CardContent } from '@/components/ui/Card'
import { FileText, ExternalLink } from 'lucide-react'
import type { RetrievedChunk } from '@/types/rag'

interface KnowledgeCardProps {
  chunk: RetrievedChunk
  onSelectCitation?: (chunk: RetrievedChunk) => void
}

export function KnowledgeCard({ chunk, onSelectCitation }: KnowledgeCardProps) {
  const percentScore = Math.round(chunk.similarity_score * 100)

  const getScoreColorClass = (val: number) => {
    if (val >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20'
    if (val >= 50) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20'
    return 'text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20'
  }

  return (
    <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/60 transition-all duration-150 text-left">
      <CardContent className="p-4 space-y-3">
        {/* Source metadata header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
              <FileText size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] m-0" title={chunk.source || 'Unknown Source'}>
                {chunk.source || 'Unknown Source'}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {chunk.collection && (
                  <>
                    <span>{chunk.collection}</span>
                    <span>•</span>
                  </>
                )}
                {chunk.page !== undefined && chunk.page !== null && (
                  <>
                    <span>Page {chunk.page}</span>
                    <span>•</span>
                  </>
                )}
                {chunk.section ? (
                  <span className="truncate max-w-[150px]">{chunk.section}</span>
                ) : (
                  <span>Index {chunk.chunk_index}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md font-display ${getScoreColorClass(percentScore)}`}>
              {percentScore}% Match
            </span>
            {onSelectCitation && (
              <button
                onClick={() => onSelectCitation(chunk)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Locate citation source"
              >
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Text chunk preview */}
        <div className="bg-slate-50/50 dark:bg-slate-950/25 p-3 rounded-lg border border-slate-100 dark:border-slate-800/40 text-xs text-slate-650 dark:text-slate-355 font-sans leading-relaxed font-normal">
          {chunk.content}
        </div>

        {/* Embedded footer */}
        <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold font-sans pt-1">
          <span className="truncate max-w-[200px]">Doc ID: {chunk.document_id}</span>
          <span className="font-mono">Embedder: {chunk.embedding_model.split('/').pop()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
export default KnowledgeCard
