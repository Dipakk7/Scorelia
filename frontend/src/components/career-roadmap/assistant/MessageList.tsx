import React from 'react'
import { motion } from 'framer-motion'
import { Bot, User, CheckCircle2, Terminal } from 'lucide-react'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { ChatMessageData } from '@/types/careerRoadmap'

export interface MessageListProps {
  messages: ChatMessageData[]
  isTyping?: boolean
  className?: string
}

export function MessageList({ messages, isTyping, className }: MessageListProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      role="log"
      aria-live="polite"
      aria-label="AI Career Assistant Conversation History"
      className={cn('space-y-4 text-left', className)}
    >
      {messages.map((msg) => {
        const isUser = msg.sender === 'user'

        return (
          <motion.div
            key={msg.id}
            variants={itemVariants}
            className={cn('flex items-start gap-2.5 max-w-full', isUser ? 'flex-row-reverse' : 'flex-row')}
          >
            {/* Avatar */}
            <div
              className={cn(
                'h-7 w-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm mt-0.5',
                isUser
                  ? 'bg-purple-600 text-white'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
              )}
            >
              {isUser ? <User className="h-4 w-4" aria-hidden="true" /> : <Bot className="h-4 w-4" aria-hidden="true" />}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                'p-3.5 rounded-2xl text-xs space-y-2 max-w-[85%] leading-relaxed text-left shadow-sm',
                isUser
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-[#0b0c14] border border-white/10 text-slate-200 rounded-tl-none'
              )}
            >
              {/* Message text */}
              <p className="m-0 whitespace-pre-wrap">{msg.text}</p>

              {/* Optional Bullet Points */}
              {msg.bulletPoints && msg.bulletPoints.length > 0 && (
                <ul className="m-0 pl-1 list-none space-y-1 pt-1 border-t border-white/10">
                  {msg.bulletPoints.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Optional Code Snippet */}
              {msg.codeSnippet && (
                <div className="rounded-lg bg-[#121320] border border-white/10 p-2.5 font-mono text-[11px] text-purple-300 overflow-x-auto space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-sans border-b border-white/5 pb-1">
                    <Terminal className="h-3 w-3 text-purple-400" aria-hidden="true" />
                    <span>Learning Target Config</span>
                  </div>
                  <pre className="m-0 whitespace-pre-wrap">{msg.codeSnippet}</pre>
                </div>
              )}

              {/* Timestamp */}
              <span
                className={cn(
                  'text-[9px] block text-right font-medium',
                  isUser ? 'text-purple-200' : 'text-slate-500'
                )}
              >
                {msg.timestamp}
              </span>
            </div>
          </motion.div>
        )
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <motion.div variants={itemVariants} className="flex items-center gap-2.5 text-xs text-slate-400">
          <div className="h-7 w-7 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="p-3 rounded-2xl bg-[#0b0c14] border border-white/10 rounded-tl-none flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
export default MessageList
