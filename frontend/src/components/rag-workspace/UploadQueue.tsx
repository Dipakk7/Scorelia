import React from 'react'
import { FileUp, Pause, Play, X, RefreshCw } from 'lucide-react'
import type { UploadQueueItem } from '@/data/ragDocumentsMockData'
import { cn } from '@/lib/utils'

export interface UploadQueueProps {
  items: UploadQueueItem[]
  onItemAction?: (id: string, action: 'pause' | 'resume' | 'cancel') => void
  className?: string
}

export function UploadQueue({ items, onItemAction, className }: UploadQueueProps) {
  if (!items || items.length === 0) return null

  return (
    <div className={cn('p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-3', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <FileUp size={16} className="text-purple-400 shrink-0" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Upload Queue ({items.length})
          </h4>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="p-3 rounded-xl bg-[#121320] border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-100 truncate">{item.filename}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{item.fileSize}</span>
                  <span>•</span>
                  <span>{item.eta}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {item.status === 'uploading' && (
                  <button
                    type="button"
                    onClick={() => onItemAction?.(item.id, 'pause')}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Pause Upload"
                  >
                    <Pause size={14} />
                  </button>
                )}
                {item.status === 'paused' && (
                  <button
                    type="button"
                    onClick={() => onItemAction?.(item.id, 'resume')}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Resume Upload"
                  >
                    <Play size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onItemAction?.(item.id, 'cancel')}
                  className="p-1 rounded text-slate-400 hover:text-rose-400"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    item.status === 'processing' ? 'bg-amber-400 animate-pulse' : 'bg-purple-500'
                  )}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadQueue
