import { useState } from 'react'
import { ChevronDown, ChevronUp, Calendar, Clock, ShieldCheck, Search, MessageSquare, AlertCircle } from 'lucide-react'
import type { InterviewSessionResponse } from '@/types/interview'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface QuestionHistoryProps {
  sessions: InterviewSessionResponse[]
  onSelectSession?: (id: string) => void
}

export default function QuestionHistory({ sessions, onSelectSession }: QuestionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  const toggleSessionExpand = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id)
  }

  // Filter completed or active sessions
  const filteredSessions = sessions.filter((session) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      session.target_role?.toLowerCase().includes(query) ||
      session.company_name?.toLowerCase().includes(query) ||
      session.interview_type.toLowerCase().includes(query)
    )
  })

  const formatTimestamp = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4 text-left font-sans">
      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Filter session history by role, company, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9.5 text-xs dark:bg-dark-bg dark:border-slate-800 h-9.5 bg-slate-50"
        />
      </div>

      {/* Session list */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-dark-card space-y-2">
            <Clock size={24} className="mx-auto text-slate-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs">No matching sessions</h4>
            <p className="text-[10px] text-slate-500 max-w-[220px] mx-auto leading-normal">
              Either no sessions match your search or you haven't started any drills yet.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isExpanded = expandedSessionId === session.id
            const sessionDate = formatTimestamp(session.created_at)

            // Compute overall scores if not set explicitly
            const completedTurns = session.turns.filter((t) => t.score !== null)
            const averageScore = completedTurns.length
              ? Math.floor(completedTurns.reduce((acc, t) => acc + (t.score || 0), 0) / completedTurns.length)
              : null

            const formattedType = session.interview_type.replace('_', ' ')

            return (
              <Card
                key={session.id}
                className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleSessionExpand(session.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 cursor-pointer bg-transparent hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors duration-150 select-none"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white font-display">
                          {session.target_role || 'General Role'}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-medium">at {session.company_name || 'General Company'}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[9px] uppercase py-0 border-slate-250/50 text-slate-500 font-sans">
                          {formattedType}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] uppercase py-0 border-slate-250/50 text-slate-500 font-sans">
                          {session.difficulty}
                        </Badge>
                        <span className="text-[9px] text-slate-400 font-sans flex items-center gap-1">
                          <Calendar size={9} />
                          <span>{sessionDate}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3.5 mt-2 sm:mt-0">
                      {/* Score Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        {averageScore !== null ? (
                          <Badge className="bg-brand-500/10 text-brand-600 border-brand-500/20 text-[10px] py-0.5 px-2.5 font-bold">
                            Avg Score: {averageScore}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] py-0.5 px-2">
                            {session.status}
                          </Badge>
                        )}
                      </div>

                      {/* Expand Button */}
                      <div className="text-slate-400 dark:text-slate-550 shrink-0">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-900/15 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                      {/* Review details option */}
                      {onSelectSession && (
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => onSelectSession(session.id)}
                            className="h-8 text-[10px] font-bold gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck size={11} />
                            <span>View Full Report Analytics</span>
                          </Button>
                        </div>
                      )}

                      {/* Turns questions list */}
                      <div className="space-y-3.5">
                        <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Session Question Logs ({session.turns.length} total)
                        </span>

                        {session.turns.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">No questions were generated for this session.</p>
                        ) : (
                          session.turns.map((turn) => {
                            const isAnswered = !!turn.answer_text

                            return (
                              <div
                                key={turn.id}
                                className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-dark-card space-y-3"
                              >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-850">
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                    Q{turn.question_number}. {turn.question_category?.replace('_', ' ') || 'Core Category'}
                                  </span>
                                  {turn.score !== null && (
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] py-0 px-2 font-bold font-sans">
                                      Score: {turn.score}%
                                    </Badge>
                                  )}
                                </div>

                                {/* Body content */}
                                <div className="space-y-2 text-[10px] leading-relaxed">
                                  <div>
                                    <strong className="text-slate-700 dark:text-slate-350 block">Question:</strong>
                                    <p className="text-slate-800 dark:text-slate-300 font-medium font-sans mt-0.5">{turn.question_text}</p>
                                  </div>

                                  {isAnswered ? (
                                    <>
                                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-850/60">
                                        <strong className="text-slate-700 dark:text-slate-350 block">Your Answer:</strong>
                                        <p className="text-slate-650 dark:text-slate-400 mt-0.5 font-sans whitespace-pre-wrap">{turn.answer_text}</p>
                                      </div>
                                      {turn.feedback && (
                                        <div className="p-3 bg-brand-500/5 rounded-lg border border-brand-500/10 flex items-start gap-2 mt-2">
                                          <MessageSquare size={13} className="text-brand-500 shrink-0 mt-0.5" />
                                          <div>
                                            <strong className="text-slate-750 dark:text-slate-350 block mb-0.5">Evaluation Feedback:</strong>
                                            <p className="text-slate-650 dark:text-slate-400 font-sans">{turn.feedback}</p>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-rose-500 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 mt-1">
                                      <AlertCircle size={12} className="shrink-0" />
                                      <span>Question was skipped or unanswered.</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
