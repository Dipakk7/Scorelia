import React, { useState, useMemo } from 'react'
import { Terminal, Search, Filter, Download, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import type { AgentEvent } from '@/types/agent'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ExecutionLogTableProps {
  events: AgentEvent[]
  className?: string
}

export const ExecutionLogTable: React.FC<ExecutionLogTableProps> = ({ events, className }) => {
  const [search, setSearch] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)
  
  // Pagination / Slicing
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  // Filter logs
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const typeMatches = eventTypeFilter === 'all' || evt.event_type === eventTypeFilter

      const stringifiedPayload = JSON.stringify(evt.payload || {})
      const searchMatches =
        search === '' ||
        evt.event_id.toLowerCase().includes(search.toLowerCase()) ||
        evt.event_type.toLowerCase().includes(search.toLowerCase()) ||
        (evt.agent_id || '').toLowerCase().includes(search.toLowerCase()) ||
        (evt.agent_name || '').toLowerCase().includes(search.toLowerCase()) ||
        stringifiedPayload.toLowerCase().includes(search.toLowerCase())

      return typeMatches && searchMatches
    })
  }, [events, eventTypeFilter, search])

  // Paginated Slicing for performance (virtualization feel)
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredEvents.slice(startIndex, startIndex + pageSize)
  }, [filteredEvents, currentPage])

  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1

  // Handle export logs to JSON file
  const handleExport = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute('download', `agent_operations_console_logs_${new Date().toISOString()}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      toast.success('System audit logs exported successfully!')
    } catch {
      toast.error('Failed to export logs.')
    }
  }

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'agent_started':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'agent_finished':
        return 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20'
      case 'agent_failed':
        return 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20'
      case 'tool_called':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      case 'workflow_completed':
        return 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20'
      default:
        return 'bg-muted text-muted-foreground border-[var(--border)]/40'
    }
  }

  const formatSummary = (evt: AgentEvent) => {
    switch (evt.event_type) {
      case 'agent_started':
        return `Agent [${evt.agent_name || evt.agent_id}] initiated task processing.`
      case 'agent_finished':
        return `Agent [${evt.agent_name || evt.agent_id}] finished execution in ${evt.payload.duration_ms?.toFixed(0) || '0'}ms.`
      case 'agent_failed':
        return `Agent [${evt.agent_name || evt.agent_id}] failed task execution. Error details: ${evt.payload.error || 'Unknown error'}.`
      case 'tool_called':
        return `Invoked tool [${evt.payload.tool_name}] with parameter arguments.`
      case 'workflow_completed':
        return `Workflow execution finished successfully in ${evt.payload.duration_ms?.toFixed(0) || '0'}ms.`
      default:
        return `Event payload logged on event bus.`
    }
  }

  return (
    <div className={cn('flex flex-col h-full text-left font-sans text-xs bg-transparent', className)}>
      {/* Header Panel */}
      <div className="pb-3 border-b border-[var(--border)]/60 flex items-center justify-between gap-4 flex-shrink-0 select-none">
        <div className="flex items-center gap-2 text-left">
          <Terminal size={15} className="text-[var(--primary)] animate-pulse" />
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
              Execution Logs Console
            </h4>
            <span className="text-[8px] text-[var(--muted)] font-sans block mt-1.5 leading-none">
              System audit events tracking task dispatcher lifecycle
            </span>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg transition-all duration-150 cursor-pointer focus:outline-none"
        >
          <Download size={11} />
          <span>Export Logs</span>
        </button>
      </div>

      <div className="flex flex-col gap-3.5 flex-grow overflow-hidden mt-4 text-left min-h-0">
        {/* Filters */}
        <div className="flex gap-2 text-left select-none">
          <div className="relative flex-1 text-left">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search logs summary, payloads, agent id..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-8 pr-3 py-1.5 border border-[var(--border)] bg-[var(--background)]/60 rounded-lg text-xs font-sans placeholder-[var(--muted)] text-[var(--heading)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all duration-150 h-8 font-medium"
            />
          </div>

          <div className="relative text-left">
            <select
              value={eventTypeFilter}
              onChange={(e) => {
                setEventTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-3 pr-7 py-1.5 border border-[var(--border)] bg-[var(--background)]/60 rounded-lg text-xs font-sans text-[var(--heading)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all duration-150 appearance-none cursor-pointer h-8 font-bold"
            >
              <option value="all">All Events</option>
              <option value="agent_started">agent_started</option>
              <option value="agent_finished">agent_finished</option>
              <option value="agent_failed">agent_failed</option>
              <option value="tool_called">tool_called</option>
              <option value="workflow_completed">workflow_completed</option>
            </select>
            <Filter size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto rounded-lg border border-[var(--border)]/65 scrollbar-thin text-left">
          <table className="w-full text-left border-collapse min-w-[500px] text-[11px] font-sans select-none">
            <thead>
              <tr className="bg-[var(--surface-hover)] text-[var(--muted)] border-b border-[var(--border)]/55 uppercase tracking-widest text-[8px] font-black text-left">
                <th className="py-2 px-3 w-32 text-left">Timestamp</th>
                <th className="py-2 px-3 w-28 text-left">Event Type</th>
                <th className="py-2 px-3 w-28 text-left">Target</th>
                <th className="py-2 px-3 text-left">Summary</th>
                <th className="py-2 px-3 w-8 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/30 text-left bg-[var(--surface)]/30">
              {paginatedEvents.map((evt) => {
                const isExpanded = expandedEventId === evt.event_id
                return (
                  <React.Fragment key={evt.event_id}>
                    <tr
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.event_id)}
                      className={cn(
                        'hover:bg-[var(--surface-hover)]/60 cursor-pointer transition-colors duration-150 text-left',
                        isExpanded ? 'bg-[var(--surface-hover)]' : ''
                      )}
                    >
                      <td className="py-2 px-3 font-mono text-[9px] text-[var(--muted)] text-left">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2 px-3 text-left">
                        <span className={cn('px-1.5 py-0.5 rounded border text-[8px] uppercase tracking-wider font-mono font-bold leading-none inline-block', getBadgeClass(evt.event_type))}>
                           {evt.event_type.replace('agent_', '')}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[9px] font-bold text-[var(--heading)] text-left truncate max-w-[90px]">
                        {evt.agent_id || 'orchestrator'}
                      </td>
                      <td className="py-2 px-3 text-[var(--body)] font-medium text-left leading-relaxed">
                        {formatSummary(evt)}
                      </td>
                      <td className="py-2 px-3 text-right text-[var(--muted)]">
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[var(--background)] border-y border-[var(--border)]/40 text-[var(--body)] text-left">
                        <td colSpan={5} className="p-3 font-mono text-[9px] leading-normal select-text text-left">
                          <div className="flex flex-col gap-2 text-left">
                            <div className="flex items-center justify-between text-[var(--muted)] border-b border-[var(--border)]/35 pb-1 mb-1 leading-none font-bold">
                              <span>CORRELATION: {evt.request_id}</span>
                              <span>ID: {evt.event_id}</span>
                            </div>
                            <pre className="overflow-x-auto max-h-56 p-1.5 scrollbar-thin text-emerald-600 dark:text-[var(--success)] text-left m-0 font-medium">
                              {JSON.stringify(evt.payload, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}

              {filteredEvents.length === 0 && (
                <tr className="text-left">
                  <td colSpan={5} className="py-12 text-center text-[var(--muted)]">
                    <AlertCircle size={22} className="mx-auto text-[var(--muted)]/60 mb-2 animate-pulse" />
                    <span className="text-xs font-bold leading-none">No events logged matching filter queries</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/50 text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] font-sans leading-none select-none flex-shrink-0">
            <span className="text-[var(--muted)] normal-case font-medium">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredEvents.length)} of {filteredEvents.length} logs
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-[var(--surface)] border border-[var(--border)]/60 hover:bg-[var(--surface-hover)] rounded-md text-[var(--body)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none transition-all font-bold leading-none"
              >
                Prev
              </button>
              <span className="px-2.5 py-1 font-mono text-[var(--heading)] normal-case font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-[var(--surface)] border border-[var(--border)]/60 hover:bg-[var(--surface-hover)] rounded-md text-[var(--body)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none transition-all font-bold leading-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ExecutionLogTable
