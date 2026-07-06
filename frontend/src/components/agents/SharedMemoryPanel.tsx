// frontend/src/components/agents/SharedMemoryPanel.tsx

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { MemoryCard } from './MemoryCard'
import { Database, Trash2, Search, Filter, AlertCircle } from 'lucide-react'
import { useClearMemory } from '@/api/agents'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface SharedMemoryPanelProps {
  sessionId: string | null
  memory: Record<string, Record<string, any>>
  isLoading?: boolean
  className?: string
}

export const SharedMemoryPanel: React.FC<SharedMemoryPanelProps> = ({
  sessionId,
  memory = {},
  className,
}) => {
  const [search, setSearch] = useState('')
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all')

  const clearMemoryMutation = useClearMemory()

  // Get namespaces list
  const namespaces = Object.keys(memory)

  // Total count of memory items
  const totalEntries = Object.values(memory).reduce((acc, current) => {
    return acc + Object.keys(current).length
  }, 0)

  // Filter namespaces and entries based on selected filter and search term
  const filteredMemory: Record<string, Record<string, any>> = {}
  
  namespaces.forEach((ns) => {
    if (selectedNamespace !== 'all' && ns !== selectedNamespace) return

    const nsEntries = memory[ns]
    const filteredEntries: Record<string, any> = {}

    Object.keys(nsEntries).forEach((key) => {
      const val = nsEntries[key]
      const stringifiedValue = typeof val === 'object' ? JSON.stringify(val) : String(val)

      const matchesSearch =
        key.toLowerCase().includes(search.toLowerCase()) ||
        stringifiedValue.toLowerCase().includes(search.toLowerCase())

      if (matchesSearch) {
        filteredEntries[key] = val
      }
    })

    if (Object.keys(filteredEntries).length > 0) {
      filteredMemory[ns] = filteredEntries
    }
  })

  const handleClearMemory = async () => {
    if (!sessionId) return
    if (window.confirm('Are you sure you want to clear all shared memory for this session? This will wipe variables across all namespaces.')) {
      try {
        await clearMemoryMutation.mutateAsync(sessionId)
        toast.success('Session memory cleared successfully!')
      } catch (err: any) {
        toast.error('Failed to clear memory: ' + (err.message || err))
      }
    }
  }

  return (
    <Card className={cn('glass-card border border-slate-200 dark:border-dark-border flex flex-col', className)}>
      {/* Header */}
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-dark-border/40 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-brand-500" />
          <div>
            <CardTitle className="text-sm font-semibold font-display text-slate-800 dark:text-slate-200">
              Shared Memory Viewer
            </CardTitle>
            <span className="text-xxs text-slate-400 font-sans block mt-0.5">
              Active Session ID: <span className="font-mono text-xxs font-semibold">{sessionId || 'None'}</span>
            </span>
          </div>
        </div>

        {sessionId && (
          <button
            onClick={handleClearMemory}
            disabled={clearMemoryMutation.isPending}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xxs font-medium bg-rose-50 hover:bg-rose-100 border border-rose-200/50 hover:border-rose-300 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 dark:border-rose-900/30 dark:text-rose-400 rounded-md transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            title="Purge session memory space"
          >
            <Trash2 size={12} />
            <span>Purge Memory</span>
          </button>
        )}
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Controls: Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keys or values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-dark-border/80 bg-white/50 dark:bg-slate-900/50 rounded-lg text-xs font-sans placeholder-slate-400 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all duration-150"
            />
          </div>

          {/* Filter Namespace */}
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={selectedNamespace}
                onChange={(e) => setSelectedNamespace(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-slate-200 dark:border-dark-border/80 bg-white/50 dark:bg-slate-900/50 rounded-lg text-xs font-sans text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all duration-150 appearance-none cursor-pointer"
              >
                <option value="all">All Namespaces</option>
                {namespaces.map((ns) => (
                  <option key={ns} value={ns}>
                    {ns}
                  </option>
                ))}
              </select>
              <Filter
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 max-h-[calc(100vh-380px)]">
          {Object.keys(filteredMemory).map((ns) => (
            <div key={ns} className="flex flex-col gap-2">
              {/* Namespace divider */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-dark-border/30">
                <span className="text-xxs font-semibold uppercase font-mono tracking-wider text-brand-600 dark:text-brand-400">
                  Namespace: {ns}
                </span>
                <span className="text-xxs font-mono text-slate-450">
                  {Object.keys(filteredMemory[ns]).length} variables
                </span>
              </div>

              {/* Memory Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5">
                {Object.keys(filteredMemory[ns]).map((key) => (
                  <MemoryCard
                    key={key}
                    memoryKey={key}
                    value={filteredMemory[ns][key]}
                    namespace={ns}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {Object.keys(filteredMemory).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-slate-200 dark:border-dark-border rounded-xl text-slate-400 text-center">
              <AlertCircle size={28} className="text-slate-300 mb-2" />
              <span className="text-xs font-semibold">No memory entries found</span>
              <p className="text-xxs text-slate-450 max-w-[200px] mt-1 font-sans">
                {search
                  ? 'No entries match your search criteria'
                  : 'Start executing tasks to allocate shared memory entries'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Statistics */}
        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-dark-border/40 flex items-center justify-between text-xxs text-slate-450 font-sans">
          <span>Namespaces active: {namespaces.length}</span>
          <span>Total memory entries: {totalEntries}</span>
        </div>
      </CardContent>
    </Card>
  )
}
