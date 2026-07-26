import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { CollectionItem, CollectionStatus } from '@/data/ragWorkspaceMockData'
import { useCollections } from '@/hooks/useRAGCollections'
import { CollectionsToolbar } from './CollectionsToolbar'
import type { SortOption, ViewMode } from './CollectionsToolbar'
import { CollectionsTable } from './CollectionsTable'
import { CollectionsPagination } from './CollectionsPagination'
import { CollectionDetailsDrawer } from './CollectionDetailsDrawer'
import { EmptyCollectionsState } from './EmptyCollectionsState'
import { cn } from '@/lib/utils'

export interface CollectionsWorkspaceProps {
  className?: string
}

export function CollectionsWorkspace({ className }: CollectionsWorkspaceProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const { collections, createCollection, deleteCollection } = useCollections()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CollectionStatus | 'all'>('all')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  // Filtered & Sorted Collections
  const filteredCollections = useMemo(() => {
    return collections
      .filter((col) => {
        const matchesSearch =
          !searchQuery ||
          col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          col.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || col.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name)
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name)
        if (sortOption === 'documents') return b.documentCount - a.documentCount
        if (sortOption === 'size') return b.storageBytes - a.storageBytes
        return 0 // default newest
      })
  }, [collections, searchQuery, statusFilter, sortOption])

  // Pagination Math
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage) || 1
  const paginatedCollections = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCollections.slice(start, start + itemsPerPage)
  }, [filteredCollections, currentPage, itemsPerPage])

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return
    await createCollection({ name: newCollectionName, description: 'User-created custom vector collection' })
    setNewCollectionName('')
    setIsCreating(false)
  }

  const handleDeleteCollection = async (id: string) => {
    const col = collections.find((c) => c.id === id)
    if (col) {
      await deleteCollection(col.name)
    }
    if (selectedCollection?.id === id) setSelectedCollection(null)
  }

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Collections Workspace Container"
      className={cn('space-y-6 text-left', className)}
    >
      {/* Top Toolbar */}
      <CollectionsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Inline Create Form Modal */}
      {isCreating && (
        <form onSubmit={handleCreateCollection} className="p-4 rounded-2xl bg-[#0e0f1a] border border-purple-500/30 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Create New Collection</h4>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="e.g. System Architecture Docs"
              className="flex-1 bg-[#121320] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={!newCollectionName.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Table or Grid View */}
      {filteredCollections.length > 0 ? (
        <>
          <CollectionsTable
            collections={paginatedCollections}
            viewMode={viewMode}
            onSelectCollection={setSelectedCollection}
          />

          <CollectionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={itemsPerPage}
            totalItems={filteredCollections.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(count: number) => {
              setItemsPerPage(count)
              setCurrentPage(1)
            }}
          />
        </>
      ) : (
        <EmptyCollectionsState onCreateCollection={() => setIsCreating(true)} />
      )}

      {/* Slide-over Collection Details Drawer */}
      <CollectionDetailsDrawer
        collection={selectedCollection}
        isOpen={!!selectedCollection}
        onClose={() => setSelectedCollection(null)}
      />
    </motion.div>
  )
}

export default CollectionsWorkspace
