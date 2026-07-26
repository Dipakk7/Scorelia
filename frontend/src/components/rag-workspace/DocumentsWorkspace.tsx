import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { MOCK_UPLOAD_QUEUE } from '@/data/ragDocumentsMockData'
import type { DocumentItem, DocumentStatus, UploadQueueItem } from '@/data/ragDocumentsMockData'
import { useRAGDocuments } from '@/hooks/useRAGDocuments'
import { DocumentsHeader } from './DocumentsHeader'
import { DocumentsToolbar } from './DocumentsToolbar'
import { UploadQueue } from './UploadQueue'
import { DocumentsTable } from './DocumentsTable'
import { DocumentPreviewDrawer } from './DocumentPreviewDrawer'
import { EmptyDocumentsState } from './EmptyDocumentsState'
import { cn } from '@/lib/utils'

export interface DocumentsWorkspaceProps {
  className?: string
}

export function DocumentsWorkspace({ className }: DocumentsWorkspaceProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const { documents, deleteDocument } = useRAGDocuments()

  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>(MOCK_UPLOAD_QUEUE)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [sortOption, setSortOption] = useState('newest')
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null)

  // Filtered & Sorted Documents
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesSearch =
          !searchQuery ||
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.extractedTextSnippet.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortOption === 'name') return a.name.localeCompare(b.name)
        if (sortOption === 'chunks') return b.chunkCount - a.chunkCount
        return 0 // default newest
      })
  }, [documents, searchQuery, statusFilter, sortOption])

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument(id)
    if (selectedDocument?.id === id) setSelectedDocument(null)
  }

  const handleUploadClick = () => {
    const newUpload: UploadQueueItem = {
      id: `up-${Date.now()}`,
      filename: `New_Document_${Date.now().toString().slice(-4)}.pdf`,
      fileSize: '2.1 MB',
      progress: 15,
      status: 'uploading',
      eta: '8s remaining'
    }
    setUploadQueue((prev) => [newUpload, ...prev])
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
      aria-label="Documents Workspace"
      className={cn('space-y-6 text-left', className)}
    >
      {/* 1. Header */}
      <DocumentsHeader
        indexedCount={documents.filter((d) => d.status === 'Indexed').length}
        processingCount={documents.filter((d) => d.status === 'Processing').length}
        failedCount={documents.filter((d) => d.status === 'Failed').length}
      />

      {/* 2. Toolbar */}
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onUploadClick={handleUploadClick}
      />

      {/* 3. Upload Queue */}
      <UploadQueue
        items={uploadQueue}
        onItemAction={(id, action) => {
          if (action === 'cancel') setUploadQueue((prev) => prev.filter((u) => u.id !== id))
        }}
      />

      {/* 4. Documents Table or Empty State */}
      {filteredDocuments.length > 0 ? (
        <DocumentsTable
          documents={filteredDocuments}
          onSelectDocument={setSelectedDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      ) : (
        <EmptyDocumentsState onUploadClick={handleUploadClick} />
      )}

      {/* 5. Document Preview Drawer */}
      {selectedDocument && (
        <DocumentPreviewDrawer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDeleteDocument={handleDeleteDocument}
        />
      )}
    </motion.div>
  )
}

export default DocumentsWorkspace
