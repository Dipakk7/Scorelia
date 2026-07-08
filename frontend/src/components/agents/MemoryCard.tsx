import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
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
    <Card className={cn('border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs', className)}>
      <CardContent className="p-3.5 flex flex-col gap-2 text-left">
        {/* Key and Controls */}
        <div className="flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2 truncate text-left">
            <Tag size={12} className="text-brand-500 flex-shrink-0" />
            <span className="font-mono font-semibold text-slate-855 dark:text-slate-200 truncate">
              {memoryKey}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-455 hover:bg-slate-100/50 dark:hover:bg-slate-900 hover:text-slate-700 cursor-pointer focus:outline-none border-none bg-transparent flex items-center"
              title="Copy to clipboard"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>

            {/* Expand object details */}
            {isObject && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded text-slate-455 hover:bg-slate-100/50 dark:hover:bg-slate-900 hover:text-slate-700 cursor-pointer focus:outline-none border-none bg-transparent flex items-center"
              >
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        </div>

        {/* Value Display */}
        {isObject ? (
          <div className="text-left">
            {expanded ? (
              <div className="p-2.5 bg-slate-900 text-slate-350 dark:bg-slate-950/80 rounded-xl border border-slate-950/50 font-mono text-[10px] overflow-x-auto max-h-48 mt-1 text-left">
                <pre className="m-0 leading-normal">{valueStr}</pre>
              </div>
            ) : (
              <div
                onClick={() => setExpanded(true)}
                className="p-2 bg-slate-50/50 dark:bg-slate-900/60 rounded-xl text-[10px] text-slate-500 dark:text-slate-405 font-mono cursor-pointer hover:bg-slate-100/20 border border-slate-200/50 dark:border-slate-850 truncate text-left leading-normal"
              >
                {Array.isArray(value) ? `Array [${value.length}]` : `Object {${Object.keys(value).join(', ')}}`}
              </div>
            )}
          </div>
        ) : (
          <div className="p-2 bg-slate-55/40 dark:bg-slate-900/40 rounded-xl text-slate-655 dark:text-slate-350 font-mono text-[10px] break-words border border-slate-200/35 dark:border-slate-850 select-text text-left leading-normal">
            {valueStr}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default MemoryCard
