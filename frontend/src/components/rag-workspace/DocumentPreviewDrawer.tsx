import React, { useState } from 'react'
import {
  X,
  FileText,
  Sparkles,
  Tag,
  BookOpen,
  Download,
  Trash2,
  Layers
} from 'lucide-react'
import type { DocumentItem } from '@/data/ragDocumentsMockData'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import { MetadataPanel } from './MetadataPanel'
import { VersionHistory } from './VersionHistory'
import { cn } from '@/lib/utils'

export interface DocumentPreviewDrawerProps {
  document: DocumentItem | null
  onClose: () => void
  onDeleteDocument?: (docId: string) => void
  className?: string
}

export function DocumentPreviewDrawer({
  document,
  onClose,
  onDeleteDocument,
  className
}: DocumentPreviewDrawerProps) {
  const [activeTab, setActiveTab] = useState<'extractedText' | 'metadata' | 'versions'>('extractedText')

  if (!document) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div
        aria-label="Document Preview Drawer"
        className={cn(
          'w-full max-w-xl h-full bg-[var(--surface)] border-l border-[var(--border)] p-6 overflow-y-auto custom-scrollbar text-left space-y-5 flex flex-col justify-between shadow-2xl',
          className
        )}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white truncate">{document.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span>{document.collection}</span>
                  <span>•</span>
                  <DocumentStatusBadge status={document.status} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close document drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('extractedText')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'extractedText' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Extracted Text & Entities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metadata')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'metadata' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Metadata Specs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('versions')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'versions' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Version Audit
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'extractedText' && (
            <div className="space-y-4">
              {/* Extracted Text Snippet */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Extracted Text Preview
                </span>
                <div className="p-4 rounded-2xl bg-[#121320] border border-white/5 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  "{document.extractedTextSnippet}"
                </div>
              </div>

              {/* Entities Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={13} className="text-purple-400" /> Extracted Entities ({document.entities.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {document.entities.map((ent, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-medium">
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={13} className="text-blue-400" /> Key Topics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {document.topics.map((top, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-medium">
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && <MetadataPanel document={document} />}
          {activeTab === 'versions' && <VersionHistory />}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => onDeleteDocument?.(document.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Asset</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-900/40"
          >
            <Download size={14} />
            <span>Download Raw File</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentPreviewDrawer
