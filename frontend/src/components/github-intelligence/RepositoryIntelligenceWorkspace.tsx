import React, { useState, useMemo } from 'react'
import { githubRepositoriesMockData, type GitHubRepository, type RepositoryStatsSummary } from '@/data/githubRepositoriesMockData'
import { RepositoryStatisticsPanel } from './RepositoryStatisticsPanel'
import { RepositorySearchBar } from './RepositorySearchBar'
import { RepositoryFilterBar } from './RepositoryFilterBar'
import { TopRepositoriesTable } from './TopRepositoriesTable'
import { RepositoryCard } from './RepositoryCard'
import { RepositoryPagination } from './RepositoryPagination'
import { RepositorySkeleton } from './RepositorySkeleton'
import { EmptyRepositoryState } from './EmptyRepositoryState'
import type { SortField, SortOrder } from './RepositorySortMenu'
import { cn } from '@/lib/utils'

export interface RepositoryIntelligenceWorkspaceProps {
  summary?: RepositoryStatsSummary
  repositories?: GitHubRepository[]
  isLoading?: boolean
  isEmpty?: boolean
  onSync?: () => void
  onOpenRepo?: (repo: GitHubRepository) => void
  className?: string
}

export const RepositoryIntelligenceWorkspace: React.FC<RepositoryIntelligenceWorkspaceProps> = ({
  summary = githubRepositoriesMockData.summary,
  repositories = githubRepositoriesMockData.repositories,
  isLoading = false,
  isEmpty = false,
  onSync,
  onOpenRepo,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [healthFilter, setHealthFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('stars')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const handleResetFilters = () => {
    setSearchQuery('')
    setVisibilityFilter('all')
    setLanguageFilter('all')
    setHealthFilter('all')
    setSortField('stars')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const filteredRepositories = useMemo(() => {
    let result = [...repositories]

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.language.toLowerCase().includes(q)
      )
    }

    // Visibility filter
    if (visibilityFilter !== 'all') {
      result = result.filter((r) => r.visibility === visibilityFilter)
    }

    // Language filter
    if (languageFilter !== 'all') {
      result = result.filter((r) => r.language === languageFilter)
    }

    // Health filter
    if (healthFilter !== 'all') {
      result = result.filter((r) => r.health === healthFilter)
    }

    // Sort logic
    result.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = (bVal as string).toLowerCase()
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [repositories, searchQuery, visibilityFilter, languageFilter, healthFilter, sortField, sortOrder])

  // Pagination slicing
  const totalPages = Math.ceil(filteredRepositories.length / pageSize) || 1
  const paginatedRepositories = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRepositories.slice(start, start + pageSize)
  }, [filteredRepositories, currentPage, pageSize])

  if (isLoading) {
    return <RepositorySkeleton />
  }

  if (isEmpty) {
    return <EmptyRepositoryState onSync={onSync} />
  }

  const isFiltered =
    searchQuery !== '' ||
    visibilityFilter !== 'all' ||
    languageFilter !== 'all' ||
    healthFilter !== 'all'

  return (
    <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 w-full text-left font-sans', className)}>
      {/* 1. Statistics Panel */}
      <RepositoryStatisticsPanel summary={summary} />

      {/* 2. Search & Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-sm">
        <div className="flex-1 w-full md:max-w-md lg:max-w-lg">
          <RepositorySearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <RepositoryFilterBar
          visibilityFilter={visibilityFilter}
          onVisibilityChange={setVisibilityFilter}
          languageFilter={languageFilter}
          onLanguageChange={setLanguageFilter}
          healthFilter={healthFilter}
          onHealthChange={setHealthFilter}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field)
            setSortOrder(order)
          }}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 3. Table (Desktop/Laptop) vs Card View (Mobile) */}
      {filteredRepositories.length === 0 ? (
        <EmptyRepositoryState
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onSync={onSync}
        />
      ) : (
        <>
          {/* Desktop/Tablet Table */}
          <div className="hidden md:block w-full">
            <TopRepositoriesTable repositories={paginatedRepositories} onOpenRepo={onOpenRepo} />
          </div>

          {/* Mobile Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:hidden w-full">
            {paginatedRepositories.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} onOpenRepo={onOpenRepo} />
            ))}
          </div>

          {/* 4. Pagination */}
          <RepositoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRepositories.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
          />
        </>
      )}
    </div>
  )
}

export default RepositoryIntelligenceWorkspace

