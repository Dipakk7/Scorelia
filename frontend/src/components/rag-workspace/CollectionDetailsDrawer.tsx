import React, { useEffect } from 'react'
import {
  X,
  BookOpen,
  Database,
  Activity,
  FileText,
  Archive,
  Shield,
  Code,
  Layers,
  HardDrive,
  Cpu,
  Clock,
  User,
  ExternalLink,
  RefreshCw,
  Trash2
} from 'lucide-react'
import type { CollectionItem } from '@/data/ragWorkspaceMockData'
import { CollectionStatusBadge } from './CollectionStatusBadge'
import { CollectionHealthIndicator } from './CollectionHealthIndicator'
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

export interface CollectionDetailsDrawerProps {
  collection: CollectionItem | null
  isOpen: boolean
  onClose: () => void
  onAction?: (action: string, collection: CollectionItem) => void
  className?: string
}

export function CollectionDetailsDrawer({
  collection,
  isOpen,
  onClose,
  onAction,
  className
}: CollectionDetailsDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !collection) return null

  const IconComponent = iconMap[collection.iconName] || BookOpen

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Details for collection ${collection.name}`}
        className={cn(
          'relative w-full max-w-lg bg-[var(--surface)] border-l border-[var(--border)] p-6 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between custom-scrollbar animate-in slide-in-from-right duration-300',
          className
        )}
      >
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <IconComponent size={24} />
              </div>
              <div className="min-w-0 text-left">
                <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                  {collection.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <CollectionStatusBadge status={collection.status} />
                  <CollectionHealthIndicator health={collection.health} />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer"
              aria-label="Close details drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Description */}
          <div className="text-left space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#121320] p-3 rounded-xl border border-white/5">
              {collection.description}
            </p>
          </div>

          {/* Key Metrics Overview Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-[#121320] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Documents</span>
              <span className="text-lg font-extrabold text-white font-mono">{collection.documentCount.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121320] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Chunks</span>
              <span className="text-lg font-extrabold text-white font-mono">{collection.chunkCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Storage Usage Bar */}
          <div className="text-left space-y-2 p-3.5 rounded-xl bg-[#121320] border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <HardDrive size={14} className="text-emerald-400" /> Storage Capacity
              </span>
              <span className="font-mono text-slate-200 font-bold">{collection.storageUsed} / 500 MB</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min((collection.storageBytes / 524288000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Technical Metadata Specs */}
          <div className="text-left space-y-2.5 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metadata Specifications</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Cpu size={13} className="text-indigo-400" /> Embedding Model
                </span>
                <span className="font-mono text-slate-200 font-semibold">{collection.embeddingModel}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User size={13} className="text-purple-400" /> Collection Owner
                </span>
                <span className="text-slate-200 font-semibold">{collection.owner}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" /> Created Date
                </span>
                <span className="text-slate-300">{collection.createdDate}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock size={13} className="text-blue-400" /> Last Updated
                </span>
                <span className="text-slate-300 font-mono text-[11px]">{collection.updatedDate}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="text-left space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-2">
              {collection.activities.map((act) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-[#121320] border border-white/5 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <p className="font-semibold text-slate-200">{act.action}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">By {act.user}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onAction?.('reindex', collection)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reindex Collection</span>
          </button>
          <button
            type="button"
            onClick={() => onAction?.('delete', collection)}
            className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
            aria-label="Delete collection"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </aside>
    </div>
  )
}

export default CollectionDetailsDrawer
