import React, { useState } from 'react'
import { Database, Plus, RefreshCw, Download, Trash2, CheckCircle2, Clock } from 'lucide-react'
import type { WorkspaceSnapshotItem } from '@/data/ragReportsMockData'
import { cn } from '@/lib/utils'

export interface WorkspaceSnapshotsProps {
  snapshots: WorkspaceSnapshotItem[]
  onCreateSnapshot?: (name: string, description: string) => void
  onRestoreSnapshot?: (id: string) => void
  onDeleteSnapshot?: (id: string) => void
  isSnapshotting?: boolean
  className?: string
}

export function WorkspaceSnapshots({
  snapshots,
  onCreateSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
  isSnapshotting = false,
  className
}: WorkspaceSnapshotsProps) {
  const [isCreatingModal, setIsCreatingModal] = useState(false)
  const [snapshotName, setSnapshotName] = useState('')
  const [snapshotDesc, setSnapshotDesc] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!snapshotName.trim()) return
    onCreateSnapshot?.(snapshotName, snapshotDesc)
    setSnapshotName('')
    setSnapshotDesc('')
    setIsCreatingModal(false)
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4 select-none', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--heading)] uppercase tracking-wider flex items-center gap-2 font-sans">
            <Database size={16} className="text-purple-400" />
            Workspace Snapshots & Backups
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Create system state restore points for vector collections, documents, and configurations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer shrink-0 min-h-[38px] border-none"
        >
          <Plus size={14} />
          <span>Create Snapshot</span>
        </button>
      </div>

      {/* Inline Create Snapshot Form Modal */}
      {isCreatingModal && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl bg-[var(--surface-hover)] border border-purple-500/30 space-y-3">
          <h4 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">Create New System Snapshot</h4>
          <input
            type="text"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder="Snapshot name (e.g. Pre_Upgrade_Backup)"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--heading)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            autoFocus
          />
          <input
            type="text"
            value={snapshotDesc}
            onChange={(e) => setSnapshotDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--heading)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingModal(false)}
              className="px-3 py-1.5 rounded-xl bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] border border-[var(--border)] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!snapshotName.trim() || isSnapshotting}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold disabled:opacity-50 cursor-pointer border-none"
            >
              Save Snapshot
            </button>
          </div>
        </form>
      )}

      {/* Snapshots Table */}
      <div className="space-y-3">
        {snapshots.map((snap) => (
          <div key={snap.id} className="p-3.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--heading)] font-mono">{snap.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[10px] font-mono">
                  {snap.size}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">{snap.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-[var(--muted)] font-mono">
                <span>By: {snap.createdBy}</span>
                <span>•</span>
                <span>{snap.createdAt}</span>
                <span>•</span>
                <span>{snap.collectionsCount} collections ({snap.documentsCount} docs)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onRestoreSnapshot?.(snap.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-semibold cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Restore</span>
              </button>
              {onDeleteSnapshot && (
                <button
                  type="button"
                  onClick={() => onDeleteSnapshot(snap.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                  title="Delete snapshot"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkspaceSnapshots

