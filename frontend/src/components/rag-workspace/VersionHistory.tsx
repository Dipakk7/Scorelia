import React from 'react'
import { History, Clock, User, RotateCcw } from 'lucide-react'
import type { DocumentVersion } from '@/data/ragDocumentsMockData'
import { MOCK_DOCUMENT_VERSIONS } from '@/data/ragDocumentsMockData'
import { cn } from '@/lib/utils'

export interface VersionHistoryProps {
  versions?: DocumentVersion[]
  onRestoreVersion?: (version: string) => void
  className?: string
}

export function VersionHistory({
  versions = MOCK_DOCUMENT_VERSIONS,
  onRestoreVersion,
  className
}: VersionHistoryProps) {
  return (
    <div className={cn('p-4 rounded-2xl bg-[#121320] border border-white/5 space-y-3 text-left', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <History size={15} className="text-purple-400 shrink-0" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Index Version Audit Log
          </h4>
        </div>
      </div>

      <div className="space-y-3">
        {versions.map((ver, i) => (
          <div key={i} className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {ver.version}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock size={10} /> {ver.timestamp}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              {ver.changes}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1">
                <User size={10} /> {ver.author}
              </span>
              <button
                type="button"
                onClick={() => onRestoreVersion?.(ver.version)}
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                <RotateCcw size={10} /> Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VersionHistory
