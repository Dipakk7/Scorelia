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
    <Card className={cn('border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs flex flex-col', className)}>
      {/* Header */}
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/60 text-left flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-left">
          <Database size={18} className="text-brand-500" />
          <div className="text-left">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-905 dark:text-white m-0 leading-none">
              Shared Memory Viewer
            </CardTitle>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-sans block mt-1.5 leading-none">
              Active Session: <span className="font-mono font-bold">{sessionId || 'None'}</span>
            </span>
          </div>
        </div>

        {sessionId && (
          <button
            onClick={handleClearMemory}
            disabled={clearMemoryMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none h-8 select-none leading-none bg-transparent"
            title="Purge session memory space"
          >
            <Trash2 size={12} />
            <span>Purge Memory</span>
          </button>
        )}
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-4 flex-1 overflow-hidden text-left">
        {/* Controls: Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2.5 text-left">
          {/* Search box */}
          <div className="relative flex-1 text-left">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keys or values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-250 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 rounded-xl text-xs font-sans placeholder-slate-405 text-slate-700 dark:text-slate-205 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all duration-150 shadow-2xs h-9 font-medium"
            />
          </div>

          {/* Filter Namespace */}
          <div className="flex gap-2 text-left">
            <div className="relative text-left">
              <select
                value={selectedNamespace}
                onChange={(e) => setSelectedNamespace(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-slate-250 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 rounded-xl text-xs font-sans text-slate-750 dark:text-slate-205 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all duration-150 appearance-none cursor-pointer shadow-2xs h-9 font-bold"
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
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 max-h-[calc(100vh-380px)] text-left">
          {Object.keys(filteredMemory).map((ns) => (
            <div key={ns} className="flex flex-col gap-2 text-left">
              {/* Namespace divider */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850/65 select-none leading-none">
                <span className="text-[10px] font-black uppercase font-mono tracking-wider text-brand-655 dark:text-brand-400">
                  Namespace: {ns}
                </span>
                <span className="text-[9px] font-mono text-slate-455 dark:text-slate-500 font-bold leading-none">
                  {Object.keys(filteredMemory[ns]).length} variables
                </span>
              </div>

              {/* Memory Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5 text-left">
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
            <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-slate-205 dark:border-slate-850 rounded-2xl text-slate-455 dark:text-slate-500 text-center bg-white/70 dark:bg-slate-900/40 backdrop-blur-md">
              <AlertCircle size={24} className="text-slate-400 mb-2 animate-bounce" />
              <span className="text-xs font-bold leading-none">No memory entries found</span>
              <p className="text-[10px] text-slate-455 dark:text-slate-500 max-w-[200px] mt-2 leading-relaxed font-sans font-medium">
                {search
                  ? 'No entries match your search criteria'
                  : 'Start executing tasks to allocate shared memory entries'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Statistics */}
        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-850/65 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-500 font-sans select-none leading-none">
          <span>Namespaces: {namespaces.length}</span>
          <span>Entries: {totalEntries}</span>
        </div>
      </CardContent>
    </Card>
  )
}
export default SharedMemoryPanel
