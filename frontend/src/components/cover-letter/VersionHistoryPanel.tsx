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
          <History size={16} className="text-purple-400" />
          <span className="font-extrabold text-sm text-[var(--heading)]">Version History & Edit Log</span>
        </div>
      }
      action={
        <button
          type="button"
          onClick={onOpenCompareModal}
          className="flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer border-none bg-transparent"
        >
          <GitCompare size={12} />
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
                  ? 'border-[var(--primary)] bg-[var(--primary)]/15 shadow-sm'
                  : 'border-[var(--border)] bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[var(--primary)] text-white shrink-0">
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
                        className="w-full text-xs font-bold bg-[var(--surface-hover)] border border-[var(--primary)] rounded px-1.5 py-0.5 text-[var(--heading)] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 text-emerald-400 border-none bg-transparent cursor-pointer"
                      >
                        <Check size={12} />
                      </button>
                    </form>
                  ) : (
                    <span className="font-bold text-xs text-[var(--heading)] truncate">
                      {ver.versionLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleStartRename(ver, e)}
                    title="Rename Version"
                    className="text-[var(--muted)] hover:text-[var(--heading)] p-0.5 border-none bg-transparent cursor-pointer"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(ver.id, e)}
                    title={ver.isFavorite ? 'Unfavorite' : 'Favorite'}
                    className="text-[var(--muted)] hover:text-amber-400 p-0.5 border-none bg-transparent cursor-pointer"
                  >
                    <Star
                      size={13}
                      className={ver.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-[var(--muted)]'}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-medium pt-1 border-t border-[var(--border)]">
                <span>
                  {ver.wordCount} words • ATS {ver.atsScore}%
                </span>

                <div className="flex items-center gap-1">
                  {isActive && <CheckCircle2 size={12} className="text-[var(--primary)]" />}
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
