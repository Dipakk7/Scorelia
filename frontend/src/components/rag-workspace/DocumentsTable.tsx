import React from 'react'
import { FileText, Eye, Trash2, Layers } from 'lucide-react'
import type { DocumentItem } from '@/data/ragDocumentsMockData'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import { cn } from '@/lib/utils'

export interface DocumentsTableProps {
  documents: DocumentItem[]
  onSelectDocument: (doc: DocumentItem) => void
  onDeleteDocument: (id: string) => void
  className?: string
}

export function DocumentsTable({
  documents,
  onSelectDocument,
  onDeleteDocument,
  className
}: DocumentsTableProps) {
  return (
    <div className={cn('p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl text-left space-y-4 overflow-x-auto custom-scrollbar select-none', className)}>
      <table className="w-full text-xs text-left text-slate-100">
        <thead className="bg-slate-950/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800 sticky top-0 backdrop-blur-md z-10">
          <tr>
            <th scope="col" className="p-3 font-semibold">Document Name</th>
            <th scope="col" className="p-3 font-semibold">Collection</th>
            <th scope="col" className="p-3 font-semibold">Chunks</th>
            <th scope="col" className="p-3 font-semibold">Status</th>
            <th scope="col" className="p-3 font-semibold">Embedding Model</th>
            <th scope="col" className="p-3 font-semibold">Last Indexed</th>
            <th scope="col" className="p-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="hover:bg-purple-500/5 transition-colors cursor-pointer group"
            >
              {/* Document Name */}
              <td className="p-3">
                <div className="flex items-center gap-2.5 min-w-[200px]">
                  <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-white group-hover:text-purple-300 transition-colors block truncate">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {doc.fileSize} • {doc.fileType}
                    </span>
                  </div>
                </div>
              </td>

              {/* Collection */}
              <td className="p-3 font-mono font-medium text-slate-200 whitespace-nowrap">
                {doc.collection}
              </td>

              {/* Chunks */}
              <td className="p-3 font-mono text-white whitespace-nowrap">
                <span className="flex items-center gap-1">
                  <Layers size={11} className="text-amber-400" />
                  {doc.chunkCount}
                </span>
              </td>

              {/* Status */}
              <td className="p-3 whitespace-nowrap">
                <DocumentStatusBadge status={doc.status} />
              </td>

              {/* Embedding Model */}
              <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                {doc.embeddingModel}
              </td>

              {/* Last Indexed */}
              <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                {doc.lastIndexed}
              </td>

              {/* Actions */}
              <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectDocument(doc)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-none cursor-pointer"
                    aria-label={`Preview document ${doc.name}`}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border-none cursor-pointer"
                    aria-label={`Delete document ${doc.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DocumentsTable

