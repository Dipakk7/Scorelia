import React from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NewAgentButtonProps {
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function NewAgentButton({ className, onClick, disabled = false }: NewAgentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-950/50 hover:shadow-purple-900/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c14]',
        className
      )}
    >
      <Plus size={16} className="stroke-[2.5]" />
      <span>New Agent</span>
    </button>
  )
}

export default NewAgentButton
