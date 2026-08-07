import React, { useState, useRef, useEffect } from 'react'
import {
  MoreVertical,
  ExternalLink,
  Edit2,
  RefreshCw,
  Copy,
  Download,
  Archive,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RowActionsMenuProps {
  onOpen?: () => void
  onRename?: () => void
  onReindex?: () => void
  onDuplicate?: () => void
  onExport?: () => void
  onArchive?: () => void
  onDelete?: () => void
  className?: string
}

export function RowActionsMenu({
  onOpen,
  onRename,
  onReindex,
  onDuplicate,
  onExport,
  onArchive,
  onDelete,
  className
}: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const menuItems = [
    { label: 'Open', icon: ExternalLink, action: onOpen, color: 'text-slate-200' },
    { label: 'Rename', icon: Edit2, action: onRename, color: 'text-slate-200' },
    { label: 'Reindex', icon: RefreshCw, action: onReindex, color: 'text-slate-200' },
    { label: 'Duplicate', icon: Copy, action: onDuplicate, color: 'text-slate-200' },
    { label: 'Export', icon: Download, action: onExport, color: 'text-slate-200' },
    { label: 'Archive', icon: Archive, action: onArchive, color: 'text-amber-400' },
    { label: 'Delete', icon: Trash2, action: onDelete, color: 'text-rose-400' }
  ]

  return (
    <div ref={menuRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
        aria-label="Collection actions menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl z-30 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isSeparator = index === 5 // separate destructive/archive actions

            return (
              <React.Fragment key={item.label}>
                {isSeparator && <div className="h-px bg-slate-800 my-1" />}
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                    if (item.action) item.action()
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer',
                    item.color
                  )}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RowActionsMenu
