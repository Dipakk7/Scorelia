import React from 'react'
import { AnswerCard } from './AnswerCard'
import type { AnswerHistoryItem } from '@/types/interviewPrep'

export interface AnswerHistoryListProps {
  answers: AnswerHistoryItem[]
  selectedId: string
  onSelectAnswer: (answer: AnswerHistoryItem) => void
  onToggleBookmark: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function AnswerHistoryList({
  answers,
  selectedId,
  onSelectAnswer,
  onToggleBookmark,
  onToggleFavorite,
}: AnswerHistoryListProps) {
  if (!answers || answers.length === 0) {
    return (
      <div className="p-8 text-center bg-[#10121e]/90 border border-white/10 rounded-2xl text-slate-400 text-xs font-medium space-y-1">
        <p>No answers found matching filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {answers.map((ans) => (
        <AnswerCard
          key={ans.id}
          answer={ans}
          isSelected={ans.id === selectedId}
          onSelect={onSelectAnswer}
          onToggleBookmark={onToggleBookmark}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
export default AnswerHistoryList
