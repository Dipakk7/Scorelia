import React, { useState } from 'react'
import { Send, Paperclip, Target, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PromptComposerProps {
  onSendMessage: (text: string) => void
  onAttachResume?: () => void
  onAttachJobGoal?: () => void
  placeholder?: string
  maxLength?: number
  className?: string
}

export function PromptComposer({
  onSendMessage,
  onAttachResume,
  onAttachJobGoal,
  placeholder = 'Ask me anything about your career roadmap...',
  maxLength = 500,
  className,
}: PromptComposerProps) {
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (!inputText.trim()) return
    onSendMessage(inputText.trim())
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn('space-y-2 text-left', className)}>
      <div className="relative rounded-2xl bg-[#0b0c14] border border-white/10 p-2.5 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/30 transition-all">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none resize-none custom-scrollbar"
          aria-label="Ask Career AI Assistant"
        />

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          {/* Left Attachment Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onAttachResume}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-slate-300 transition-colors cursor-pointer border-none min-h-[32px]"
              title="Attach active resume profile context"
            >
              <Paperclip className="h-3 w-3 text-purple-400" aria-hidden="true" />
              <span className="hidden sm:inline">Attach Resume</span>
            </button>
            <button
              type="button"
              onClick={onAttachJobGoal}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-slate-300 transition-colors cursor-pointer border-none min-h-[32px]"
              title="Attach target job goal context"
            >
              <Target className="h-3 w-3 text-blue-400" aria-hidden="true" />
              <span className="hidden sm:inline">Attach Goal</span>
            </button>
            <button
              type="button"
              disabled
              className="p-1.5 rounded-lg bg-white/5 text-slate-600 cursor-not-allowed opacity-50 border-none min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="Voice input disabled in Phase 4"
              aria-label="Voice input disabled"
            >
              <Mic className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          {/* Right Character Count & Send Button */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">
              {inputText.length}/{maxLength}
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer border-none shadow-md shadow-purple-950/40 min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
              aria-label="Send message to AI assistant"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PromptComposer
