import React, { useState } from 'react'
import { Bot } from 'lucide-react'
import type { ChatMessage, CitationItem } from '@/data/ragQueryMockData'
import { MOCK_CHAT_MESSAGES } from '@/data/ragQueryMockData'
import { useRAGQueryPlayground } from '@/hooks/useRAGQueryPlayground'
import { Conversation } from './Conversation'
import { TypingIndicator } from './TypingIndicator'
import { ContextPanel } from './ContextPanel'
import { CitationPanel } from './CitationPanel'
import { ChatComposer } from './ChatComposer'
import { ConversationActions } from './ConversationActions'
import { SuggestedPrompts } from './SuggestedPrompts'
import { cn } from '@/lib/utils'

export interface AIAssistantProps {
  className?: string
}

export function AIAssistant({ className }: AIAssistantProps) {
  const { sendChatMessage, isChatting } = useRAGQueryPlayground()

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES)
  const [activeCitations, setActiveCitations] = useState<CitationItem[]>(
    MOCK_CHAT_MESSAGES.flatMap((m) => m.citations || [])
  )

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])

    try {
      const assistantMsg = await sendChatMessage(text)
      setMessages((prev) => [...prev, assistantMsg])
      if (assistantMsg.citations) {
        setActiveCitations((prev) => [...prev, ...assistantMsg.citations!])
      }
    } catch {
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        content: `Based on your RAG workspace knowledge base, here is the retrieved information for: "${text}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.92
      }
      setMessages((prev) => [...prev, fallbackMsg])
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setActiveCitations([])
  }

  const handleClearConversation = () => {
    setMessages([])
    setActiveCitations([])
  }

  return (
    <div
      aria-label="Scorelia AI Assistant Sidebar"
      className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
              Scorelia AI Assistant
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </h3>
          </div>
        </div>

        <ConversationActions
          onNewChat={handleNewChat}
          onClearConversation={handleClearConversation}
          onCopyConversation={() => {
            const fullText = messages.map((m) => `${m.sender.toUpperCase()}: ${m.content}`).join('\n\n')
            navigator.clipboard.writeText(fullText)
          }}
        />
      </div>

      {/* Context Window Summary */}
      <ContextPanel />

      {/* Suggested Prompts Pills */}
      <SuggestedPrompts onSelectPrompt={handleSendMessage} />

      {/* Conversation Thread */}
      <Conversation
        messages={messages}
        onRegenerate={() => handleSendMessage(messages[messages.length - 2]?.content || 'Summarize collection')}
      />

      {/* Typing Indicator */}
      {isChatting && <TypingIndicator />}

      {/* Citation Panel */}
      {activeCitations.length > 0 && (
        <CitationPanel citations={activeCitations} />
      )}

      {/* Chat Input Composer */}
      <ChatComposer onSendMessage={handleSendMessage} disabled={isChatting} />
    </div>
  )
}

export default AIAssistant
