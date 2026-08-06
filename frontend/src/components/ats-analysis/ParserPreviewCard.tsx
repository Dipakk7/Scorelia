import React, { useState } from 'react'
import { Cpu, FileText, Code2, CheckCircle2, ArrowRight } from 'lucide-react'
import { mockParserPreview } from '@/lib/ats-mock-data'
import { cn } from '@/lib/utils'

export const ParserPreviewCard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'text' | 'json'>('text')

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            ATS Parser Simulation Preview
          </h3>
          <p className="text-xs text-slate-400">
            Compare visual resume document against plain text output parsed by Applicant Tracking Systems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {mockParserPreview.parseSuccessRate}% Parse Success Rate
          </span>

          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('text')}
              className={cn(
                'px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer',
                viewMode === 'text' ? 'bg-purple-600/30 text-purple-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Text
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={cn(
                'px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer',
                viewMode === 'json' ? 'bg-purple-600/30 text-purple-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Dual Panel Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Panel: Original Visual Resume Document */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-3 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Original Resume Visual Layout
            </span>
            <span className="text-[10px] font-mono text-slate-400">Software_Engineer_Resume.pdf</span>
          </div>

          <pre className="font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[180px] max-h-72 overflow-y-auto p-3 rounded-lg bg-slate-900/60 border border-slate-800/50 flex-1">
            {mockParserPreview.originalPreviewText}
          </pre>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Format check passed: Standard typography & 0.5&quot; margins</span>
          </div>
        </div>

        {/* Center Transition Arrow on Desktop */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Right Panel: ATS Parsed Output (Text or JSON) */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-3 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              ATS Parsed Output ({viewMode.toUpperCase()})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Structured Data</span>
          </div>

          {viewMode === 'text' ? (
            <div className="font-mono text-xs text-slate-300 space-y-2 min-h-[180px] max-h-72 overflow-y-auto p-3 rounded-lg bg-slate-900/60 border border-slate-800/50 flex-1">
              <div className="text-emerald-400 font-bold">[PARSED CONTACT DATA]</div>
              <div>Name: {mockParserPreview.parsedJsonOutput.contact.name}</div>
              <div>Role: {mockParserPreview.parsedJsonOutput.contact.title}</div>
              <div>Email: {mockParserPreview.parsedJsonOutput.contact.email}</div>

              <div className="text-emerald-400 font-bold mt-2">[PARSED SKILLS INDEX]</div>
              <div className="flex flex-wrap gap-1">
                {mockParserPreview.parsedJsonOutput.parsedSkills.map((sk, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap min-h-[180px] max-h-72 overflow-y-auto p-3 rounded-lg bg-slate-900/60 border border-slate-800/50 flex-1">
              {JSON.stringify(mockParserPreview.parsedJsonOutput, null, 2)}
            </pre>
          )}

          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0 token extraction errors detected during simulation</span>
          </div>
        </div>
      </div>
    </div>
  )
}
