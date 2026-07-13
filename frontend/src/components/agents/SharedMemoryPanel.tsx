import React, { useState } from 'react'
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
    <div className={cn('flex flex-col h-full text-left font-sans text-xs bg-transparent', className)}>
      {/* Header Panel */}
      <div className="pb-3 border-b border-[var(--border)]/60 flex items-center justify-between gap-4 flex-shrink-0 select-none">
        <div className="flex items-center gap-2 text-left">
          <Database size={15} className="text-[var(--primary)] animate-pulse" />
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
              Shared Memory Viewer
            </h4>
            <span className="text-[8px] text-[var(--muted)] font-sans block mt-1.5 leading-none">
              Active Session: <span className="font-mono font-semibold">{sessionId || 'None'}</span>
            </span>
          </div>
        </div>

        {sessionId && (
          <button
            onClick={handleClearMemory}
            disabled={clearMemoryMutation.isPending}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-[var(--danger)]/10 border border-[var(--danger)]/25 hover:border-[var(--danger)]/40 text-[var(--danger)] rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none h-7 select-none leading-none"
            title="Purge session memory space"
          >
            <Trash2 size={11} />
            <span>Purge Memory</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3.5 flex-grow overflow-hidden mt-4 text-left min-h-0">
        {/* Controls: Search and Filter */}
        <div className="flex gap-2 text-left select-none">
          {/* Search box */}
          <div className="relative flex-1 text-left">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search keys or values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[var(--border)] bg-[var(--background)]/60 rounded-lg text-xs font-sans placeholder-[var(--muted)] text-[var(--heading)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all duration-150 h-8 font-medium"
            />
          </div>

          {/* Filter Namespace */}
          <div className="relative text-left">
            <select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              className="pl-3 pr-7 py-1.5 border border-[var(--border)] bg-[var(--background)]/60 rounded-lg text-xs font-sans text-[var(--heading)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all duration-150 appearance-none cursor-pointer h-8 font-bold"
            >
              <option value="all">All Namespaces</option>
              {namespaces.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
            <Filter
              size={11}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
            />
          </div>
        </div>

        {/* Memory Grid */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 text-left scrollbar-thin">
          {Object.keys(filteredMemory).map((ns) => (
            <div key={ns} className="flex flex-col gap-2 text-left">
              {/* Namespace divider */}
              <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]/40 select-none leading-none">
                <span className="text-[9px] font-bold uppercase font-mono tracking-wider text-[var(--primary)]">
                  Namespace: {ns}
                </span>
                <span className="text-[8px] font-mono text-[var(--muted)] font-bold leading-none">
                  {Object.keys(filteredMemory[ns]).length} variables
                </span>
              </div>

              {/* Memory Cards Grid */}
              <div className="grid grid-cols-1 gap-2.5 text-left">
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
            <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] text-center bg-[var(--surface-hover)]">
              <AlertCircle size={22} className="text-[var(--muted)] mb-2 animate-pulse" />
              <span className="text-xs font-bold leading-none">No memory entries found</span>
              <p className="text-[9px] text-[var(--muted)] max-w-[200px] mt-2 leading-relaxed font-sans font-medium">
                {search
                  ? 'No entries match your search criteria'
                  : 'Start executing tasks to allocate shared memory entries'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Statistics */}
        <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] font-sans select-none leading-none flex-shrink-0">
          <span>Namespaces: {namespaces.length}</span>
          <span>Entries: {totalEntries}</span>
        </div>
      </div>
    </div>
  )
}
export default SharedMemoryPanel
