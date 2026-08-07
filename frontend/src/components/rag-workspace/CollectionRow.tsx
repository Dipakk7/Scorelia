import React from 'react'
import {
  BookOpen,
  Database,
  Activity,
  FileText,
  Archive,
  Shield,
  Code,
  Layers
} from 'lucide-react'
import type { CollectionItem } from '@/data/ragWorkspaceMockData'
import { CollectionStatusBadge } from './CollectionStatusBadge'
import { CollectionHealthIndicator } from './CollectionHealthIndicator'
import { RowActionsMenu } from './RowActionsMenu'
import { cn } from '@/lib/utils'

const iconMap = {
  book: BookOpen,
  database: Database,
  activity: Activity,
  fileText: FileText,
  archive: Archive,
  shield: Shield,
  code: Code,
  layers: Layers
}

export interface CollectionRowProps {
  collection: CollectionItem
  viewMode: 'table' | 'grid'
  onSelect: (collection: CollectionItem) => void
  onAction?: (action: string, collection: CollectionItem) => void
  className?: string
}

export function CollectionRow({
  collection,
  viewMode,
  onSelect,
  onAction,
  className
}: CollectionRowProps) {
  const IconComponent = iconMap[collection.iconName] || BookOpen

  if (viewMode === 'grid') {
    return (
      <div
        onClick={() => onSelect(collection)}
        className={cn(
          'group relative p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-purple-500/40 hover:bg-[var(--surface-hover)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-xl cursor-pointer flex flex-col justify-between text-left select-none',
          className
        )}
      >
        {/* Top Bar: Icon + Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
            <IconComponent size={20} />
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <CollectionStatusBadge status={collection.status} />
            <RowActionsMenu
              onOpen={() => onSelect(collection)}
              onRename={() => onAction?.('rename', collection)}
              onReindex={() => onAction?.('reindex', collection)}
              onDuplicate={() => onAction?.('duplicate', collection)}
              onExport={() => onAction?.('export', collection)}
              onArchive={() => onAction?.('archive', collection)}
              onDelete={() => onAction?.('delete', collection)}
            />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1 my-2">
          <h3 className="text-sm font-bold text-[var(--heading)] group-hover:text-purple-300 transition-colors tracking-tight line-clamp-1">
            {collection.name}
          </h3>
          <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
            {collection.description}
          </p>
        </div>

        {/* Metrics Grid inside Card */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs">
          <div>
            <span className="text-[10px] text-[var(--muted)] block uppercase font-mono">Documents</span>
            <span className="font-bold text-[var(--heading)] font-mono">{collection.documentCount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--muted)] block uppercase font-mono">Chunks</span>
            <span className="font-bold text-[var(--heading)] font-mono">{collection.chunkCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer info: Model & Health */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono">
          <span className="truncate max-w-[140px]">{collection.embeddingModel}</span>
          <CollectionHealthIndicator health={collection.health} />
        </div>
      </div>
    )
  }

  // Table Row View
  return (
    <tr
      onClick={() => onSelect(collection)}
      className={cn(
        'hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group text-xs text-[var(--heading)] border-b border-[var(--border)] last:border-0',
        className
      )}
    >
      {/* Collection Name & Icon */}
      <td className="py-4.5 sm:py-5 px-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent size={18} />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-[var(--heading)] block group-hover:text-purple-300 transition-colors truncate max-w-xs text-xs sm:text-sm">
              {collection.name}
            </span>
            <span className="text-[11px] text-[var(--muted)] block truncate max-w-xs mt-0.5">
              {collection.description}
            </span>
          </div>
        </div>
      </td>

      {/* Documents */}
      <td className="py-4.5 sm:py-5 px-4 font-mono font-semibold text-[var(--heading)]">
        {collection.documentCount.toLocaleString()}
      </td>

      {/* Chunks */}
      <td className="py-4.5 sm:py-5 px-4 font-mono text-[var(--heading)]">
        {collection.chunkCount.toLocaleString()}
      </td>

      {/* Embedding Model */}
      <td className="py-4.5 sm:py-5 px-4 font-mono text-[11px] text-[var(--muted)] whitespace-nowrap">
        {collection.embeddingModel}
      </td>

      {/* Status */}
      <td className="py-4.5 sm:py-5 px-4">
        <CollectionStatusBadge status={collection.status} />
      </td>

      {/* Health */}
      <td className="py-4.5 sm:py-5 px-4">
        <CollectionHealthIndicator health={collection.health} />
      </td>

      {/* Last Updated */}
      <td className="py-4.5 sm:py-5 px-4 text-[var(--muted)] text-[11px] whitespace-nowrap">
        {collection.updatedDate}
      </td>

      {/* Row Actions */}
      <td className="py-4.5 sm:py-5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
        <RowActionsMenu
          onOpen={() => onSelect(collection)}
          onRename={() => onAction?.('rename', collection)}
          onReindex={() => onAction?.('reindex', collection)}
          onDuplicate={() => onAction?.('duplicate', collection)}
          onExport={() => onAction?.('export', collection)}
          onArchive={() => onAction?.('archive', collection)}
          onDelete={() => onAction?.('delete', collection)}
        />
      </td>
    </tr>
  )
}

export default CollectionRow

