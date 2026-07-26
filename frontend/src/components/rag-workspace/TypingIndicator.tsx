import React from 'react'
import { Bot } from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface TypingIndicatorProps {
  className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  return (
    <div className={cn('flex items-start gap-3 text-left my-2', className)}>
      <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
        <Bot size={16} />
      </div>

      <div className="p-3 rounded-2xl bg-[#121320] border border-white/5 text-slate-300 flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-mono">Scorelia AI is thinking</span>
        {shouldReduceMotion ? (
          <span className="text-purple-400 font-bold text-xs">...</span>
        ) : (
          <div className="flex items-center gap-1 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TypingIndicator
