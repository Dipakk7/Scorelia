import React from 'react'
import { Video, Zap, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface StartInterviewSectionProps {
  onStartInterview?: () => void
  isStarting?: boolean
}

export function StartInterviewSection({
  onStartInterview,
  isStarting = false,
}: StartInterviewSectionProps) {
  return (
    <Card className="bg-gradient-to-br from-[#121424] via-[#10121e] to-purple-950/30 border border-purple-500/30 rounded-2xl p-5 hover:border-purple-500/50 transition-all space-y-4 shadow-xl shadow-purple-950/20">
      <CardContent className="p-0 space-y-4 text-left">
        {/* Info Banner */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400 fill-purple-400/20" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Ready to Practice?
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Launch your simulated round. Your speech and STAR methodology storytelling will be evaluated in real time.
          </p>
        </div>

        {/* Feature Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">
            <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Real-time AI evaluation</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">
            <ShieldAlert className="h-4 w-4 text-purple-400 shrink-0" />
            <span>Anti-cheating detection</span>
          </div>
        </div>

        {/* Start CTA Button */}
        <Button
          onClick={onStartInterview}
          disabled={isStarting}
          className="w-full py-3 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40"
        >
          <Video className="h-4 w-4 fill-white" />
          <span>{isStarting ? 'Initializing Session...' : 'Start Mock Interview Now'}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
export default StartInterviewSection
