import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BookOpen, ChevronRight, FileText } from 'lucide-react'
import type { Citation, ContextDocument } from '@/types/rag'

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
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <CardContent className="py-8 text-center text-xs text-slate-400 italic">
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
    <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md text-left">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 m-0">
          <BookOpen className="text-brand-500 h-4 w-4" />
          <span>Source Attributions & Citations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* List of citations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {citations.map((cit, idx) => {
            const isSelected = selectedCitationId === cit.chunk_id
            const matchScore = Math.round(cit.similarity_score * 100)
            return (
              <div
                key={idx}
                onClick={() => setSelectedCitationId(isSelected ? null : cit.chunk_id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : 'border-slate-200/60 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/45'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-display ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-1">
                      {cit.source_file || 'retrieved_chunk'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                      {cit.collection || 'KB Collection'} {cit.page_number !== undefined ? `• Page ${cit.page_number}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={matchScore >= 80 ? 'success' : 'secondary'} className="text-[9px] font-bold">
                    {matchScore}% Match
                  </Badge>
                  <ChevronRight size={14} className={`text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-brand-600' : ''}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected citation text preview */}
        {selectedCitationId && (
          <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg border border-slate-150 dark:border-slate-850 animate-fadeIn text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-normal relative">
            <h5 className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 mb-1.5 flex items-center gap-1.5">
              <FileText size={12} />
              <span>Full Chunk Context segment</span>
            </h5>
            {getSelectedChunkContent() || 'No preview segment found in the loaded context.'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default CitationViewer
