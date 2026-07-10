import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
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
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-450 border-blue-500/20'
      case 'agent_finished':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20'
      case 'agent_failed':
        return 'bg-rose-500/10 text-rose-650 dark:text-rose-450 border-rose-500/20'
      case 'tool_called':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-450 border-purple-500/20'
      case 'workflow_completed':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20'
      default:
        return 'bg-slate-500/10 text-slate-655 dark:text-slate-400 border-slate-500/20'
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
    <Card className={cn('border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs flex flex-col', className)}>
      <CardHeader className="pb-4 border-b border-border/60 text-left flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-left">
          <Terminal size={18} className="text-brand-500" />
          <div className="text-left">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground m-0 leading-none">
              Execution Logs Console
            </CardTitle>
            <span className="text-[9px] text-muted-foreground font-sans block mt-1.5 leading-none">
              System audit events tracking task dispatcher lifecycle
            </span>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-card/50 hover:bg-slate-105 hover:border-brand-500/35 border border-border rounded-xl transition-all duration-150 cursor-pointer focus:outline-none"
        >
          <Download size={12} />
          <span>Export Logs</span>
        </button>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-4 flex-1 overflow-hidden text-left">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 text-left">
          <div className="relative flex-1 text-left">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs summary, payloads, agent id..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-9 pr-3 py-1.5 border border-border bg-white/70 dark:bg-slate-900/50 rounded-xl text-xs font-sans placeholder-slate-405 text-slate-750 dark:text-slate-205 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all duration-150 shadow-2xs h-9 font-medium"
            />
          </div>

          <div className="flex gap-2 text-left">
            <div className="relative text-left">
              <select
                value={eventTypeFilter}
                onChange={(e) => {
                  setEventTypeFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-3 pr-8 py-1.5 border border-border bg-white/70 dark:bg-slate-900/50 rounded-xl text-xs font-sans text-slate-750 dark:text-slate-205 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all duration-150 appearance-none cursor-pointer shadow-2xs h-9 font-bold"
              >
                <option value="all">All Events</option>
                <option value="agent_started">agent_started</option>
                <option value="agent_finished">agent_finished</option>
                <option value="agent_failed">agent_failed</option>
                <option value="tool_called">tool_called</option>
                <option value="workflow_completed">workflow_completed</option>
              </select>
              <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-x-auto rounded-xl border border-border shadow-2xs scrollbar-thin text-left">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs font-sans select-none text-left">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border/40 uppercase tracking-widest text-[9px] font-black text-left">
                <th className="py-2.5 px-4 w-40 text-left">Timestamp</th>
                <th className="py-2.5 px-4 w-36 text-left">Event Type</th>
                <th className="py-2.5 px-4 w-40 text-left">Target Agent</th>
                <th className="py-2.5 px-4 text-left">Summary</th>
                <th className="py-2.5 px-4 w-12 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-left">
              {paginatedEvents.map((evt) => {
                const isExpanded = expandedEventId === evt.event_id
                return (
                  <React.Fragment key={evt.event_id}>
                    <tr
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.event_id)}
                      className={cn(
                        'hover:bg-muted/30 cursor-pointer transition-colors duration-150 text-left',
                        isExpanded ? 'bg-muted/10' : ''
                      )}
                    >
                      <td className="py-2.5 px-4 font-mono text-[10px] font-medium text-muted-foreground text-left">
                        {new Date(evt.timestamp).toLocaleTimeString()} ({new Date(evt.timestamp).toLocaleDateString()})
                      </td>
                      <td className="py-2.5 px-4 text-left">
                        <span className={cn('px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider font-mono font-bold leading-none inline-block', getBadgeClass(evt.event_type))}>
                           {evt.event_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[10px] font-bold text-foreground text-left">
                        {evt.agent_id || 'orchestrator'}
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground font-medium text-left">
                        {formatSummary(evt)}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {isExpanded ? <ChevronUp size={14} className="text-slate-400 inline" /> : <ChevronDown size={14} className="text-slate-400 inline" />}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-muted/20 border-y border-border text-foreground text-left">
                        <td colSpan={5} className="p-4 font-mono text-[10px] leading-normal select-text text-left">
                          <div className="flex flex-col gap-2 text-left">
                            <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-1.5 mb-1 leading-none font-bold">
                              <span>EVENT CORRELATION: {evt.request_id}</span>
                              <span>EVENT ID: {evt.event_id}</span>
                            </div>
                            <pre className="overflow-x-auto max-h-56 p-1.5 scrollbar-thin text-success text-left m-0 font-medium">
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
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-left">
                    <AlertCircle size={24} className="mx-auto text-slate-350 mb-2 animate-bounce" />
                    <span className="text-xs font-bold leading-none">No events logged matching filter queries</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-sans leading-none select-none">
            <span className="text-muted-foreground normal-case font-medium">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredEvents.length)} of {filteredEvents.length} logs
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 bg-card border border-slate-200 dark:border-slate-805 hover:border-brand-500/35 hover:bg-brand-500/5 rounded-xl text-slate-550 dark:text-slate-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none transition-all font-bold select-none leading-none"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-mono text-slate-655 normal-case font-extrabold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 bg-card border border-slate-200 dark:border-slate-805 hover:border-brand-500/35 hover:bg-brand-500/5 rounded-xl text-slate-550 dark:text-slate-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none transition-all font-bold select-none leading-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default ExecutionLogTable
