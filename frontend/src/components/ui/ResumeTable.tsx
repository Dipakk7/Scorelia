import { useState, useMemo } from 'react'
import { CountUpText } from '@/components/ui/CountUpText'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '@/components/ui/Dropdown'
import { SearchBox } from '@/components/ui/SearchBox'
import { Pagination } from '@/components/ui/Pagination'
import DeleteDialog from '@/components/ui/DeleteDialog'
import type { ResumeResponse } from '@/types/resume'
import {
  MoreVertical,
  Eye,
  Edit3,
  Download,
  Trash2,
  Play,
  ArrowUpDown,
  Filter,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'

interface ResumeTableProps {
  resumes: ResumeResponse[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
  onBulkDelete: (ids: string[]) => Promise<void>
  onDownload: (id: string) => void
  onAnalyze: (id: string) => void
  onRename: (id: string, newName: string) => Promise<void>
}

export default function ResumeTable({
  resumes,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onDownload,
  onAnalyze,
  onRename,
}: ResumeTableProps) {
  // Search, Sort, Filter, Page states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<'name' | 'date' | 'score' | 'size'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Inline rename states
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Delete dialog states
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Status mapping colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'parsed':
        return 'success'
      case 'failed':
        return 'error'
      case 'parsing':
      case 'uploaded':
        return 'warning'
      default:
        return 'default'
    }
  }

  // Handle Select All
  const handleSelectAll = (checked: boolean, pageItems: ResumeResponse[]) => {
    const newSelected = new Set(selectedIds)
    pageItems.forEach((item) => {
      if (checked) {
        newSelected.add(item.id)
      } else {
        newSelected.delete(item.id)
      }
    })
    setSelectedIds(newSelected)
  }

  // Handle Select Row
  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  // Sort and Filter logic
  const filteredAndSortedResumes = useMemo(() => {
    let result = [...resumes]

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((r) => r.original_filename.toLowerCase().includes(q))
    }

    // Status Filter
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status.toLowerCase() === statusFilter)
    }

    // Type Filter
    if (typeFilter !== 'all') {
      result = result.filter((r) => r.file_type.toLowerCase() === typeFilter)
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'name') {
        comparison = a.original_filename.localeCompare(b.original_filename)
      } else if (sortField === 'date') {
        comparison = new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
      } else if (sortField === 'score') {
        const scoreA = a.ats_score ?? -1
        const scoreB = b.ats_score ?? -1
        comparison = scoreA - scoreB
      } else if (sortField === 'size') {
        comparison = a.file_size - b.file_size
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [resumes, searchQuery, statusFilter, typeFilter, sortField, sortDirection])

  // Pagination bounds
  const paginatedResumes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAndSortedResumes.slice(start, start + itemsPerPage)
  }, [filteredAndSortedResumes, currentPage])

  const totalPages = Math.ceil(filteredAndSortedResumes.length / itemsPerPage)

  const handleSort = (field: 'name' | 'date' | 'score' | 'size') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  // Inline rename submit
  const submitRename = async (id: string) => {
    if (!renameValue.trim()) return
    try {
      await onRename(id, renameValue.trim())
      setRenamingId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const allPageItemsSelected = useMemo(() => {
    if (paginatedResumes.length === 0) return false
    return paginatedResumes.every((item) => selectedIds.has(item.id))
  }, [paginatedResumes, selectedIds])

  return (
    <div className="space-y-4">
      {/* Filters & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-4 border border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-sm)]">
        <div className="w-full md:max-w-md">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search resumes by file name..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 font-sans">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Filter size={14} />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-[var(--surface-hover)] border border-[var(--border)] px-2 py-1 rounded-lg outline-none cursor-pointer focus:border-[var(--primary)] text-[var(--body)]"
            >
              <option value="all">All Statuses</option>
              <option value="parsed">Parsed</option>
              <option value="uploading">Uploading</option>
              <option value="uploaded">Uploaded</option>
              <option value="parsing">Parsing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-[var(--surface-hover)] border border-[var(--border)] px-2 py-1 rounded-lg outline-none cursor-pointer focus:border-[var(--primary)] text-[var(--body)]"
            >
              <option value="all">All Formats</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-[var(--radius-card)] font-sans animate-slideIn">
          <span className="text-xs text-[var(--primary)] font-semibold pl-1">
            {selectedIds.size} {selectedIds.size === 1 ? 'resume' : 'resumes'} selected
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsBulkDeleteDialogOpen(true)}
            className="flex items-center gap-1.5 bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90 font-semibold py-1 px-3 text-xs rounded-lg cursor-pointer border-none"
          >
            <Trash2 size={13} />
            <span>Delete Selected</span>
          </Button>
        </div>
      )}

      {/* Main Table */}
      {filteredAndSortedResumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] min-h-[260px] shadow-[var(--shadow-sm)]">
          <AlertCircle className="text-slate-400 dark:text-slate-650 mb-3" size={32} />
          <h4 className="text-sm font-semibold font-display text-[var(--heading)]">
            No matches found
          </h4>
          <p className="text-xs text-[var(--muted)] mt-1 max-w-xs text-center font-sans">
            Try adjusting your search queries or clearing active status and format filters.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-sm)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center pl-4">
                  <input
                    type="checkbox"
                    checked={allPageItemsSelected}
                    onChange={(e) => handleSelectAll(e.target.checked, paginatedResumes)}
                    className="h-4 w-4 rounded border-input text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>File Name</span>
                    <ArrowUpDown size={12} className="text-[var(--muted)]" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('size')}>
                  <div className="flex items-center gap-1">
                    <span>Size</span>
                    <ArrowUpDown size={12} className="text-[var(--muted)]" />
                  </div>
                </TableHead>
                <TableHead className="uppercase">Type</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    <span>Uploaded At</span>
                    <ArrowUpDown size={12} className="text-[var(--muted)]" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('score')}>
                  <div className="flex items-center gap-1">
                    <span>ATS Score</span>
                    <ArrowUpDown size={12} className="text-[var(--muted)]" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResumes.map((resume) => {
                const isSelected = selectedIds.has(resume.id)
                const isRenaming = renamingId === resume.id

                return (
                  <TableRow key={resume.id} className={isSelected ? 'bg-[var(--surface-hover)]' : ''}>
                    {/* Selection Checkbox */}
                    <TableCell className="text-center pl-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(resume.id, e.target.checked)}
                        className="h-4 w-4 rounded border-input text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                      />
                    </TableCell>

                    {/* File Name (Inline Rename support) */}
                    <TableCell className="font-semibold text-[var(--heading)] max-w-[240px] truncate">
                      {isRenaming ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="h-8 py-0 px-2 text-xs font-sans"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') submitRename(resume.id)
                              if (e.key === 'Escape') setRenamingId(null)
                            }}
                          />
                          <button
                            onClick={() => submitRename(resume.id)}
                            className="p-1 bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 rounded cursor-pointer border-none"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setRenamingId(null)}
                            className="p-1 bg-[var(--surface-hover)] text-[var(--muted)] hover:bg-[var(--surface-hover)] rounded cursor-pointer border-none"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <span
                          className="hover:text-[var(--primary)] cursor-pointer transition-colors"
                          onClick={() => onView(resume.id)}
                          onDoubleClick={() => {
                            setRenamingId(resume.id)
                            setRenameValue(resume.original_filename)
                          }}
                          title="Double-click to rename"
                        >
                          {resume.original_filename}
                        </span>
                      )}
                    </TableCell>

                    {/* Size */}
                    <TableCell>{formatFileSize(resume.file_size)}</TableCell>

                    {/* Format Type */}
                    <TableCell className="uppercase font-sans font-medium text-xs">
                      {resume.file_type}
                    </TableCell>

                    {/* Upload date */}
                    <TableCell className="text-muted-foreground text-xs text-[var(--muted)]">
                      {new Date(resume.uploaded_at).toLocaleString()}
                    </TableCell>

                    {/* ATS score badge */}
                    <TableCell>
                      {resume.ats_score !== null ? (
                        <span className="font-bold font-display text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-lg border border-[var(--primary)]/20">
                          <CountUpText value={resume.ats_score} suffix="/100" />
                        </span>
                      ) : (
                        <span className="text-[var(--muted)] font-sans">-</span>
                      )}
                    </TableCell>

                    {/* Parsing status */}
                    <TableCell>
                      <Badge variant={getStatusColor(resume.status)} className="capitalize text-[10px]">
                        {resume.status}
                      </Badge>
                    </TableCell>

                    {/* Row level Actions Dropdown */}
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button
                          onClick={() => onView(resume.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer border-none"
                          title="Quick View"
                        >
                          <Eye size={14} />
                        </button>
                        <Dropdown>
                          <DropdownTrigger asChild>
                            <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer border-none">
                              <MoreVertical size={14} />
                            </button>
                          </DropdownTrigger>
                          <DropdownContent align="end" className="w-40">
                            <DropdownItem
                              onClick={() => {
                                setRenamingId(resume.id)
                                setRenameValue(resume.original_filename)
                              }}
                              className="flex items-center gap-2 cursor-pointer text-xs"
                            >
                              <Edit3 size={12} />
                              <span>Rename</span>
                            </DropdownItem>

                            {resume.status.toLowerCase() !== 'failed' && (
                              <DropdownItem
                                onClick={() => onEdit(resume.id)}
                                className="flex items-center gap-2 cursor-pointer text-xs"
                              >
                                <Edit3 size={12} className="text-blue-500" />
                                <span>Edit Parse</span>
                              </DropdownItem>
                            )}

                            {resume.status.toLowerCase() === 'parsed' && (
                              <DropdownItem
                                onClick={() => onAnalyze(resume.id)}
                                className="flex items-center gap-2 cursor-pointer text-xs"
                              >
                                <Play size={12} className="text-primary" />
                                <span>Analyze ATS</span>
                              </DropdownItem>
                            )}

                            <DropdownItem
                              onClick={() => onDownload(resume.id)}
                              className="flex items-center gap-2 cursor-pointer text-xs"
                            >
                              <Download size={12} className="text-emerald-500" />
                              <span>Download File</span>
                            </DropdownItem>

                            <DropdownSeparator />

                            <DropdownItem
                              onClick={() => setDeleteTargetId(resume.id)}
                              className="flex items-center gap-2 cursor-pointer text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 font-semibold animate-fadeIn"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </DropdownItem>
                          </DropdownContent>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Table Footer / Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-hover)] flex justify-between items-center">
              <span className="text-xs font-sans text-muted-foreground text-[var(--muted)]">
                Showing {paginatedResumes.length} of {filteredAndSortedResumes.length} resumes
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Confirmation delete modals */}
      <DeleteDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={async () => {
          if (deleteTargetId) {
            await onDelete(deleteTargetId)
            setSelectedIds((prev) => {
              const next = new Set(prev)
              next.delete(deleteTargetId)
              return next
            })
          }
        }}
      />

      <DeleteDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        title="Delete Multiple Resumes"
        description={`Are you sure you want to delete the ${selectedIds.size} selected resumes? This action is permanent and cannot be undone.`}
        requireConfirmationText={true}
        confirmWord="DELETE ALL"
        onConfirm={async () => {
          const ids = Array.from(selectedIds)
          await onBulkDelete(ids)
          setSelectedIds(new Set())
        }}
      />
    </div>
  )
}
