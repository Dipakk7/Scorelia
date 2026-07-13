import React, { useState } from 'react'
import { Tag, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MemoryCardProps {
  memoryKey: string
  value: any
  namespace: string
  className?: string
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memoryKey,
  value,
  className,
}) => {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const isObject = typeof value === 'object' && value !== null
  const valueStr = isObject ? JSON.stringify(value, null, 2) : String(value)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(valueStr)
    setCopied(true)
    toast.success('Memory value copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('border border-[var(--border)]/65 bg-[var(--surface)] hover:border-[var(--primary)]/45 transition-all duration-200 rounded-xl overflow-hidden text-left font-sans text-xs', className)}>
      <div className="p-3 flex flex-col gap-2 text-left">
        {/* Key and Controls */}
        <div className="flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-1.5 truncate text-left min-w-0">
            <Tag size={11} className="text-[var(--primary)] flex-shrink-0" />
            <span className="font-mono font-bold text-[var(--heading)] truncate">
              {memoryKey}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 select-none">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1 rounded text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--heading)] cursor-pointer focus:outline-none border-none bg-transparent flex items-center"
              title="Copy to clipboard"
            >
              {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
            </button>

            {/* Expand object details */}
            {isObject && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--heading)] cursor-pointer focus:outline-none border-none bg-transparent flex items-center"
              >
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            )}
          </div>
        </div>

        {/* Value Display */}
        {isObject ? (
          <div className="text-left">
            {expanded ? (
              <div className="p-2.5 bg-slate-905 dark:bg-slate-950 text-[var(--body)] rounded-lg border border-[var(--border)]/55 font-mono text-[9px] overflow-x-auto max-h-48 mt-1 text-left leading-normal scrollbar-thin select-text">
                <pre className="m-0">{valueStr}</pre>
              </div>
            ) : (
              <div
                onClick={() => setExpanded(true)}
                className="p-2 bg-[var(--background)] rounded-lg text-[9px] text-[var(--muted)] font-mono cursor-pointer hover:bg-[var(--surface-hover)] border border-[var(--border)]/40 truncate text-left leading-normal"
              >
                {Array.isArray(value) ? `Array [${value.length}]` : `Object {${Object.keys(value).join(', ')}}`}
              </div>
            )}
          </div>
        ) : (
          <div className="p-2 bg-[var(--background)] rounded-lg text-[9px] text-[var(--body)] font-mono break-words border border-[var(--border)]/40 select-text text-left leading-normal">
            {valueStr}
          </div>
        )}
      </div>
    </div>
  )
}
export default MemoryCard
