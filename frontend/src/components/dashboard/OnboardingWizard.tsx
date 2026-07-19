import { useState } from 'react'
import { Sparkles, CheckCircle2, ChevronRight, Compass } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface OnboardingWizardProps {
  onComplete: (role: string) => Promise<void>
  isCompleting: boolean
}

export default function OnboardingWizard({ onComplete, isCompleting }: OnboardingWizardProps) {
  const [step, setStep] = useState<number>(1)
  const [selectedRole, setSelectedRole] = useState<string>('Job Seeker')

  const roles = [
    { id: 'Job Seeker', label: 'Active Job Seeker', desc: 'Looking for a new role and optimizing applications.' },
    { id: 'Career Changer', label: 'Career Changer', desc: 'Transitioning to a new field or discipline.' },
    { id: 'Student', label: 'Student / Graduate', desc: 'Starting a career and building an initial profile.' },
    { id: 'Professional', label: 'Professional Growth', desc: 'Tracking and expanding skills in current industry.' }
  ]

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onComplete(selectedRole)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md select-none font-sans text-xs animate-fade-in">
      <Card className="w-full max-w-lg border border-border bg-card/90 shadow-2xl rounded-2xl overflow-hidden text-left flex flex-col justify-between min-h-[420px]">
        
        {/* Wizard Header */}
        <CardHeader className="pb-4 border-b border-border/60 text-left flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div className="text-left">
              <CardTitle className="text-sm font-black font-display text-foreground m-0 leading-none">
                Scorelia Copilot Setup
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans m-0 mt-1 font-medium">
                Step {step} of 3 • Account Activation
              </CardDescription>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-mono select-none">
            Welcome
          </span>
        </CardHeader>

        {/* Step Content */}
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-black text-foreground tracking-tight m-0 font-display">
                  Welcome to Scorelia AI
                </h2>
                <p className="text-muted-foreground text-xs font-medium leading-relaxed font-sans mt-2">
                  Scorelia is an AI-powered Career Command Center designed to align your resume with job requirements, draft customized cover letters, and prepare you for mock interviews.
                </p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3.5 items-start">
                <Compass className="text-primary shrink-0 mt-0.5" size={16} />
                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-bold text-foreground leading-none">Structured Career Insights</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed m-0 font-medium font-sans">
                    Our Explainable AI analyzes details to give you clear guidance on ATS scoring and specific keyword updates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-black text-foreground tracking-tight m-0 font-display">
                  Confirm Your Profile Track
                </h2>
                <p className="text-muted-foreground text-xs font-medium leading-relaxed font-sans mt-2">
                  Select your primary focus area. This configures standard metrics in your Command Center.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={cn(
                      'p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all select-none hover:bg-surface-hover cursor-pointer bg-background/50 outline-none',
                      selectedRole === r.id
                        ? 'border-primary bg-primary/5 text-primary shadow-xs'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    <span className="font-bold text-xs text-foreground block leading-none mb-1 font-sans">{r.label}</span>
                    <span className="text-[9px] leading-normal text-muted-foreground font-medium font-sans">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-black text-foreground tracking-tight m-0 font-display">
                  Ready to Calibrate
                </h2>
                <p className="text-muted-foreground text-xs font-medium leading-relaxed font-sans mt-2">
                  Your Career Health score and AI Daily Brief are configured. Finish setup to access your active workspace.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                {[
                  'Upload a resume to initialize keyword calibration.',
                  'Run an AI mock interview prep to calibrate tech readiness.',
                  'Map roadmap milestones to track your career path.'
                ].map((text, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center font-sans text-xs">
                    <CheckCircle2 className="text-primary shrink-0" size={14} />
                    <span className="text-muted-foreground font-medium leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Wizard Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-surface flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  step === s ? 'w-4.5 bg-primary' : 'w-1.5 bg-divider'
                )}
              />
            ))}
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={nextStep}
            disabled={isCompleting}
            className="gap-1.5"
          >
            {isCompleting ? (
              <span>Activating...</span>
            ) : (
              <>
                <span>{step === 3 ? 'Start Journey' : 'Next'}</span>
                <ChevronRight size={13} />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
