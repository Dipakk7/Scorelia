import React from 'react'
import { motion } from 'framer-motion'
import { Bot, User, Code, Copy, Check } from 'lucide-react'
import type { CopilotChatMessage } from '@/types/interviewPrep'

export interface ChatMessageListProps {
  messages: CopilotChatMessage[]
  isTyping?: boolean
}

export function ChatMessageList({ messages, isTyping = false }: ChatMessageListProps) {
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null)

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  return (
    <div className="space-y-4 text-left">
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user'

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`p-2 rounded-xl shrink-0 ${isUser ? 'bg-purple-600 text-white' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
              {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble Content */}
            <div className={`space-y-2 max-w-[85%] ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed font-sans space-y-2.5 ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/30 font-medium'
                    : 'bg-[#141627] text-slate-200 border border-white/10 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Bullet Points */}
                {msg.bulletPoints && msg.bulletPoints.length > 0 && (
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-300 font-medium text-left">
                    {msg.bulletPoints.map((bp, i) => (
                      <li key={i} className="leading-relaxed">{bp}</li>
                    ))}
                  </ul>
                )}

                {/* Code Snippet */}
                {msg.codeSnippet && (
                  <div className="rounded-xl bg-[#0a0c16] border border-white/10 overflow-hidden text-left font-mono text-[11px] my-2">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-slate-400 text-[10px]">
                      <span className="flex items-center gap-1 font-extrabold uppercase">
                        <Code className="h-3 w-3 text-purple-400" /> {msg.codeSnippet.language}
                      </span>
                      <button
                        onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedCodeId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 overflow-x-auto text-purple-200 leading-relaxed font-mono">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-500 font-mono block px-1">
                {msg.timestamp}
              </span>
            </div>
          </motion.div>
        )
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Bot className="h-4 w-4" />
          </div>
          <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-[#141627] border border-white/10 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export function CopilotConversation({ messages, isTyping }: ChatMessageListProps) {
  return (
    <div className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all min-h-[380px] max-h-[500px] overflow-y-auto custom-scrollbar space-y-4">
      <ChatMessageList messages={messages} isTyping={isTyping} />
    </div>
  )
}
export default CopilotConversation
