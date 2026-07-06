import { useState } from 'react'
import { Eye, Columns } from 'lucide-react'

interface DiffViewerProps {
  originalText: string
  newText: string
  title?: string
}

// LCS-based word/whitespace diffing algorithm
function diffWords(oldStr: string = '', newStr: string = '') {
  const one = oldStr.split(/(\s+)/).filter(Boolean)
  const two = newStr.split(/(\s+)/).filter(Boolean)

  const dp = Array(one.length + 1)
    .fill(null)
    .map(() => Array(two.length + 1).fill(0))

  for (let i = 1; i <= one.length; i++) {
    for (let j = 1; j <= two.length; j++) {
      if (one[i - 1] === two[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const diff: { type: 'added' | 'removed' | 'unchanged'; value: string }[] = []
  let i = one.length
  let j = two.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && one[i - 1] === two[j - 1]) {
      diff.unshift({ type: 'unchanged', value: one[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'added', value: two[j - 1] })
      j--
    } else {
      diff.unshift({ type: 'removed', value: one[i - 1] })
      i--
    }
  }
  return diff
}

export function DiffViewer({ originalText = '', newText = '', title }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'inline' | 'side-by-side'>('inline')

  const diffResult = diffWords(originalText, newText)

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-dark-bg font-sans text-left">
      {/* Control Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-850">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {title || 'Resume Diff Analysis'}
        </span>
        <div className="flex bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('inline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
              viewMode === 'inline'
                ? 'bg-white dark:bg-dark-bg text-slate-800 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye size={12} />
            <span>Inline</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-dark-bg text-slate-800 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Columns size={12} />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Comparison Panel */}
      <div className="p-4 overflow-x-auto">
        {viewMode === 'inline' ? (
          /* Inline View */
          <div className="text-xs leading-relaxed font-mono whitespace-pre-wrap p-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-850/60 text-slate-850 dark:text-slate-300">
            {diffResult.map((chunk, idx) => {
              if (chunk.type === 'added') {
                return (
                  <ins
                    key={idx}
                    className="bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 no-underline px-0.5 rounded-sm font-semibold"
                  >
                    {chunk.value}
                  </ins>
                )
              }
              if (chunk.type === 'removed') {
                return (
                  <del
                    key={idx}
                    className="bg-rose-500/15 dark:bg-rose-500/20 text-rose-800 dark:text-rose-455 line-through px-0.5 rounded-sm"
                  >
                    {chunk.value}
                  </del>
                )
              }
              return <span key={idx}>{chunk.value}</span>
            })}
          </div>
        ) : (
          /* Side by Side View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left - Original */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Original Text
              </span>
              <div className="text-xs leading-relaxed font-mono whitespace-pre-wrap p-4 bg-rose-500/5 dark:bg-rose-950/5 rounded-lg border border-rose-500/10 text-slate-655 dark:text-slate-400 min-h-[120px]">
                {diffResult
                  .filter((chunk) => chunk.type !== 'added')
                  .map((chunk, idx) => {
                    const isRemoved = chunk.type === 'removed'
                    return (
                      <span
                        key={idx}
                        className={isRemoved ? 'bg-rose-500/15 text-rose-800 dark:text-rose-400 px-0.5 rounded-sm' : ''}
                      >
                        {chunk.value}
                      </span>
                    )
                  })}
              </div>
            </div>

            {/* Right - Rewritten */}
            <div className="space-y-1">
              <span className="text-[10px] text-brand-555 font-bold uppercase tracking-wider block">
                AI Rewritten Text
              </span>
              <div className="text-xs leading-relaxed font-mono whitespace-pre-wrap p-4 bg-emerald-500/5 dark:bg-emerald-950/5 rounded-lg border border-emerald-500/10 text-slate-800 dark:text-slate-205 min-h-[120px]">
                {diffResult
                  .filter((chunk) => chunk.type !== 'removed')
                  .map((chunk, idx) => {
                    const isAdded = chunk.type === 'added'
                    return (
                      <span
                        key={idx}
                        className={isAdded ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 px-0.5 rounded-sm font-semibold' : ''}
                      >
                        {chunk.value}
                      </span>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiffViewer
