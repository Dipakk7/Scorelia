import React from 'react'
import { FileText, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyDocumentsStateProps {
  onUploadClick: () => void
  className?: string
}

export function EmptyDocumentsState({ onUploadClick, className }: EmptyDocumentsStateProps) {
  return (
    <div className={cn('p-10 rounded-2xl bg-slate-900/90 border border-dashed border-slate-800/90 shadow-xl text-center space-y-4 max-w-md mx-auto my-12 backdrop-blur-md', className)}>
      <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center mx-auto shadow-inner">
        <FileText size={32} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white tracking-tight">No Documents Found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Upload PDF, Markdown, or Code files to start indexing knowledge for your collections.
        </p>
      </div>

      <button
        type="button"
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/25 border border-purple-500/30 cursor-pointer min-h-[44px]"
      >
        <Upload size={15} />
        <span>Upload Your First Document</span>
      </button>
    </div>
  )
}

export default EmptyDocumentsState

