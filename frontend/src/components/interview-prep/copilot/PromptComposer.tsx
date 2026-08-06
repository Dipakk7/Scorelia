import React, { useState } from 'react'
import { Send, Paperclip, FileText, Mic } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface PromptComposerProps {
  value: string
  onChange: (val: string) => void
  onSend: (text: string) => void
}

export function PromptComposer({ value, onChange, onSend }: PromptComposerProps) {
  const maxLength = 1000

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSend(value)
      }
    }
  }

  return (
    <div className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all text-left">
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Scorelia AI Copilot anything... (e.g. 'Review my STAR behavioral response for leadership', 'Generate 3 hard PyTorch coding questions', or 'Explain system design sharding')"
        maxLength={maxLength}
        className="w-full bg-[#141627] border border-white/10 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none font-sans"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Attachment Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            className="h-8 px-2.5 text-[11px] font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Paperclip className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>Resume</span>
          </Button>

          <Button
            type="button"
            className="h-8 px-2.5 text-[11px] font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <FileText className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>Job Desc</span>
          </Button>

          <Button
            disabled
            type="button"
            className="h-8 px-2.5 text-[11px] font-semibold text-slate-500 border border-white/5 bg-white/5 rounded-lg cursor-not-allowed opacity-50 flex items-center gap-1.5"
          >
            <Mic className="h-3.5 w-3.5 shrink-0" />
            <span>Voice</span>
          </Button>
        </div>

        {/* Counter & Send Button */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400">
            {value.length} / {maxLength}
          </span>

          <Button
            type="button"
            onClick={() => value.trim() && onSend(value)}
            disabled={!value.trim()}
            className="h-9 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-md shadow-purple-600/20"
          >
            <span>Send Prompt</span>
            <Send className="h-3.5 w-3.5 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default PromptComposer
