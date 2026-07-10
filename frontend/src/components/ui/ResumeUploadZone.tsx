import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Upload, FileText, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react'
import api from '@/api/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface UploadFileItem {
  id: string
  file: File
  progress: number
  status: 'queued' | 'uploading' | 'success' | 'failed'
  error?: string
  cancelToken?: any
  resumeId?: string
}

interface ResumeUploadZoneProps {
  onUploadSuccess: (resume: any) => void
  maxSizeMB?: number
}

export default function ResumeUploadZone({ onUploadSuccess, maxSizeMB = 5 }: ResumeUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<UploadFileItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_EXTENSIONS = ['pdf', 'docx']
  const ALLOWED_MIMES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ]

  const validateFile = (file: File): { ok: boolean; error?: string } => {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_MIMES.includes(file.type)) {
      return { ok: false, error: 'Only PDF and DOCX files are allowed.' }
    }
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      return { ok: false, error: `File size exceeds the limit of ${maxSizeMB}MB.` }
    }
    return { ok: true }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      addFilesToQueue(files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files)
      addFilesToQueue(files)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const addFilesToQueue = (files: File[]) => {
    const newItems: UploadFileItem[] = files.map((file) => {
      const validation = validateFile(file)
      return {
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: validation.ok ? 'queued' : 'failed',
        error: validation.error,
      }
    })

    setUploadQueue((prev) => [...newItems, ...prev])

    // Automatically trigger uploads for valid items
    newItems.forEach((item) => {
      if (item.status === 'queued') {
        uploadFile(item)
      }
    })
  }

  const uploadFile = async (item: UploadFileItem) => {
    // Axios CancelToken for cancellation support
    const source = axios.CancelToken.source()

    setUploadQueue((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', cancelToken: source } : i))
    )

    const formData = new FormData()
    formData.append('file', item.file)

    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadQueue((prev) =>
              prev.map((i) => (i.id === item.id ? { ...i, progress: percentCompleted } : i))
            )
          }
        },
      })

      setUploadQueue((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'success', progress: 100, resumeId: response.data.resume.id }
            : i
        )
      )

      toast.success(`"${item.file.name}" uploaded successfully!`)
      onUploadSuccess(response.data.resume)
    } catch (err: any) {
      if (axios.isCancel(err)) {
        toast.error(`Upload of "${item.file.name}" was cancelled.`)
        setUploadQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'failed', error: 'Upload cancelled.' } : i))
        )
      } else {
        const errorMsg = err?.message || 'Failed to connect to parser service.'
        toast.error(`Failed to upload "${item.file.name}".`)
        setUploadQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'failed', error: errorMsg } : i))
        )
      }
    }
  }

  const cancelUpload = (id: string) => {
    const item = uploadQueue.find((i) => i.id === id)
    if (item && item.cancelToken) {
      item.cancelToken.cancel()
    }
  }

  const retryUpload = (id: string) => {
    const item = uploadQueue.find((i) => i.id === id)
    if (item) {
      uploadFile(item)
    }
  }

  const removeFromQueue = (id: string) => {
    setUploadQueue((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Upload Drag/Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[220px] group shadow-xs hover:shadow-md hover:border-brand-500/60 dark:hover:border-brand-500/50',
          isDragActive
            ? 'border-brand-500 bg-brand-500/8 dark:border-brand-500 dark:bg-brand-950/10'
            : 'border-border bg-card/40 backdrop-blur-md'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx"
          multiple
        />

        <div className="p-4 bg-brand-500/8 text-brand-600 dark:text-brand-400 border border-brand-500/12 rounded-xl mb-4 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500/12">
          <Upload size={28} className="transition-transform" />
        </div>

        <h3 className="text-base font-bold font-display text-foreground mb-1.5">
          Drag and drop your resume here
        </h3>
        <p className="text-sm text-muted-foreground font-sans mb-4 text-center leading-relaxed">
          Or click to browse from your device
        </p>

        <div className="flex items-center gap-4 text-xs font-sans text-slate-400 dark:text-slate-500">
          <span>Supported formats: PDF, DOCX</span>
          <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <span>Max size: {maxSizeMB}MB</span>
        </div>
      </div>

      {/* Upload History / Progress Queue */}
      {uploadQueue.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden bg-card/50">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-display">
              Upload History & Activities
            </h4>
            <button
              onClick={() => setUploadQueue([])}
              className="text-[11px] font-sans text-slate-450 hover:text-slate-650 dark:hover:text-slate-250 cursor-pointer"
            >
              Clear Queue
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {uploadQueue.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                {/* File Icon */}
                <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-450 rounded-lg">
                  <FileText size={18} />
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold font-sans text-foreground truncate pr-4 text-left">
                      {item.file.name}
                    </p>
                    <span className="text-xs font-sans text-muted-foreground">
                      {(item.file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>

                  {item.status === 'uploading' && (
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-600 dark:bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {item.status === 'success' && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-450 font-sans">
                      <CheckCircle2 size={13} />
                      <span>Ready for parsing</span>
                    </div>
                  )}

                  {item.status === 'failed' && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-450 font-sans">
                      <AlertCircle size={13} />
                      <span className="truncate max-w-[250px]" title={item.error}>
                        {item.error || 'Upload failed'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Queue Actions */}
                <div className="flex items-center gap-1">
                  {item.status === 'uploading' && (
                    <button
                      onClick={() => cancelUpload(item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                      title="Cancel Upload"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {item.status === 'failed' && item.error !== 'Only PDF and DOCX files are allowed.' && (
                    <button
                      onClick={() => retryUpload(item.id)}
                      className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg cursor-pointer"
                      title="Retry Upload"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}

                  {item.status !== 'uploading' && (
                    <button
                      onClick={() => removeFromQueue(item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                      title="Remove From List"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
