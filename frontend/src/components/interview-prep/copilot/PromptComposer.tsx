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
        className="w-full bg-[#141627] border border-white/10 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 resize-none font-sans"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Placeholder Attachment Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 border-white/10 bg-white/5 hover:text-white rounded-lg cursor-pointer flex items-center gap-1"
          >
            <Paperclip className="h-3 w-3 text-purple-400" />
            <span>Resume</span>
          </Button>

          <Button
            variant="outline"
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 border-white/10 bg-white/5 hover:text-white rounded-lg cursor-pointer flex items-center gap-1"
          >
            <FileText className="h-3 w-3 text-purple-400" />
            <span>Job Desc</span>
          </Button>

          <Button
            disabled
            variant="outline"
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 border-white/5 bg-white/5 rounded-lg cursor-not-allowed opacity-50 flex items-center gap-1"
          >
            <Mic className="h-3 w-3" />
            <span>Voice</span>
          </Button>
        </div>

        {/* Counter & Send Button */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500">
            {value.length} / {maxLength}
          </span>

          <Button
            onClick={() => value.trim() && onSend(value)}
            disabled={!value.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-md shadow-purple-900/30"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default PromptComposer
