import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useAgents } from '@/hooks/useAgents'
import { mockAgentsData, type AgentConsoleItem, type AgentStatus } from '@/data/agentConsoleMockData'
import { WorkspaceHeader } from './WorkspaceHeader'
import { WorkspaceToolbar } from './WorkspaceToolbar'
import type { StatusFilterValue, SortFieldValue, ViewModeValue } from './WorkspaceToolbar'
import { AgentsTable } from './AgentsTable'
import { AgentGridView } from './AgentGridView'
import { Pagination } from './Pagination'
import { AgentDetailsDrawer } from './AgentDetailsDrawer'
import { EmptyAgentsState } from './EmptyAgentsState'
import { AgentTableSkeleton } from './AgentTableSkeleton'
import { cn } from '@/lib/utils'

export interface AgentManagementWorkspaceProps {
  className?: string
  isLoading?: boolean
  onCreateAgentClick?: () => void
}

export function AgentManagementWorkspace({
  className,
  isLoading: propIsLoading = false,
  onCreateAgentClick,
}: AgentManagementWorkspaceProps) {
  const { agents: queryAgents, isLoading: queryIsLoading, updateStatus, deleteAgent } = useAgents()

  const [agentsList, setAgentsList] = useState<AgentConsoleItem[]>(mockAgentsData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all')
  const [sortField, setSortField] = useState<SortFieldValue>('name')
  const [viewMode, setViewMode] = useState<ViewModeValue>('table')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Drawer state
  const [selectedAgent, setSelectedAgent] = useState<AgentConsoleItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (queryAgents && queryAgents.length > 0) {
      const mapped = queryAgents.map((a: any) => ({
        ...a,
        status: ((a.status || 'active') as string).toLowerCase() as AgentStatus,
        tags: a.tags || [a.category || 'General'],
        memoryUsage: a.memoryUsage || '42 MB',
        apiCallCount: a.apiCallCount || (a.tasksCompleted ? a.tasksCompleted * 3 : 120),
        tasksCompleted: a.tasksCompleted ?? 0,
        successRate: a.successRate ?? 0,
        avgResponseTime: a.avgResponseTime || '0.5s',
        lastActive: a.lastActive || 'Just now',
        description: a.description || '',
        category: a.category || 'General',
        iconBg: a.iconBg || 'bg-purple-600',
      }))
      setAgentsList(mapped)
    } else {
      setAgentsList(mockAgentsData)
    }
  }, [queryAgents])

  // Memoized handlers
  const handleTogglePause = useCallback(async (agentId: string) => {
    setAgentsList((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          const nextStatus: AgentStatus = agent.status === 'paused' ? 'active' : 'paused'
          return { ...agent, status: nextStatus }
        }
        return agent
      })
    )

    setSelectedAgent((prev) =>
      prev && prev.id === agentId ? { ...prev, status: prev.status === 'paused' ? 'active' : 'paused' } : prev
    )

    const target = agentsList.find((a) => a.id === agentId)
    const nextStatus = target?.status === 'paused' ? 'active' : 'paused'
    await updateStatus({ id: agentId, status: nextStatus as any })
  }, [agentsList, updateStatus])

  const handleDeleteAgent = useCallback(async (agentId: string) => {
    setAgentsList((prev) => prev.filter((a) => a.id !== agentId))

    setSelectedAgent((prev) => {
      if (prev?.id === agentId) {
        setIsDrawerOpen(false)
        return null
      }
      return prev
    })

    await deleteAgent(agentId)
  }, [deleteAgent])

  const handleOpenDetails = useCallback((agent: AgentConsoleItem) => {
    setSelectedAgent(agent)
    setIsDrawerOpen(true)
  }, [])

  // Filter & Sort Pipeline
  const filteredAgents = useMemo(() => {
    return (agentsList || []).filter((agent) => {
      if (statusFilter !== 'all' && agent.status !== statusFilter) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = agent.name?.toLowerCase().includes(q) || false
        const descMatch = agent.description?.toLowerCase().includes(q) || false
        const catMatch = agent.category?.toLowerCase().includes(q) || false
        const tagMatch = agent.tags?.some((t) => t.toLowerCase().includes(q)) || false
        return nameMatch || descMatch || catMatch || tagMatch
      }

      return true
    })
  }, [agentsList, statusFilter, searchQuery])

  const sortedAgents = useMemo(() => {
    return [...filteredAgents].sort((a, b) => {
      if (sortField === 'name') {
        return (a.name || '').localeCompare(b.name || '')
      }
      if (sortField === 'tasksCompleted') {
        return (b.tasksCompleted ?? 0) - (a.tasksCompleted ?? 0)
      }
      if (sortField === 'successRate') {
        return (b.successRate ?? 0) - (a.successRate ?? 0)
      }
      if (sortField === 'avgResponseTime') {
        return parseFloat(a.avgResponseTime || '0') - parseFloat(b.avgResponseTime || '0')
      }
      if (sortField === 'lastActive') {
        return (a.lastActive || '').localeCompare(b.lastActive || '')
      }
      return 0
    })
  }, [filteredAgents, sortField])

  // Pagination slicing
  const totalItems = sortedAgents.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedAgents.slice(start, start + pageSize)
  }, [sortedAgents, currentPage, pageSize])

  const activeCount = useMemo(
    () => (agentsList || []).filter((a) => a.status === 'active' || a.status === 'running').length,
    [agentsList]
  )
  const pausedCount = useMemo(
    () => (agentsList || []).filter((a) => a.status === 'paused').length,
    [agentsList]
  )

  if (propIsLoading) {
    return <AgentTableSkeleton className={className} />
  }

  return (
    <section
      aria-label="Agent Management Workspace"
      className={cn('p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-5 text-left', className)}
    >
      {/* 1. Workspace Header */}
      <WorkspaceHeader
        totalCount={agentsList.length}
        activeCount={activeCount}
        pausedCount={pausedCount}
      />

      {/* 2. Workspace Toolbar */}
      <WorkspaceToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q)
          setCurrentPage(1)
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(f) => {
          setStatusFilter(f)
          setCurrentPage(1)
        }}
        sortField={sortField}
        onSortFieldChange={setSortField}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateAgentClick={onCreateAgentClick}
      />

      {/* 3. Main Table / Grid View or Empty State */}
      {paginatedAgents.length === 0 ? (
        <EmptyAgentsState
          onResetFilters={() => {
            setSearchQuery('')
            setStatusFilter('all')
          }}
          onCreateAgent={onCreateAgentClick}
        />
      ) : viewMode === 'table' ? (
        <AgentsTable
          agents={paginatedAgents}
          searchQuery={searchQuery}
          onOpenDetails={handleOpenDetails}
          onTogglePause={handleTogglePause}
          onDeleteAgent={handleDeleteAgent}
        />
      ) : (
        <AgentGridView
          agents={paginatedAgents}
          searchQuery={searchQuery}
          onOpenDetails={handleOpenDetails}
          onTogglePause={handleTogglePause}
          onDeleteAgent={handleDeleteAgent}
        />
      )}

      {/* 4. Pagination Footer */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
        />
      )}

      {/* 5. Slide-Over Agent Details Drawer */}
      <AgentDetailsDrawer
        agent={selectedAgent}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onTogglePause={handleTogglePause}
        onDeleteAgent={handleDeleteAgent}
      />
    </section>
  )
}

export default AgentManagementWorkspace
