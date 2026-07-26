import React from 'react'
import { Search, X } from 'lucide-react'

export interface QuestionBankSearchProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function QuestionBankSearch({
  value,
  onChange,
  placeholder = 'Search questions by keyword, technology (Python, SQL, PyTorch), or company...',
}: QuestionBankSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#141627] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
export default QuestionBankSearch
