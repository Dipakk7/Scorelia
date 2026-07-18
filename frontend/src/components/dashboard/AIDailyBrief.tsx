import { Sparkles, ArrowRight, Calendar, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface AIDailyBriefProps {
  hasResumes: boolean
  atsScore: number
  interviewSessions: number
  careerProgress: number
}

export default function AIDailyBrief({
  hasResumes,
  atsScore,
  interviewSessions,
  careerProgress
}: AIDailyBriefProps) {
  const currentDate = new Date().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  // Heuristics for current state summary and priorities based on actual user workspace state
  const getDailyStatus = () => {
    if (!hasResumes) {
      return {
        summary: 'Your workspace is currently uncalibrated. To unlock career intelligence scoring and copilot advice, please upload an initial resume.',
        priorities: [
          { text: 'Upload your first resume in the Resumes page.', type: 'critical' },
          { text: 'Complete your profile information on the Settings page.', type: 'secondary' }
        ],
        advice: 'Starting with a resume lets our parser extract your skills and calculate your initial ATS match potential.'
      }
    }

    const priorities = []
    let summary = ''

    if (atsScore < 70) {
      summary = `Your profile alignment score is currently at ${atsScore}%, which is below the target threshold. `
      priorities.push({ text: `Optimize resume keyword densities to clear ATS filters (Current: ${atsScore}%)`, type: 'critical' })
    } else {
      summary = `Your profile is well-aligned with an average ATS score of ${atsScore}%. `
    }

    if (interviewSessions === 0) {
      summary += 'Your mock interview practice hasn\'t started yet.'
      priorities.push({ text: 'Run an initial AI mock interview prep session to calibrate verbal readiness.', type: 'warning' })
    } else if (interviewSessions < 3) {
      summary += `You have logged ${interviewSessions} interview practice sessions.`
      priorities.push({ text: 'Conduct additional mock interview loops to address key technical competencies.', type: 'secondary' })
    } else {
      summary += `Your interview readiness is active with ${interviewSessions} logged sessions.`
    }

    if (careerProgress === 0) {
      priorities.push({ text: 'Set up roadmap milestones to track your career roadmap progress.', type: 'secondary' })
    }

    // Default priorities if workspace is highly optimized
    if (priorities.length === 0) {
      priorities.push({ text: 'Monitor incoming vacancy matches and generate custom cover letters.', type: 'secondary' })
      priorities.push({ text: 'Maintain skills currency by completing active roadmap items.', type: 'secondary' })
    }

    const advice = atsScore >= 80 && interviewSessions >= 2
      ? 'Your profile is highly optimized. Focus on scanning active vacancy listings and generating tailored cover letters for direct applications.'
      : 'Prioritize addressing critical keyword gaps and logging mock interview loops to build robust technical fluency.'

    return {
      summary,
      priorities: priorities.slice(0, 2), // return top 2 priorities
      advice
    }
  }

  const brief = getDailyStatus()

  return (
    <Card className="border border-border bg-card/75 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left flex flex-col h-full justify-between font-sans text-xs">
      <div>
        <CardHeader className="pb-3 border-b border-border/60 text-left flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Sparkles size={14} className="stroke-[1.75]" />
            </div>
            <div className="text-left">
              <CardTitle className="text-xs font-black font-display text-foreground m-0 leading-none">
                AI Daily Brief
              </CardTitle>
              <CardDescription className="text-[9px] text-slate-500 leading-relaxed font-sans m-0 mt-1 font-medium">
                Workspace Copilot Analysis
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[9px] font-semibold bg-divider/40 border border-border/50 px-2 py-0.5 rounded-md leading-none select-none">
            <Calendar size={10} />
            <span>{currentDate}</span>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {/* Summary */}
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
              Workspace Overview
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium m-0">
              {brief.summary}
            </p>
          </div>

          {/* Priorities list */}
          <div className="space-y-2 pt-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
              Today's Priorities
            </span>
            <div className="space-y-2">
              {brief.priorities.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2.5 items-start p-2.5 rounded-xl border font-sans text-[10px] font-semibold text-left",
                    item.type === 'critical' ? 'bg-danger/5 border-danger/20 text-danger-hover' :
                    item.type === 'warning' ? 'bg-warning/5 border-warning/20 text-warning-hover' :
                    'bg-slate-50/50 dark:bg-slate-950/20 border-border/50 text-muted-foreground'
                  )}
                >
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  <span className="leading-normal">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advice block */}
          <div className="p-3 bg-surface-hover/30 border border-border/40 rounded-xl text-left space-y-1">
            <span className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-550 block leading-none">Copilot Strategy</span>
            <p className="text-[10px] text-body/90 leading-relaxed m-0 font-medium">
              {brief.advice}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
