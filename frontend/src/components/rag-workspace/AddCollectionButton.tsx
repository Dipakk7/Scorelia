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
        'flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-[1.02] cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 min-h-[44px]',
        className
      )}
      aria-label="Add new collection placeholder"
    >
      <Plus size={16} className="stroke-[2.5] shrink-0" />
      <span>Add New Collection</span>
    </button>
  )
}

export default AddCollectionButton
