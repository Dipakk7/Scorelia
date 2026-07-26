import React, { useState } from 'react'
import { LayoutGrid, Search, SlidersHorizontal } from 'lucide-react'
import type { WidgetItemPreference, WidgetSize, WidgetCategory } from '@/features/analytics/preferences/analyticsPreferencesTypes'
import { WidgetCard } from './WidgetCard'

interface WidgetManagerProps {
  widgets: WidgetItemPreference[]
  onToggleVisibility: (id: string, visible: boolean) => void
  onTogglePin: (id: string, pinned: boolean) => void
  onChangeSize?: (id: string, size: WidgetSize) => void
  className?: string
}

const categories: (WidgetCategory | 'All')[] = ['All', 'Overview', 'Charts', 'Performance', 'Intelligence', 'Reports', 'Utilities']

export function WidgetManager({
  widgets,
  onToggleVisibility,
  onTogglePin,
  onChangeSize,
  className = '',
}: WidgetManagerProps) {
  const [activeCategory, setActiveCategory] = useState<WidgetCategory | 'All'>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWidgets = widgets.filter((w) => {
    const matchesCat = activeCategory === 'All' || w.category === activeCategory
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div>
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2 m-0">
          <LayoutGrid size={14} className="text-purple-400" />
          Dashboard Widget Manager
        </h4>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Configure visibility, ordering, layout size, and pinned priorities
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search widgets..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#121320] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Widget Cards List */}
      <div className="space-y-2">
        {filteredWidgets.map((w) => (
          <WidgetCard
            key={w.id}
            widget={w}
            onToggleVisibility={onToggleVisibility}
            onTogglePin={onTogglePin}
            onChangeSize={onChangeSize}
          />
        ))}
      </div>
    </div>
  )
}

export default WidgetManager
