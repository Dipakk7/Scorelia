import React, { useRef, useEffect } from 'react'
import { MessageList } from './MessageList'
import { cn } from '@/lib/utils'
import type { ChatMessageData } from '@/types/careerRoadmap'

export interface ConversationProps {
  messages: ChatMessageData[]
  isTyping?: boolean
  className?: string
}

export function Conversation({ messages, isTyping, className }: ConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  return (
    <div
      ref={scrollRef}
      className={cn(
        'max-h-[360px] min-h-[220px] overflow-y-auto custom-scrollbar pr-1 text-left',
        className
      )}
    >
      <MessageList messages={messages} isTyping={isTyping} />
    </div>
  )
}
export default Conversation
