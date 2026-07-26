import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Bot, Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'

export interface AIThinkingCardProps {
  message?: string
}

export const AIThinkingCard: React.FC<AIThinkingCardProps> = ({
  message = "Alex is evaluating your target role parameters and preparing the next interview question...",
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              AI Interviewer Thinking
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Contextual reasoning and next turn generation.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-8 text-center">
        {/* Animated Avatar Icon & Pulsing Ring */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--primary)]/10 animate-ping" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 text-white shadow-md">
            <Bot className="h-8 w-8" aria-hidden="true" />
          </div>
        </div>

        {/* Animated Typing Dots */}
        <div className="flex items-center justify-center gap-2" aria-live="polite" aria-busy="true">
          <span className="text-sm font-semibold text-[var(--heading)]">Generating Next Prompt</span>
          <div className="flex items-center gap-1.5 pt-1">
            {!shouldReduceMotion ? (
              <>
                <motion.span
                  className="h-2 w-2 rounded-full bg-[var(--primary)]"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="h-2 w-2 rounded-full bg-[var(--primary)]"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="h-2 w-2 rounded-full bg-[var(--primary)]"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </>
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* Friendly Message */}
        <p className="mx-auto max-w-md text-xs text-[var(--muted)] leading-relaxed">
          {message}
        </p>

        {/* Animated Progress Bar */}
        <div className="mx-auto max-w-sm space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-hover)] border border-[var(--border)]">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/70"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[10px] text-[var(--muted)]">Analyzing candidate seniority & technical domain...</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default AIThinkingCard
