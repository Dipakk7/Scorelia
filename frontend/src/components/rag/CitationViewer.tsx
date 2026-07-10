import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BookOpen, ChevronRight, FileText } from 'lucide-react'
import type { Citation, ContextDocument } from '@/types/rag'
import { cn } from '@/lib/utils'

interface CitationViewerProps {
  citations: Citation[]
  contextDocuments: ContextDocument[]
}

export function CitationViewer({
  citations,
  contextDocuments
}: CitationViewerProps) {
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null)

  if (citations.length === 0) {
    return (
      <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs">
        <CardContent className="py-8 text-center text-muted-foreground italic font-medium leading-relaxed">
          No citations referenced in this response.
        </CardContent>
      </Card>
    )
  }

  // Find the exact chunk content based on the selected citation's chunk_id
  const getSelectedChunkContent = () => {
    if (!selectedCitationId) return null
    for (const doc of contextDocuments) {
      const match = doc.chunks.find(c => c.chunk_id === selectedCitationId)
      if (match) return match.content
    }
    return null
  }

  return (
    <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs">
      <CardHeader className="pb-4 border-b border-border/60 text-left">
        <CardTitle className="text-sm font-black font-display text-foreground flex items-center gap-2 m-0 leading-none">
          <BookOpen className="text-brand-500 h-4 w-4" />
          <span>Source Attributions & Citations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5 text-left">
        {/* List of citations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {citations.map((cit, idx) => {
            const isSelected = selectedCitationId === cit.chunk_id
            const matchScore = Math.round(cit.similarity_score * 100)
            return (
              <div
                key={idx}
                onClick={() => setSelectedCitationId(isSelected ? null : cit.chunk_id)}
                className={cn(
                  'p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm text-left',
                  isSelected
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : 'border-slate-205 dark:border-slate-850 bg-card/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-750'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 text-left">
                  <div className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black font-display transition-colors',
                    isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  )}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-extrabold text-foreground truncate pr-1">
                      {cit.source_file || 'retrieved_chunk'}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5 leading-none">
                      {cit.collection || 'KB Collection'} {cit.page_number !== undefined ? `• Page ${cit.page_number}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-lg leading-none shrink-0 border',
                      matchScore >= 80
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-brand-500/10 text-brand-655 dark:text-brand-400 border-brand-500/20'
                    )}
                  >
                    {matchScore}% Match
                  </Badge>
                  <ChevronRight size={14} className={cn('text-slate-400 transition-transform', isSelected && 'rotate-90 text-brand-500')} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected citation text preview */}
        {selectedCitationId && (
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-200/50 dark:border-slate-850 text-xs text-slate-655 dark:text-slate-400 leading-relaxed font-sans font-medium text-left animate-fade-in relative">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-655 dark:text-brand-405 mb-2 leading-none flex items-center gap-1.5">
              <FileText size={12} className="text-brand-500" />
              <span>Full Chunk Context Segment</span>
            </h5>
            <div className="m-0 leading-relaxed">
              {getSelectedChunkContent() || 'No preview segment found in the loaded context.'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default CitationViewer
