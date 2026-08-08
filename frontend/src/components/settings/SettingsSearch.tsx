import React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SettingsSearchProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const SettingsSearch: React.FC<SettingsSearchProps> = ({
  placeholder = 'Search settings...',
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-xs sm:max-w-sm', className)}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="Search settings"
        className="w-full h-10 pl-9 pr-14 text-xs sm:text-sm bg-[#0d0f1e]/80 border border-white/10 rounded-xl text-slate-100 placeholder-slate-400/70 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 transition-all font-sans shadow-inner"
      />
      <kbd className="absolute right-2.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800/80 border border-white/10 rounded shadow-xs pointer-events-none select-none">
        <span className="text-[11px]">⌘</span>K
      </kbd>
    </div>
  )
}

export default SettingsSearch

