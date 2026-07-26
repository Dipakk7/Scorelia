import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Lightbulb, MessageSquareCode, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const InterviewInsightsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'communication' | 'technical' | 'behavioral'>('communication')

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Lightbulb className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              Interview Guidance & Tips
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Key strategies for high-scoring interview answers.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('communication')}
            className={`rounded-lg py-1.5 transition-all cursor-pointer ${
              activeTab === 'communication'
                ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--heading)]'
            }`}
          >
            Communication
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={`rounded-lg py-1.5 transition-all cursor-pointer ${
              activeTab === 'technical'
                ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--heading)]'
            }`}
          >
            Technical
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('behavioral')}
            className={`rounded-lg py-1.5 transition-all cursor-pointer ${
              activeTab === 'behavioral'
                ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--heading)]'
            }`}
          >
            Behavioral
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="space-y-2.5 text-xs text-[var(--body)]">
          {activeTab === 'communication' && (
            <>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <div>
                  <h5 className="font-semibold text-[var(--heading)]">Pacing & Clarity</h5>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    Aim for 120–140 words per minute. Pause briefly between key concepts to allow interviewer comprehension.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <div>
                  <h5 className="font-semibold text-[var(--heading)]">Structure First</h5>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    Start with a 1-sentence high-level summary before diving into deep technical implementation details.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'technical' && (
            <>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <MessageSquareCode className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <div>
                  <h5 className="font-semibold text-[var(--heading)]">Trade-Off Analysis</h5>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    Always justify architectural choices with explicit time vs. space complexity or latency trade-offs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <MessageSquareCode className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <div>
                  <h5 className="font-semibold text-[var(--heading)]">Edge Cases & Metrics</h5>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    Mention specific metrics (e.g. 99.9% uptime, -40% query latency) and handling failovers.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'behavioral' && (
            <>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <div>
                  <h5 className="font-semibold text-[var(--heading)]">STAR Method</h5>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    <strong>Situation:</strong> Context (15%) • <strong>Task:</strong> Goal (15%) • <strong>Action:</strong> Your execution (50%) • <strong>Result:</strong> Outcome (20%).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <div>
                  <h5 className="font-semibold text-[var(--heading)]">Ownership ("I" vs "We")</h5>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    Acknowledge your team while clearly spelling out your specific contribution and ownership.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewInsightsCard
