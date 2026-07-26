import React, { useState } from 'react'
import { Bookmark, Plus, Trash2, Copy, Play } from 'lucide-react'

interface SavedLayoutItem {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  widgetCount: number
}

interface SavedLayoutsPanelProps {
  onLoadLayout?: (id: string) => void
  onSaveCurrentLayout?: (name: string) => void
  className?: string
}

export function SavedLayoutsPanel({
  onLoadLayout,
  onSaveCurrentLayout,
  className = '',
}: SavedLayoutsPanelProps) {
  const [layouts, setLayouts] = useState<SavedLayoutItem[]>([
    { id: 'layout_1', name: 'My Executive Custom View', createdAt: 'May 10, 2025', updatedAt: 'May 16, 2025', widgetCount: 6 },
    { id: 'layout_2', name: 'Weekly Performance Audit', createdAt: 'May 12, 2025', updatedAt: 'May 15, 2025', widgetCount: 5 },
  ])
  const [newLayoutName, setNewLayoutName] = useState('')

  const handleCreate = () => {
    if (!newLayoutName.trim()) return
    const newLayout: SavedLayoutItem = {
      id: `layout_${Date.now()}`,
      name: newLayoutName.trim(),
      createdAt: 'Today',
      updatedAt: 'Just now',
      widgetCount: 6,
    }
    setLayouts((prev) => [newLayout, ...prev])
    setNewLayoutName('')
    onSaveCurrentLayout?.(newLayout.name)
  }

  const handleDelete = (id: string) => {
    setLayouts((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div>
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2 m-0">
          <Bookmark size={14} className="text-purple-400" />
          Saved Custom Layouts
        </h4>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Save, load, or duplicate your personalized workspace configurations
        </p>
      </div>

      {/* Save Layout Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newLayoutName}
          onChange={(e) => setNewLayoutName(e.target.value)}
          placeholder="Name current layout..."
          className="flex-1 px-3 py-1.5 rounded-xl bg-[#121320] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={!newLayoutName.trim()}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Save</span>
        </button>
      </div>

      {/* Saved Layouts List */}
      <div className="space-y-2">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            tabIndex={0}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0f101c] border border-white/10 text-xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          >
            <div className="min-w-0">
              <span className="font-bold text-slate-100 block truncate">{layout.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Updated {layout.updatedAt} • {layout.widgetCount} Widgets
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onLoadLayout?.(layout.id)}
                className="p-1.5 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
                title="Apply Layout"
              >
                <Play size={12} className="fill-current" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(layout.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Delete Layout"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedLayoutsPanel
