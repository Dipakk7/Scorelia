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
      <Search className="absolute left-3 w-4 h-4 text-[var(--muted)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="Search settings"
        className="w-full h-9 pl-9 pr-14 text-xs sm:text-sm bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--heading)] placeholder-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all font-sans shadow-sm"
      />
      <kbd className="absolute right-2.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] rounded shadow-2xs pointer-events-none select-none">
        <span className="text-[11px]">⌘</span>K
      </kbd>
    </div>
  )
}

export default SettingsSearch
