import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { AssistantHeader } from './AssistantHeader'
import { Conversation } from './Conversation'
import { SuggestedPrompts } from './SuggestedPrompts'
import { PromptComposer } from './PromptComposer'
import { CareerInsightsCard } from './CareerInsightsCard'
import { RecommendedActionsCard } from './RecommendedActionsCard'
import { SessionSummaryCard } from './SessionSummaryCard'
import { RecommendedNextSteps } from '../timeline/RecommendedNextSteps'
import { SkeletonAssistant } from '../common/SkeletonAssistant'
import { useCareerAssistant } from '@/hooks/useCareerAssistant'
import { cn } from '@/lib/utils'
import type { ChatMessageData } from '@/types/careerRoadmap'

export interface CareerAssistantProps {
  initialMessages?: ChatMessageData[]
  className?: string
  mode?: 'full' | 'chat-only'
}

export function CareerAssistant({
  initialMessages,
  className,
  mode = 'full',
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

  if (mode === 'chat-only') {
    return (
      <div className={cn('space-y-4 sm:space-y-5 text-left', className)}>
        {/* Interactive Consultation AI Workspace */}
        <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm hover:border-purple-500/30 transition-all text-left">
          <AssistantHeader onNewChat={handleNewChat} onClearChat={handleClearChat} />
          <Conversation messages={messages} isTyping={isSending} />
          <SuggestedPrompts prompts={suggestedPrompts.length > 0 ? suggestedPrompts : undefined} onSelectPrompt={handleSendMessage} />
          <PromptComposer onSendMessage={handleSendMessage} />
        </Card>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4 sm:space-y-5 text-left', className)}>
      {/* 1. Recommended Next Steps */}
      <RecommendedNextSteps />

      {/* 2. Today's Focus & Session Summary */}
      <SessionSummaryCard summary={sessionSummary} />

      {/* 2. Recommended Quick Actions */}
      <RecommendedActionsCard actions={recommendedActions.length > 0 ? recommendedActions : undefined} />

      {/* 3. Personalized Career Insights */}
      <CareerInsightsCard insights={insights} />

      {/* 4. Interactive Consultation AI Workspace */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm hover:border-purple-500/30 transition-all text-left">
        <AssistantHeader onNewChat={handleNewChat} onClearChat={handleClearChat} />
        <Conversation messages={messages} isTyping={isSending} />
        <SuggestedPrompts prompts={suggestedPrompts.length > 0 ? suggestedPrompts : undefined} onSelectPrompt={handleSendMessage} />
        <PromptComposer onSendMessage={handleSendMessage} />
      </Card>
    </div>
  )
}
export default CareerAssistant
