import React, { useState } from 'react'
import { History, Star, CheckCircle2, GitCompare, Edit2, Check } from 'lucide-react'
import SidebarCard from './SidebarCard'
import { mockCoverLetterVersions, type MockCoverLetterContent } from '@/lib/cover-letter-mock-data'

export interface VersionHistoryPanelProps {
  activeVersionId?: string
  onSelectVersion?: (version: MockCoverLetterContent) => void
  onOpenCompareModal?: () => void
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  activeVersionId = 'v1',
  onSelectVersion,
  onOpenCompareModal,
}) => {
  const [versions, setVersions] = useState<MockCoverLetterContent[]>(mockCoverLetterVersions)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState<string>('')

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setVersions((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    )
  }

  const handleStartRename = (ver: MockCoverLetterContent, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(ver.id)
    setEditLabel(ver.versionLabel)
  }

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation()
    setVersions((prev) =>
      prev.map((v) => (v.id === id ? { ...v, versionLabel: editLabel } : v))
    )
    setEditingId(null)
  }

  return (
    <SidebarCard
      title={
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <span className="font-extrabold text-sm text-white">Version History & Drafts</span>
        </div>
      }
      action={
        <button
          type="button"
          onClick={onOpenCompareModal}
          className="flex items-center gap-1 text-[11px] font-bold text-purple-300 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          <GitCompare className="w-3 h-3 text-purple-400" />
          <span>Compare Versions</span>
        </button>
      }
    >
      <div className="space-y-2.5 text-left">
        {versions.map((ver) => {
          const isActive = ver.id === activeVersionId

          return (
            <div
              key={ver.id}
              onClick={() => onSelectVersion?.(ver)}
              className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                isActive
                  ? 'border-purple-500 bg-purple-600/20 shadow-md ring-1 ring-purple-500/30'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500 text-white shrink-0">
                    v{ver.versionNumber}
                  </span>

                  {editingId === ver.id ? (
                    <form
                      onSubmit={(e) => handleSaveRename(ver.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 flex-1"
                    >
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="w-full text-xs font-bold bg-slate-800 border border-purple-400 rounded px-2 py-0.5 text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 text-emerald-400 border-none bg-transparent cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <span className="font-bold text-xs text-white truncate">
                      {ver.versionLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleStartRename(ver, e)}
                    title="Rename Version"
                    className="text-slate-400 hover:text-white p-0.5 border-none bg-transparent cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(ver.id, e)}
                    title={ver.isFavorite ? 'Unfavorite' : 'Favorite'}
                    className="text-slate-400 hover:text-amber-400 p-0.5 border-none bg-transparent cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${ver.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1.5 border-t border-slate-800/80">
                <span>
                  {ver.wordCount} words • ATS {ver.atsScore}%
                </span>

                <div className="flex items-center gap-1 text-purple-300">
                  {isActive && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  <span>{ver.createdAt}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SidebarCard>
  )
}

export default VersionHistoryPanel
