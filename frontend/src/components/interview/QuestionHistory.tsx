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
    <div className="space-y-4 text-left font-sans text-xs bg-transparent">
      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Filter session history by role, company, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9.5 text-xs bg-slate-55/50 dark:bg-slate-900/60 border border-border rounded-xl h-10 text-slate-855 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans shadow-2xs transition-colors"
        />
      </div>

      {/* Session list */}
      <div className="space-y-3.5">
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-205 dark:border-slate-850 rounded-2xl bg-card/70 backdrop-blur-md space-y-2.5">
            <Clock size={20} className="mx-auto text-muted-foreground" />
            <h4 className="font-bold text-foreground text-xs m-0 leading-none">No matching sessions</h4>
            <p className="text-[10px] text-muted-foreground max-w-[220px] mx-auto leading-relaxed m-0 font-medium font-sans">
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
                className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left"
              >
                <CardContent className="p-0">
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleSessionExpand(session.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 cursor-pointer bg-transparent hover:bg-slate-50/20 dark:hover:bg-slate-850/10 transition-colors duration-150 select-none"
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-xs text-foreground font-display m-0 leading-tight">
                          {session.target_role || 'General Role'}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-405 font-bold">at {session.company_name || 'General Company'}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0 px-2 border-slate-250/50 text-slate-500 font-sans leading-none">
                          {formattedType}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0 px-2 border-slate-250/50 text-slate-500 font-sans leading-none">
                          {session.difficulty}
                        </Badge>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-sans font-bold flex items-center gap-1">
                          <Calendar size={9} />
                          <span>{sessionDate}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3.5 mt-2 sm:mt-0">
                      {/* Score Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        {averageScore !== null ? (
                          <Badge className="bg-brand-500/10 text-brand-655 dark:text-brand-400 border-brand-500/20 text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-lg">
                            Avg Score: {averageScore}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-lg border-slate-200 dark:border-slate-805 text-slate-500">
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
                    <div className="p-4 bg-slate-50/20 dark:bg-slate-950/10 border-t border-slate-100 dark:border-slate-850/80 space-y-4">
                      {/* Review details option */}
                      {onSelectSession && (
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => onSelectSession(session.id)}
                            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-border hover:border-brand-500/30 hover:bg-brand-500/5 transition-all bg-transparent rounded-lg h-8"
                          >
                            <ShieldCheck size={11} />
                            <span>View Full Report Analytics</span>
                          </Button>
                        </div>
                      )}

                      {/* Turns questions list */}
                      <div className="space-y-3.5 text-left">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-405 dark:text-slate-550 mb-1 leading-none">
                          Session Question Logs ({session.turns.length} total)
                        </span>

                        {session.turns.length === 0 ? (
                          <p className="text-[10px] text-muted-foreground italic font-medium m-0">No questions were generated for this session.</p>
                        ) : (
                          session.turns.map((turn) => {
                            const isAnswered = !!turn.answer_text

                            return (
                              <div
                                key={turn.id}
                                className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-850 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md space-y-3 shadow-2xs hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-200"
                              >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-850">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-455 dark:text-slate-400">
                                    Q{turn.question_number}. {turn.question_category?.replace('_', ' ') || 'Core Category'}
                                  </span>
                                  {turn.score !== null && (
                                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/15 text-[9px] font-black uppercase tracking-wider py-0 px-2 rounded-lg leading-none">
                                      Score: {turn.score}%
                                    </Badge>
                                  )}
                                </div>

                                {/* Body content */}
                                <div className="space-y-2.5 text-[10px] leading-relaxed">
                                  <div>
                                    <strong className="text-slate-700 dark:text-slate-350 block uppercase tracking-wider text-[9px] font-black">Question:</strong>
                                    <p className="text-slate-800 dark:text-slate-300 font-medium font-sans mt-0.5 m-0 leading-relaxed">{turn.question_text}</p>
                                  </div>

                                  {isAnswered ? (
                                    <>
                                      <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                                        <strong className="text-slate-700 dark:text-slate-350 block uppercase tracking-wider text-[9px] font-black">Your Answer:</strong>
                                        <p className="text-slate-655 dark:text-slate-400 mt-0.5 font-sans whitespace-pre-wrap m-0 font-medium leading-relaxed">{turn.answer_text}</p>
                                      </div>
                                      {turn.feedback && (
                                        <div className="p-3 bg-brand-500/5 rounded-xl border border-brand-500/10 flex items-start gap-2.5 mt-2.5">
                                          <MessageSquare size={13} className="text-brand-500 shrink-0 mt-0.5" />
                                          <div className="space-y-0.5">
                                            <strong className="text-slate-900 dark:text-slate-300 block uppercase tracking-wider text-[9px] font-black">Evaluation Feedback:</strong>
                                            <p className="text-slate-655 dark:text-slate-400 font-sans m-0 font-medium leading-relaxed">{turn.feedback}</p>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-rose-500 bg-rose-500/5 p-2 rounded-xl border border-rose-500/10 mt-1 font-bold text-[9px] uppercase tracking-wider">
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
