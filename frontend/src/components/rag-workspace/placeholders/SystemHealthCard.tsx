import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SystemHealthCard() {
  const healthItems = [
    { label: 'Embedding Model', value: 'nomic-embed-text:latest', status: true },
    { label: 'Vector Database', value: 'ChromaDB', status: true },
    { label: 'LLM Model', value: 'Qwen2.5:38B (Ollama)', status: true },
    { label: 'Last Sync', value: '2 min ago', status: true }
  ]

  return (
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--heading)] tracking-tight">System Health</h3>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
          Healthy
        </span>
      </div>

      <div className="space-y-3">
        {healthItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)] last:border-0 last:pb-0">
            <span className="text-[var(--muted)]">{item.label}</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--heading)]">
              <span className="truncate max-w-[140px]">{item.value}</span>
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export default SystemHealthCard
