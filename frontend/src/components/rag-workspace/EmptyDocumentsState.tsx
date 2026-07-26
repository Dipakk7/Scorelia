import React from 'react'
import { FileText, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyDocumentsStateProps {
  onUploadClick: () => void
  className?: string
}

export function EmptyDocumentsState({ onUploadClick, className }: EmptyDocumentsStateProps) {
  return (
    <div className={cn('p-10 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 text-center space-y-4 max-w-md mx-auto my-12', className)}>
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
        <FileText size={32} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white">No Documents Found</h3>
        <p className="text-xs text-slate-400">
          Upload PDF, Markdown, or Code files to start indexing knowledge for your collections.
        </p>
      </div>

      <button
        type="button"
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer min-h-[44px]"
      >
        <Upload size={15} />
        <span>Upload Your First Document</span>
      </button>
    </div>
  )
}

export default EmptyDocumentsState
