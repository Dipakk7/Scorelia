import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CopilotHeader } from './CopilotHeader'
import { SuggestedPrompts } from './SuggestedPrompts'
import { CopilotConversation } from './ChatMessageList'
import { PromptComposer } from './PromptComposer'
import { ResumeContextCard } from './ResumeContextCard'
import { JobContextCard } from './JobContextCard'
import { STARCoachCard } from './STARCoachCard'
import { CodingAssistantCard } from './CodingAssistantCard'
import { InterviewTipsCard } from './InterviewTipsCard'
import { RecommendedActionsCard } from './RecommendedActionsCard'
import { CopilotSidebar } from './CopilotSidebar'
import { useInterviewCopilot } from '@/hooks/useInterviewPrep'
import type { CopilotChatMessage } from '@/types/interviewPrep'

export function InterviewCopilotWorkspace() {
  const { copilotData: data, isLoading, sendPrompt, isSending } = useInterviewCopilot()

  const [messages, setMessages] = useState<CopilotChatMessage[]>([])
  const [composerValue, setComposerValue] = useState<string>('')

  useEffect(() => {
    if (data?.messages && messages.length === 0) {
      setMessages(data.messages)
    }
  }, [data, messages.length])

  const handleSendMessage = async (text: string) => {
    const userMsg: CopilotChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setComposerValue('')

    const aiReply = await sendPrompt(text)
    setMessages((prev) => [...prev, aiReply])
  }

  const handleNewConversation = () => {
    if (data?.messages?.[0]) {
      setMessages([data.messages[0]])
    }
    setComposerValue('')
  }

  const handleClearConversation = () => {
    setMessages([])
    setComposerValue('')
  }

  if (isLoading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium">
        Loading Interview Copilot workspace...
      </div>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-5 text-left"
    >
      {/* 1. Header */}
      <CopilotHeader
        onNewConversation={handleNewConversation}
        onClearConversation={handleClearConversation}
        contextText="Google AI/ML Engineer Context Active"
      />

      {/* 2. Main 12-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* AI Chat Workspace (8 Columns) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5">
            {/* Suggested Quick Prompt Chips */}
            <SuggestedPrompts
              prompts={data.suggestedPrompts}
              onSelectPrompt={(text) => setComposerValue(text)}
            />

            {/* Scrollable Conversation Thread */}
            <CopilotConversation messages={messages} isTyping={isSending} />

            {/* Multiline Prompt Composer */}
            <PromptComposer
              value={composerValue}
              onChange={setComposerValue}
              onSend={handleSendMessage}
            />

            {/* Recommended Copilot Quick Actions */}
            <RecommendedActionsCard />
          </div>
        </div>

        {/* AI Context & Copilot Sidebar (4 Columns) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5">
            <ResumeContextCard resume={data.resumeContext} />
            <JobContextCard job={data.jobContext} />
            <STARCoachCard coach={data.starCoach} />
            <CodingAssistantCard assistant={data.codingAssistant} />
            <InterviewTipsCard />
            <CopilotSidebar sidebarData={data.sidebarData} />
          </div>
        </div>
      </div>
    </motion.main>
  )
}
export default InterviewCopilotWorkspace
