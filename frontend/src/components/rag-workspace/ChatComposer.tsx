import React, { useState } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChatComposerProps {
  onSendMessage: (message: string) => void
  onAttachFile?: () => void
  disabled?: boolean
  maxLength?: number
  className?: string
}

export function ChatComposer({
  onSendMessage,
  onAttachFile,
  disabled = false,
  maxLength = 1000,
  className
}: ChatComposerProps) {
  const [text, setText] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (text.trim() && !disabled) {
        onSendMessage(text)
        setText('')
      }
    }
  }

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text)
      setText('')
    }
  }

  return (
    <div className={cn('relative flex flex-col gap-1 text-left', className)}>
      <div className="relative flex items-center">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          aria-label="Chat input message"
          disabled={disabled}
          className="w-full bg-[#121320] border border-white/10 focus:border-purple-500/50 rounded-xl py-2.5 pl-3 pr-20 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-sans custom-scrollbar"
        />

        <div className="absolute right-2 bottom-2.5 flex items-center gap-1">
          <button
            type="button"
            onClick={onAttachFile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Attach context file"
            title="Attach file"
          >
            <Paperclip size={15} />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-900/40"
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
        <span>Enter to send, Shift+Enter for newline</span>
        <span>
          {text.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}

export default ChatComposer
