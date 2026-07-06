// frontend/src/components/agents/MessageBubble.tsx

import React, { useState } from 'react'
import { Bot, User, Copy, Check, RotateCcw, Clock, AlertTriangle, Layers, Database } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    executionTimeMs?: number
    stepsCount?: number
    error?: boolean
  }
  onRegenerate?: (content: string) => void
  className?: string
}

// Custom Safe React 19 Markdown & Table & Code Renderer
const CustomMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-3 font-sans text-sm leading-relaxed">
      {parts.map((part, idx) => {
        // Render Code block
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/)
          const lang = match ? match[1] : 'text'
          const code = match ? match[2] : part.slice(3, -3)
          
          return <CodeBlock key={idx} lang={lang} code={code.trim()} />
        }

        // Render Table or standard paragraphs
        if (part.includes('|') && part.split('\n').some(line => line.trim().startsWith('|'))) {
          return <TableBlock key={idx} blockText={part} />
        }

        return <ParagraphBlock key={idx} blockText={part} />
      })}
    </div>
  )
}

const CodeBlock: React.FC<{ lang: string; code: string }> = ({ lang, code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded-lg border border-slate-900 overflow-hidden shadow-md select-none font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 text-slate-400 text-xxs border-b border-slate-900">
        <span className="uppercase tracking-wider font-semibold">{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors duration-150 cursor-pointer focus:outline-none"
        >
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 bg-slate-900 text-slate-200 overflow-x-auto text-xs scrollbar-thin select-text">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const TableBlock: React.FC<{ blockText: string }> = ({ blockText }) => {
  // Split into lines
  const lines = blockText.split('\n').map((line) => line.trim()).filter(Boolean)
  const tableLines = lines.filter((line) => line.startsWith('|'))

  if (tableLines.length < 2) {
    return <ParagraphBlock blockText={blockText} />
  }

  const parseRow = (rowText: string) => {
    return rowText
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())
  }

  const headers = parseRow(tableLines[0])
  // Skip separator line (e.g. |---|---|)
  const dataRows = tableLines.slice(2).map((row) => parseRow(row))

  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 dark:border-dark-border/40 scrollbar-thin">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-150 dark:border-dark-border/40 font-semibold text-slate-700 dark:text-slate-250">
            {headers.map((h, i) => (
              <th key={i} className="py-2.5 px-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-dark-border/30 text-slate-655 dark:text-slate-350">
          {dataRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
              {row.map((cell, i) => (
                <td key={i} className="py-2 px-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ParagraphBlock: React.FC<{ blockText: string }> = ({ blockText }) => {
  const lines = blockText.split('\n')

  const formatText = (txt: string) => {
    // Parse markdown headers
    if (txt.startsWith('### ')) {
      return <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-3 mb-1.5">{txt.slice(4)}</h4>
    }
    if (txt.startsWith('## ')) {
      return <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">{txt.slice(3)}</h3>
    }
    if (txt.startsWith('# ')) {
      return <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-5 mb-2.5">{txt.slice(2)}</h2>
    }

    // Parse list items
    if (txt.startsWith('- ') || txt.startsWith('* ')) {
      return (
        <li className="list-disc list-inside pl-2 text-slate-650 dark:text-slate-350 my-1 font-sans">
          {formatInline(txt.slice(2))}
        </li>
      )
    }

    if (/^\d+\.\s/.test(txt)) {
      const match = txt.match(/^(\d+)\.\s(.*)/)
      if (match) {
        return (
          <li className="list-decimal list-inside pl-2 text-slate-650 dark:text-slate-350 my-1 font-sans">
            {formatInline(match[2])}
          </li>
        )
      }
    }

    return <p className="my-1.5 text-slate-650 dark:text-slate-350 select-text leading-relaxed">{formatInline(txt)}</p>
  }

  const formatInline = (txt: string) => {
    // Basic inline code `code` & bold **bold**
    const parts = txt.split(/(\*\*.*?\*\*|`.*?`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-dark-border/40 font-mono text-xxs text-brand-600 dark:text-brand-400">
            {part.slice(1, -1)}
          </code>
        )
      }
      return part
    })
  }

  return (
    <div className="flex flex-col gap-1 select-text">
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>{formatText(line)}</React.Fragment>
      ))}
    </div>
  )
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRegenerate,
  className,
}) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast.success('Message content copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex gap-4 p-5 rounded-2xl border transition-all duration-150',
        isUser
          ? 'bg-slate-50/60 dark:bg-slate-900/20 border-slate-100 dark:border-dark-border/30 flex-row-reverse'
          : message.error
          ? 'bg-rose-500/5 border-rose-200/40 dark:border-rose-950/40 text-slate-800 dark:text-slate-200'
          : 'bg-white dark:bg-dark-card border-slate-200/60 dark:border-dark-border shadow-xs',
        className
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          'h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs border',
          isUser
            ? 'bg-slate-200 dark:bg-slate-850 text-slate-655 dark:text-slate-400 border-slate-300/30'
            : message.error
            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20'
            : 'bg-brand-500 text-white border-brand-600 shadow-md shadow-brand-500/10'
        )}
      >
        {isUser ? <User size={18} /> : message.error ? <AlertTriangle size={18} /> : <Bot size={18} />}
      </div>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Header Metadata */}
        <div className={cn('flex items-center gap-3 text-xxs font-sans text-slate-400 dark:text-slate-500', isUser ? 'justify-end' : '')}>
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            {isUser ? 'Operator Console' : 'Orchestration Core'}
          </span>
          <span className="font-mono">{message.timestamp.toLocaleTimeString()}</span>
        </div>

        {/* Text Area */}
        <div className={cn('font-sans', isUser ? 'text-right' : '')}>
          {isUser ? (
            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-text leading-relaxed">
              {message.content}
            </p>
          ) : (
            <CustomMarkdownRenderer text={message.content} />
          )}
        </div>

        {/* Metadata stats details */}
        {!isUser && (message.executionTimeMs !== undefined || message.stepsCount !== undefined) && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3.5 border-t border-slate-100 dark:border-dark-border/40 font-mono text-xxs text-slate-400 dark:text-slate-500 select-none">
            {message.executionTimeMs !== undefined && (
              <div className="flex items-center gap-1 font-semibold">
                <Clock size={12} />
                <span>LATENCY: {message.executionTimeMs.toFixed(0)}ms</span>
              </div>
            )}

            {message.stepsCount !== undefined && message.stepsCount > 0 && (
              <div className="flex items-center gap-1">
                <Layers size={12} />
                <span>PIPELINE AGENTS: {message.stepsCount} executed</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Database size={12} />
              <span>MEMORY SPACE: merged</span>
            </div>
          </div>
        )}

        {/* Actions panel */}
        <div className={cn('flex items-center gap-1.5 mt-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-150 select-none', isUser ? 'justify-end' : '')}>
          {/* Copy Message Content */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 py-1 px-2 text-xxs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-dark-border rounded hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer focus:outline-none"
            title="Copy message payload"
          >
            {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
            <span>Copy</span>
          </button>

          {/* Regenerate Trigger */}
          {!isUser && onRegenerate && (
            <button
              onClick={() => onRegenerate(message.content)}
              className="flex items-center gap-1 py-1 px-2 text-xxs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-dark-border rounded hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer focus:outline-none"
              title="Re-run orchestration plan"
            >
              <RotateCcw size={10} />
              <span>Re-run task</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
