import React from 'react'
import { FileText, HardDrive, Layers, Globe, Shield, Calendar, Key } from 'lucide-react'
import type { DocumentItem } from '@/data/ragDocumentsMockData'
import { cn } from '@/lib/utils'

export interface MetadataPanelProps {
  document: DocumentItem
  className?: string
}

export function MetadataPanel({ document, className }: MetadataPanelProps) {
  const metaRows = [
    { icon: FileText, label: 'File Type', value: document.fileType },
    { icon: HardDrive, label: 'File Size', value: document.fileSize },
    { icon: Layers, label: 'Page Count', value: `${document.pageCount} Pages` },
    { icon: Globe, label: 'Language', value: document.language },
    { icon: Shield, label: 'Embedding Model', value: document.embeddingModel },
    { icon: Calendar, label: 'Last Indexed', value: document.lastIndexed },
    { icon: Key, label: 'Checksum SHA-256', value: `${document.checksum.slice(0, 16)}...` }
  ]

  return (
    <div className={cn('p-4 rounded-2xl bg-[#121320] border border-white/5 space-y-3 text-left', className)}>
      <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
        Document Metadata Specifications
      </h4>

      <div className="space-y-2 text-xs font-mono">
        {metaRows.map((row, i) => {
          const Icon = row.icon
          return (
            <div key={i} className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Icon size={13} className="text-purple-400" />
                {row.label}
              </span>
              <strong className="text-slate-100 font-medium truncate max-w-[180px]">{row.value}</strong>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetadataPanel
