import React, { useState } from 'react'
import {
  MoreVertical,
  ExternalLink,
  BarChart2,
  Pause,
  Play,
  Copy,
  Archive,
  Trash2,
} from 'lucide-react'
import DeleteDialog from '@/components/ui/DeleteDialog'
import type { AgentConsoleItem } from '@/data/agentConsoleMockData'
import { cn } from '@/lib/utils'

export interface RowActionsMenuProps {
  agent: AgentConsoleItem
  onOpenDetails: (agent: AgentConsoleItem) => void
  onTogglePause?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
  className?: string
}

export function RowActionsMenu({
  agent,
  onOpenDetails,
  onTogglePause,
  onDeleteAgent,
  className,
}: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isPaused = agent.status === 'paused'

  const handleConfirmDelete = async () => {
    onDeleteAgent?.(agent.id)
  }

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Actions for ${agent.name}`}
        aria-expanded={isOpen}
        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <MoreVertical size={15} />
      </button>

      {/* Action Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl bg-[#121322] border border-white/10 shadow-2xl p-1.5 space-y-0.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                onOpenDetails(agent)
              }}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left font-medium cursor-pointer"
            >
              <ExternalLink size={13} className="text-purple-400" />
              <span>Open Details</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                onOpenDetails(agent)
              }}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left font-medium cursor-pointer"
            >
              <BarChart2 size={13} className="text-blue-400" />
              <span>View Analytics</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                onTogglePause?.(agent.id)
              }}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left font-medium cursor-pointer"
            >
              {isPaused ? (
                <>
                  <Play size={13} className="text-emerald-400" />
                  <span>Resume Agent</span>
                </>
              ) : (
                <>
                  <Pause size={13} className="text-amber-400" />
                  <span>Pause Agent</span>
                </>
              )}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left font-medium cursor-pointer"
            >
              <Copy size={13} className="text-slate-400" />
              <span>Clone Agent</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left font-medium cursor-pointer text-slate-400"
            >
              <Archive size={13} />
              <span>Archive</span>
            </button>

            <div className="border-t border-white/5 my-1" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                setShowDeleteDialog(true)
              }}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-left font-medium cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Delete Agent</span>
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${agent.name}"?`}
        description="Are you sure you want to delete this AI agent? All operational configs and historical logs will be archived permanently."
      />
    </div>
  )
}

export default RowActionsMenu
