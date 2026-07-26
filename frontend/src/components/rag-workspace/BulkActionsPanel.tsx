import React, { useState } from 'react'
import { Layers, RefreshCw, Archive, Trash2, FolderInput, Download, CheckSquare, XSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BulkActionsPanelProps {
  selectedCount: number
  totalCount: number
  onSelectAll?: () => void
  onClearSelection?: () => void
  onExecuteBulkAction?: (action: 'reindex' | 'export' | 'archive' | 'delete' | 'move') => void
  className?: string
}

export function BulkActionsPanel({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onExecuteBulkAction,
  className
}: BulkActionsPanelProps) {
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null)

  if (selectedCount === 0) return null

  const handleActionClick = (action: 'reindex' | 'export' | 'archive' | 'delete' | 'move') => {
    if (action === 'delete') {
      setConfirmingAction('delete')
    } else {
      onExecuteBulkAction?.(action)
    }
  }

  return (
    <div className={cn('p-4 rounded-2xl bg-[#0e0f1a] border border-purple-500/40 shadow-xl text-left space-y-3', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-white font-bold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <CheckSquare size={14} />
            <span>{selectedCount} Selected</span>
          </div>

          {onSelectAll && selectedCount < totalCount && (
            <button
              type="button"
              onClick={onSelectAll}
              className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer"
            >
              Select all {totalCount} items
            </button>
          )}

          {onClearSelection && (
            <button
              type="button"
              onClick={onClearSelection}
              className="text-slate-400 hover:text-red-400 flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <XSquare size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Bulk action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleActionClick('reindex')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw size={13} className="text-purple-400" />
            <span>Reindex</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick('export')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <Download size={13} className="text-blue-400" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick('archive')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <Archive size={13} className="text-amber-400" />
            <span>Archive</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick('delete')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Delete Selected</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmingAction === 'delete' && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-300">
          <span>Are you sure you want to permanently delete {selectedCount} items?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onExecuteBulkAction?.('delete')
                setConfirmingAction(null)
              }}
              className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
            >
              Confirm Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingAction(null)}
              className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BulkActionsPanel
