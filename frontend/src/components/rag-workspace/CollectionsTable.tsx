import React from 'react'
import type { CollectionItem } from '@/data/ragWorkspaceMockData'
import { CollectionRow } from './CollectionRow'
import { cn } from '@/lib/utils'

export interface CollectionsTableProps {
  collections: CollectionItem[]
  viewMode: 'table' | 'grid'
  onSelectCollection: (collection: CollectionItem) => void
  onActionCollection?: (action: string, collection: CollectionItem) => void
  className?: string
}

export function CollectionsTable({
  collections,
  viewMode,
  onSelectCollection,
  onActionCollection,
  className
}: CollectionsTableProps) {
  if (viewMode === 'grid') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {collections.map((col) => (
          <CollectionRow
            key={col.id}
            collection={col}
            viewMode="grid"
            onSelect={onSelectCollection}
            onAction={onActionCollection}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto custom-scrollbar rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-purple-500/30 transition-all duration-300 select-none', className)}>
      <table className="w-full text-left border-collapse min-w-[800px]" aria-label="Knowledge Collections Table">
        <thead>
          <tr className="border-b border-[var(--border)] text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider bg-[var(--surface-hover)] sticky top-0 backdrop-blur-md z-10 select-none">
            <th className="py-4 px-5">Collection</th>
            <th className="py-4 px-4">Documents</th>
            <th className="py-4 px-4">Chunks</th>
            <th className="py-4 px-4">Embedding Model</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-4">Health</th>
            <th className="py-4 px-4">Last Updated</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {collections.map((col) => (
            <CollectionRow
              key={col.id}
              collection={col}
              viewMode="table"
              onSelect={onSelectCollection}
              onAction={onActionCollection}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CollectionsTable

