import { Card, CardContent } from '@/components/ui/Card'
import { FileText, ExternalLink } from 'lucide-react'
import type { RetrievedChunk } from '@/types/rag'
import { cn } from '@/lib/utils'

interface KnowledgeCardProps {
  chunk: RetrievedChunk
  onSelectCitation?: (chunk: RetrievedChunk) => void
}

export function KnowledgeCard({ chunk, onSelectCitation }: KnowledgeCardProps) {
  const percentScore = Math.round(chunk.similarity_score * 100)

  return (
    <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
      <CardContent className="p-4 space-y-3">
        {/* Source metadata header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0 text-left">
            <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
              <FileText size={16} />
            </div>
            <div className="min-w-0 text-left">
              <h4 className="text-xs font-extrabold text-foreground truncate max-w-[200px] m-0 leading-none" title={chunk.source || 'Unknown Source'}>
                {chunk.source || 'Unknown Source'}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-muted-foreground font-sans font-bold leading-none mt-1.5">
                {chunk.collection && (
                  <>
                    <span>{chunk.collection}</span>
                    <span className="text-slate-300">•</span>
                  </>
                )}
                {chunk.page !== undefined && chunk.page !== null && (
                  <>
                    <span>Page {chunk.page}</span>
                    <span className="text-slate-300">•</span>
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

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                'text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-lg leading-none shrink-0 border',
                percentScore >= 80
                  ? 'bg-success/10 text-success border-success/20'
                  : 'bg-brand-500/10 text-brand-655 dark:text-brand-400 border-brand-500/20'
              )}
            >
              {percentScore}% Match
            </span>
            {onSelectCitation && (
              <button
                onClick={() => onSelectCitation(chunk)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border-none bg-transparent flex items-center"
                title="Locate citation source"
              >
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Text chunk preview */}
        <div className="bg-slate-50/30 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-850/60 text-xs text-slate-655 dark:text-slate-400 font-sans leading-relaxed font-medium text-left">
          {chunk.content}
        </div>

        {/* Embedded footer */}
        <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-slate-500 font-bold font-sans pt-1 leading-none select-none">
          <span className="truncate max-w-[200px]">Doc ID: {chunk.document_id}</span>
          <span className="font-mono">Embedder: {chunk.embedding_model.split('/').pop()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
export default KnowledgeCard
