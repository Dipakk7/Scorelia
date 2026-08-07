import React from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AddCollectionButtonProps {
  onClick?: () => void
  className?: string
}

export function AddCollectionButton({ onClick, className }: AddCollectionButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 border border-purple-500/30 hover:scale-[1.02] cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 h-10 select-none shrink-0',
        className
      )}
      aria-label="Add new collection"
    >
      <Plus size={15} className="stroke-[2.5] shrink-0" />
      <span>Add New Collection</span>
    </button>
  )
}

export default AddCollectionButton

