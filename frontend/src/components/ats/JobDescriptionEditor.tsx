import React, { useState, useRef } from 'react'
import { Upload, Clipboard, Sparkles, Check, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface JobDescriptionEditorProps {
  value: string
  onChange: (val: string) => void
  onFileSelect?: (file: File) => void
  onSubmit: () => void
  isLoading?: boolean
}

// Quick Import Templates
const TEMPLATES = [
  {
    title: 'Senior Frontend Engineer (React)',
    text: `Job Title: Senior Frontend Engineer
Company: InnovateTech
Location: Remote, US
Employment Type: Full-time

Responsibilities:
- Build and maintain responsive web applications using React, TypeScript, and Tailwind CSS.
- Optimize frontend components for maximum rendering speed and performance.
- Collaborate with backend engineers to integrate RESTful APIs (FastAPI/Node.js).
- Write clean, modular, and maintainable unit tests using Jest/React Testing Library.

Required Skills:
- React
- TypeScript
- CSS
- HTML
- Git
- Redux
- REST APIs
- Jest

Preferred Skills:
- Next.js
- Tailwind CSS
- Webpack
- Docker
- GraphQL`,
  },
  {
    title: 'Backend Developer (Python)',
    text: `Job Title: Backend Developer
Company: DataStream
Location: Hybrid, New York
Employment Type: Full-time

Responsibilities:
- Design and scale backend architectures using Python and FastAPI.
- Write complex database schemas, migrations, and queries in PostgreSQL/SQLAlchemy.
- Build secure JWT authentication and roles systems.
- Containerize services using Docker and deploy to AWS Elastic Container Service.

Required Skills:
- Python
- FastAPI
- Docker
- SQL
- PostgreSQL
- AWS
- Git
- REST APIs

Preferred Skills:
- Kubernetes
- Redis
- Celery
- CI/CD Pipelines
- Terraform`,
  },
]

export function JobDescriptionEditor({
  value,
  onChange,
  onFileSelect,
  onSubmit,
  isLoading,
}: JobDescriptionEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
  const charCount = value.length

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onChange(text)
      toast.success('Pasted from clipboard!')
    } catch {
      toast.error('Failed to read clipboard. Please paste manually.')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    const filename = file.name.toLowerCase()
    if (!filename.endsWith('.txt') && file.type !== 'text/plain') {
      toast.error('Only plain text (.txt) files are supported for job description upload.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      onChange(text)
      if (onFileSelect) {
        onFileSelect(file)
      }
      toast.success(`Loaded text from: ${file.name}`)
    }
    reader.readAsText(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const isInvalid = wordCount < 20 || wordCount > 2000

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
          Job Description Details
        </label>
        {/* Templates */}
        <div className="flex gap-2">
          {TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(tmpl.text)
                toast.success(`Imported template: ${tmpl.title}`)
              }}
              className="text-[9px] font-black uppercase tracking-wider bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 dark:bg-brand-500/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-brand-500/15"
            >
              Load {tmpl.title.split(' ')[0]} Template
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Drag Zone */}
      <div
        className={cn(
          'relative rounded-2xl border transition-all duration-200',
          dragActive
            ? 'border-brand-500 bg-brand-500/5 ring-4 ring-brand-500/10'
            : 'border-border bg-card/70 backdrop-blur-md shadow-2xs'
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the target job description here, or drag & drop a .txt file..."
          className="w-full h-64 p-4 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder-slate-455 dark:placeholder-slate-500 resize-none font-sans leading-relaxed"
        />

        {/* Buttons inside overlay */}
        <div className="absolute right-3 bottom-3 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-1.5 h-8 text-[10px] px-2.5 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-900/80 cursor-pointer rounded-lg border-border"
          >
            <Clipboard size={12} />
            <span>Paste Clipboard</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            className="flex items-center gap-1.5 h-8 text-[10px] px-2.5 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-900/80 cursor-pointer rounded-lg border-border"
          >
            <Upload size={12} />
            <span>Upload .TXT</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Count Info & Validation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-500">Words: <strong className="font-mono text-slate-700 dark:text-slate-350">{wordCount}</strong></span>
          <span className="font-semibold text-slate-500">Characters: <strong className="font-mono text-slate-700 dark:text-slate-350">{charCount}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          {value.trim() && wordCount < 20 && (
            <span className="flex items-center gap-1 text-red-500 font-bold uppercase tracking-wider text-[10px]">
              <AlertTriangle size={13} />
              <span>Too short</span>
            </span>
          )}
          {wordCount > 2000 && (
            <span className="flex items-center gap-1 text-red-500 font-bold uppercase tracking-wider text-[10px]">
              <AlertTriangle size={13} />
              <span>Too long</span>
            </span>
          )}
          {wordCount >= 20 && wordCount <= 2000 && (
            <span className="flex items-center gap-1 text-emerald-500 font-bold uppercase tracking-wider text-[10px]">
              <Check size={13} className="stroke-[3]" />
              <span>Valid length</span>
            </span>
          )}

          <Button
            onClick={onSubmit}
            disabled={isInvalid || isLoading}
            isLoading={isLoading}
            variant="primary"
            size="sm"
            className="w-full sm:w-auto h-9 cursor-pointer rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            <span>Run Match Engine</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JobDescriptionEditor
