import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { FileDown, Code, FileText, Printer } from 'lucide-react'
import toast from 'react-hot-toast'
import type {
  ResumeReviewResponse,
  ResumeOptimizationResponse,
  ResumeRewriteResponse,
} from '@/types/resume-intelligence'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  reviewData?: ResumeReviewResponse | null
  optimizationData?: ResumeOptimizationResponse | null
  rewriteData?: ResumeRewriteResponse | null
  resumeFilename?: string
}

export function ExportDialog({
  isOpen,
  onClose,
  reviewData,
  optimizationData,
  rewriteData,
  resumeFilename = 'resume_report',
}: ExportDialogProps) {
  const [selectedReports, setSelectedReports] = useState({
    review: true,
    optimization: true,
    comparison: false,
  })
  const [format, setFormat] = useState<'json' | 'markdown' | 'pdf'>('markdown')

  const toggleReport = (key: keyof typeof selectedReports) => {
    setSelectedReports({
      ...selectedReports,
      [key]: !selectedReports[key],
    })
  }

  // Helper to compile data into nested JSON object
  const compileReportData = () => {
    const data: Record<string, any> = {
      exported_at: new Date().toISOString(),
      filename: resumeFilename,
    }

    if (selectedReports.review && reviewData) {
      data.review_report = {
        overall_score: reviewData.overall_score,
        overall_summary: reviewData.overall_summary,
        strengths: reviewData.strengths,
        weaknesses: reviewData.weaknesses,
        recommendations: reviewData.recommendations,
        grammar_feedback: reviewData.grammar_feedback,
        ats_feedback: reviewData.ats_feedback,
      }
    }

    if (selectedReports.optimization && optimizationData) {
      data.optimization_report = {
        quality_score: optimizationData.quality_score,
        missing_skills: optimizationData.missing_skills,
        ats_optimization: optimizationData.ats_optimization,
        keyword_density: optimizationData.keyword_optimization,
        achievement_suggestions: optimizationData.achievement_optimization,
      }
    }

    if (selectedReports.comparison && rewriteData) {
      data.comparison_report = {
        mode: rewriteData.rewrite_mode,
        original_content: rewriteData.original_content,
        rewritten_content: rewriteData.rewritten_content,
        change_tracking: rewriteData.change_tracking,
      }
    }

    return data
  }

  // Generate Markdown report string
  const generateMarkdown = (data: any) => {
    let md = `# CareerPilot AI Resume Intelligence Report\n`
    md += `**Date Exported:** ${new Date().toLocaleDateString()}\n`
    md += `**Source Document:** ${resumeFilename}\n\n`
    md += `---\n\n`

    if (data.review_report) {
      const rev = data.review_report
      md += `## 1. AI Review Summary\n`
      md += `**Overall Quality Score:** ${rev.overall_score}/100\n\n`
      md += `### Assessment\n${rev.overall_summary}\n\n`
      
      md += `### Key Strengths\n`
      rev.strengths.forEach((s: string) => {
        md += `- ${s}\n`
      })
      md += `\n`

      md += `### Areas for Improvement\n`
      rev.weaknesses.forEach((w: string) => {
        md += `- ${w}\n`
      })
      md += `\n`

      md += `### Grammar & Formatting Comments\n`
      md += `${rev.grammar_feedback || 'No grammar issues flagged.'}\n\n`

      md += `### ATS Optimization Details\n`
      md += `${rev.ats_feedback || 'No ATS issues flagged.'}\n\n`
    }

    if (data.optimization_report) {
      const opt = data.optimization_report
      md += `## 2. ATS & Keyword Optimization Recommendations\n`
      if (opt.ats_optimization) {
        md += `**ATS Diagnostics:** ${opt.ats_optimization.why_score_is_low || 'Profile shows alignment.'}\n\n`
        md += `**Missing Keywords:** ${(opt.ats_optimization.missing_keywords || []).join(', ')}\n\n`
      }

      md += `### Missing Required Skills & Courses\n`
      if (opt.missing_skills && opt.missing_skills.length > 0) {
        opt.missing_skills.forEach((s: any) => {
          md += `* **${s.skill}** (Priority: ${s.priority}, Difficulty: ${s.difficulty}, Estimated: ${s.estimated_time})\n  *Why:* ${s.why_it_matters}\n`
        })
      } else {
        md += `No missing skills identified.\n`
      }
      md += `\n`

      md += `### Achievement Bullet Optimizations\n`
      if (opt.achievement_suggestions && opt.achievement_suggestions.length > 0) {
        opt.achievement_suggestions.forEach((a: any) => {
          md += `* **Original:** ${a.original_bullet}\n  * **Suggested:** ${a.suggested_bullet}\n  * *Reason:* ${a.reason}\n`
        })
      } else {
        md += `No bullet points require immediate optimization.\n`
      }
      md += `\n`
    }

    if (data.comparison_report) {
      const comp = data.comparison_report
      md += `## 3. Style Rewrite Summary\n`
      md += `**Rewrite Style Mode:** ${comp.mode}\n\n`
      md += `### Key Modifications Tracking\n`
      Object.entries(comp.change_tracking || {}).forEach(([section, track]: any) => {
        md += `### Section: ${section.toUpperCase()}\n`
        md += `* **Original:** ${track.original}\n`
        md += `* **Rewritten:** ${track.rewritten}\n`
        md += `* **Reasoning:** ${track.reason}\n\n`
      })
    }

    return md
  }

  const handleExport = () => {
    const compiledData = compileReportData()
    const keysCount = Object.keys(compiledData).length

    if (keysCount <= 2) {
      toast.error('Please select at least one report section to export.')
      return
    }

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(compiledData, null, 2))
      const link = document.createElement('a')
      link.setAttribute('href', dataStr)
      link.setAttribute('download', `careerpilot_ai_report_${resumeFilename}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('JSON Report downloaded.')
    } else if (format === 'markdown') {
      const mdContent = generateMarkdown(compiledData)
      const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(mdContent)
      const link = document.createElement('a')
      link.setAttribute('href', dataStr)
      link.setAttribute('download', `careerpilot_ai_report_${resumeFilename}.md`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Markdown Report downloaded.')
    } else if (format === 'pdf') {
      // Direct printing with modern clean layout
      const mdContent = generateMarkdown(compiledData)
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>AI Resume Intelligence Report</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px; }
                h2 { color: #0f172a; margin-top: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; font-size: 18px; }
                h3 { font-size: 14px; margin-top: 15px; color: #475569; }
                p, li { font-size: 13px; color: #334155; }
                ul { padding-left: 20px; }
                code { font-family: monospace; background: #f8fafc; padding: 2px 4px; border-radius: 4px; }
                hr { border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0; }
                .meta { font-size: 11px; color: #64748b; margin-bottom: 30px; }
              </style>
            </head>
            <body>
              ${mdContent
                .replace(/# (.*)/g, '<h1>$1</h1>')
                .replace(/## (.*)/g, '<h2>$1</h2>')
                .replace(/### (.*)/g, '<h3>$1</h3>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\* (.*)/g, '<li>$1</li>')
                .replace(/- (.*)/g, '<li>$1</li>')
                .replace(/\n\n/g, '<p></p>')
                .replace(/\n/g, '<br />')}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
        toast.success('Print dialog opened.')
      } else {
        toast.error('Unable to open print tab. Please check pop-up blockers.')
      }
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md font-sans text-left dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Export Intelligence Reports</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Select which section segments to bundle and compile for download.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Section Selection */}
          <div className="space-y-2.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Compile Sections
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                {
                  key: 'review',
                  label: 'AI Review & Score Summary',
                  desc: 'Grading details, overall executive summary, strengths, and weaknesses.',
                  disabled: !reviewData,
                },
                {
                  key: 'optimization',
                  label: 'ATS Keyword Suggestions',
                  desc: 'Missing required skills, bullet point achievement enhancements.',
                  disabled: !optimizationData,
                },
                {
                  key: 'comparison',
                  label: 'Comparison Rewrite Report',
                  desc: 'Side-by-side original vs style rewrite change tracking logs.',
                  disabled: !rewriteData,
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  disabled={opt.disabled}
                  onClick={() => toggleReport(opt.key as keyof typeof selectedReports)}
                  className={`flex items-start gap-3 p-3 border rounded-xl transition-all cursor-pointer text-left w-full disabled:opacity-40 disabled:cursor-not-allowed ${
                    selectedReports[opt.key as keyof typeof selectedReports] && !opt.disabled
                      ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                      selectedReports[opt.key as keyof typeof selectedReports] && !opt.disabled
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'border-slate-350 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {selectedReports[opt.key as keyof typeof selectedReports] && !opt.disabled && (
                      <span className="text-[10px] font-bold">✓</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-850 dark:text-slate-200">
                      {opt.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formats Selection */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              File Format
            </span>
            <div className="flex gap-3">
              {[
                { key: 'markdown', label: 'Markdown', icon: FileText, desc: 'Clean stylized report' },
                { key: 'json', label: 'JSON Data', icon: Code, desc: 'Raw nested dictionary' },
                { key: 'pdf', label: 'Print PDF', icon: Printer, desc: 'Direct browser printing' },
              ].map((f) => {
                const Icon = f.icon
                return (
                  <button
                    key={f.key}
                    onClick={() => setFormat(f.key as any)}
                    className={`flex-1 flex flex-col items-center p-3 border rounded-xl transition-all cursor-pointer ${
                      format === f.key
                        ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                        : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span className="text-xs font-semibold">{f.label}</span>
                    <span className="text-[9px] text-slate-450 text-center leading-tight mt-0.5">{f.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1 cursor-pointer"
          >
            <FileDown size={14} />
            <span>Generate Report</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportDialog
