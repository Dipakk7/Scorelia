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
import { CollectionStoragePanel } from './CollectionStoragePanel'
import { ActivityFeed } from './ActivityFeed'
import { FolderArchive, HardDrive, Layers, Plus, Server } from 'lucide-react'
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

  // Aggregate stats
  const totalCollections = collections.length
  const totalChunks = collections.reduce((acc, c) => acc + c.chunkCount, 0)
  const totalStorageFormatted = '11.5 GB'

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
      {/* 1. Collections Header Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted)] font-medium">Knowledge Collections</div>
            <div className="text-xl font-bold text-[var(--heading)] mt-0.5">{totalCollections} Active</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FolderArchive size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted)] font-medium">Vector Storage Used</div>
            <div className="text-xl font-bold text-[var(--heading)] mt-0.5">{totalStorageFormatted}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HardDrive size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted)] font-medium">Total Vector Chunks</div>
            <div className="text-xl font-bold text-[var(--heading)] mt-0.5">{totalChunks.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted)] font-medium">Vector Engine</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online (HNSW)
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server size={20} />
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Toolbar, Inline Create & Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
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

            {!isCreating && (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer shrink-0 border-none"
              >
                <Plus size={15} />
                <span>New Collection</span>
              </button>
            )}
          </div>

          {/* Inline Create Form Modal */}
          {isCreating && (
            <form onSubmit={handleCreateCollection} className="p-4 rounded-2xl bg-[var(--surface)] border border-purple-500/30 space-y-3">
              <h4 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">Create New Collection</h4>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. System Architecture Docs"
                  className="flex-1 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--heading)] placeholder-[var(--muted)]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold disabled:opacity-50 cursor-pointer border-none"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-2.5 rounded-xl bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] text-xs font-semibold cursor-pointer border-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Main Table or Grid View */}
          {filteredCollections.length > 0 ? (
            <div className="space-y-4">
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
            </div>
          ) : (
            <EmptyCollectionsState onCreateCollection={() => setIsCreating(true)} />
          )}
        </div>

        {/* Right Column: Storage Allocation Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <CollectionStoragePanel />
        </div>
      </div>

      {/* 3. Featured Full-Width Operational Audit Log & Event Stream */}
      <div className="pt-2">
        <ActivityFeed variant="full" />
      </div>

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

