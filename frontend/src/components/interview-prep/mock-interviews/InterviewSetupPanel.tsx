import React from 'react'
import { FileText, Briefcase, Building2, Clock, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { DifficultySelector } from './DifficultySelector'
import { InterviewTypeSelector } from './InterviewTypeSelector'
import { InterviewModeSelector } from './InterviewModeSelector'
import { cn } from '@/lib/utils'
import type {
  MockInterviewSetupConfig,
  ResumeOption,
  DifficultyOption,
  InterviewTypeOption,
  InterviewModeOption,
} from '@/types/interviewPrep'

export interface InterviewSetupPanelProps {
  config: MockInterviewSetupConfig
  onChangeConfig: (updated: Partial<MockInterviewSetupConfig>) => void
  resumes: ResumeOption[]
  difficulties: DifficultyOption[]
  interviewTypes: InterviewTypeOption[]
  interviewModes: InterviewModeOption[]
  isLoading?: boolean
}

export function InterviewSetupPanel({
  config,
  onChangeConfig,
  resumes,
  difficulties,
  interviewTypes,
  interviewModes,
  isLoading = false,
}: InterviewSetupPanelProps) {
  const durations = [15, 30, 45, 60]
  const experienceLevels: Array<'Entry' | 'Mid' | 'Senior' | 'Lead'> = ['Entry', 'Mid', 'Senior', 'Lead']

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-5">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Mock Interview Configuration
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Customize target role, difficulty, round type, and interaction mode
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5 text-left">
        {/* 1. Target Resume Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-purple-400" />
            Target Resume Profile
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {resumes.map((res) => {
              const isSelected = res.id === config.resumeId
              return (
                <div
                  key={res.id}
                  onClick={() => onChangeConfig({ resumeId: res.id, targetRole: res.roleTarget })}
                  className={cn(
                    'p-3 rounded-xl border transition-all cursor-pointer select-none space-y-1',
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-sm shadow-purple-900/30'
                      : 'bg-[#141627] border-white/10 text-slate-300 hover:border-white/20'
                  )}
                >
                  <span className="text-xs font-bold block truncate">{res.fileName}</span>
                  <span className="text-[10px] text-purple-300 block font-semibold">{res.roleTarget}</span>
                  <span className="text-[9px] text-slate-500 block">{res.lastUpdated}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. Role Target & Target Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-purple-400" />
              Target Role Title
            </label>
            <input
              type="text"
              value={config.targetRole}
              onChange={(e) => onChangeConfig({ targetRole: e.target.value })}
              placeholder="e.g. AI/ML Engineer, Senior Full Stack..."
              className="w-full bg-[#141627] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-purple-400" />
              Target Company (Optional)
            </label>
            <input
              type="text"
              value={config.companyName || ''}
              onChange={(e) => onChangeConfig({ companyName: e.target.value })}
              placeholder="e.g. Google, Meta, Microsoft..."
              className="w-full bg-[#141627] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        {/* 3. Experience Level & Duration Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              Experience Level
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {experienceLevels.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => onChangeConfig({ experienceLevel: exp })}
                  className={cn(
                    'py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer',
                    config.experienceLevel === exp
                      ? 'bg-purple-600/30 border-purple-500/50 text-purple-300'
                      : 'bg-[#141627] border-white/10 text-slate-400 hover:text-white'
                  )}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-purple-400" />
              Duration (Minutes)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {durations.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => onChangeConfig({ durationMinutes: dur })}
                  className={cn(
                    'py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer',
                    config.durationMinutes === dur
                      ? 'bg-purple-600/30 border-purple-500/50 text-purple-300'
                      : 'bg-[#141627] border-white/10 text-slate-400 hover:text-white'
                  )}
                >
                  {dur}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Interview Type Selector */}
        <InterviewTypeSelector
          types={interviewTypes}
          selectedId={config.interviewType}
          onSelect={(id) => onChangeConfig({ interviewType: id })}
        />

        {/* 5. Difficulty Level Selector */}
        <DifficultySelector
          difficulties={difficulties}
          selectedId={config.difficulty}
          onSelect={(id) => onChangeConfig({ difficulty: id })}
        />

        {/* 6. Interaction Mode Selector */}
        <InterviewModeSelector
          modes={interviewModes}
          selectedId={config.mode}
          onSelect={(id) => onChangeConfig({ mode: id })}
        />
      </CardContent>
    </Card>
  )
}
export default InterviewSetupPanel
