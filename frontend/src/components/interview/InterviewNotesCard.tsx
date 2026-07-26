import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { FileText, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export const InterviewNotesCard: React.FC = () => {
  const [notes, setNotes] = useState('')

  const handleClearNotes = () => {
    setNotes('')
    toast.success('Scratchpad notes cleared')
  }

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Interview Notes
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Private candidate scratchpad.
              </CardDescription>
            </div>
          </div>

          {notes && (
            <button
              type="button"
              onClick={handleClearNotes}
              className="flex items-center gap-1 text-[11px] font-medium text-[var(--danger)] hover:underline cursor-pointer"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-5">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notes entered here are private and will not affect AI scoring..."
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--body)] placeholder:text-[var(--muted)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />

        <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
          <span>Private & unmonitored</span>
          <span>{notes.length} characters</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewNotesCard
