import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { AssistantHeader } from './AssistantHeader'
import { Conversation } from './Conversation'
import { SuggestedPrompts } from './SuggestedPrompts'
import { PromptComposer } from './PromptComposer'
import { CareerInsightsCard } from './CareerInsightsCard'
import { RecommendedActionsCard } from './RecommendedActionsCard'
import { SessionSummaryCard } from './SessionSummaryCard'
import { SkeletonAssistant } from '../common/SkeletonAssistant'
import { useCareerAssistant } from '@/hooks/useCareerAssistant'
import { cn } from '@/lib/utils'
import type { ChatMessageData } from '@/types/careerRoadmap'

export interface CareerAssistantProps {
  initialMessages?: ChatMessageData[]
  className?: string
}

export function CareerAssistant({
  initialMessages,
  className,
}: CareerAssistantProps) {
  const {
    messages: hookMessages,
    suggestedPrompts,
    insights,
    recommendedActions,
    sessionSummary,
    sendMessage,
    isSending,
    isLoading,
  } = useCareerAssistant()

  const [localMessages, setLocalMessages] = useState<ChatMessageData[]>([])

  useEffect(() => {
    if (hookMessages.length > 0 && localMessages.length === 0) {
      setLocalMessages(hookMessages)
    }
  }, [hookMessages, localMessages.length])

  const messages = initialMessages || (localMessages.length > 0 ? localMessages : hookMessages)

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setLocalMessages((prev) => [...prev, userMsg])

    sendMessage(
      { message: text },
      {
        onSuccess: (res) => {
          setLocalMessages(res.messages)
        },
      }
    )
  }

  const handleNewChat = () => {
    setLocalMessages([
      {
        id: `sys-${Date.now()}`,
        sender: 'assistant',
        text: 'New career consultation session started! What would you like to plan or review today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  const handleClearChat = () => {
    setLocalMessages([])
  }

  if (isLoading && messages.length === 0) {
    return <SkeletonAssistant />
  }

  return (
    <div className={cn('space-y-5 text-left', className)}>
      {/* Main AI Assistant Card */}
      <Card className="p-5 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left">
        <AssistantHeader onNewChat={handleNewChat} onClearChat={handleClearChat} />
        <Conversation messages={messages} isTyping={isSending} />
        <SuggestedPrompts prompts={suggestedPrompts.length > 0 ? suggestedPrompts : undefined} onSelectPrompt={handleSendMessage} />
        <PromptComposer onSendMessage={handleSendMessage} />
      </Card>

      {/* Auxiliary Analytics & Actions Cards */}
      <CareerInsightsCard insights={insights} />
      <RecommendedActionsCard actions={recommendedActions.length > 0 ? recommendedActions : undefined} />
      <SessionSummaryCard summary={sessionSummary} />
    </div>
  )
}
export default CareerAssistant
