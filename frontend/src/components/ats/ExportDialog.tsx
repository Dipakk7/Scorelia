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
import { FileDown, Code, Database } from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  atsData?: any
  matchData?: any
  keywordData?: any
}

export function ExportDialog({
  isOpen,
  onClose,
  atsData,
  matchData,
  keywordData,
}: ExportDialogProps) {
  const [selectedReports, setSelectedReports] = useState({
    ats: true,
    match: true,
    skills: true,
    keywords: true,
  })
  const [format, setFormat] = useState<'json' | 'csv'>('json')

  const toggleReport = (key: keyof typeof selectedReports) => {
    setSelectedReports({
      ...selectedReports,
      [key]: !selectedReports[key],
    })
  }

  const handleExport = () => {
    // Generate compiled report data
    const compiledData: Record<string, any> = {
      exported_at: new Date().toISOString(),
      report_version: '1.0',
    }

    if (selectedReports.ats && atsData) {
      compiledData.ats_analysis = {
        overall_score: atsData.overall_score,
        grade: atsData.grade,
        grade_summary: atsData.grade_summary,
        breakdown: atsData.breakdown,
        strengths: atsData.strengths,
        weaknesses: atsData.weaknesses,
        recommendations: atsData.recommendations,
      }
    }

    if (selectedReports.match && matchData) {
      compiledData.job_match = {
        match_score: matchData.match_score,
        grade: matchData.grade,
        breakdown: matchData.breakdown,
        matched_skills: matchData.matched_skills,
        missing_skills: matchData.missing_skills,
        extra_skills: matchData.extra_skills,
      }
    }

    if (selectedReports.skills && matchData) {
      compiledData.skill_gap = {
        missing_skills: matchData.missing_skills,
        recommendations: matchData.recommendations?.filter((r: any) => r.category === 'skills'),
      }
    }

    if (selectedReports.keywords && keywordData) {
      compiledData.keyword_analysis = keywordData
    }

    if (Object.keys(compiledData).length <= 2) {
      toast.error('Please select at least one report option to export.')
      return
    }

    // Trigger download depending on selected format
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(compiledData, null, 2))
      const link = document.createElement('a')
      link.setAttribute('href', dataStr)
      link.setAttribute('download', 'scorelia_ats_report.json')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // CSV Export
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Section,Metric,Value\n'

      if (compiledData.ats_analysis) {
        csvContent += `ATS Analysis,Overall Score,${compiledData.ats_analysis.overall_score}\n`
        csvContent += `ATS Analysis,Grade,${compiledData.ats_analysis.grade}\n`
        compiledData.ats_analysis.strengths.forEach((s: string) => {
          csvContent += `ATS Analysis,Strength,"${s.replace(/"/g, '""')}"\n`
        })
        compiledData.ats_analysis.weaknesses.forEach((w: string) => {
          csvContent += `ATS Analysis,Weakness,"${w.replace(/"/g, '""')}"\n`
        })
      }

      if (compiledData.job_match) {
        csvContent += `Job Match,Overall Match,${compiledData.job_match.match_score}%\n`
        csvContent += `Job Match,Grade,${compiledData.job_match.grade}\n`
        csvContent += `Job Match,Matched Skills Count,${compiledData.job_match.matched_skills.length}\n`
        csvContent += `Job Match,Missing Skills Count,${compiledData.job_match.missing_skills.length}\n`
      }

      if (compiledData.keyword_analysis) {
        csvContent += 'Keywords,Word,Frequency,Density,Status\n'
        compiledData.keyword_analysis.forEach((kw: any) => {
          csvContent += `Keywords,${kw.keyword},${kw.frequency},${kw.density.toFixed(2)}%,${kw.status}\n`
        })
      }

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'scorelia_ats_report.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    toast.success('Report exported successfully!')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md font-sans text-left dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Export ATS & Matching Reports</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Select the reports you wish to compile and download below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Options */}
          <div className="space-y-2.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Report Sections
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { key: 'ats', label: 'ATS Scorecard & Grading', desc: 'Overall grade, strengths, weaknesses, contact details.', disabled: !atsData },
                { key: 'match', label: 'Job Matching Score', desc: 'Job-to-resume suitability mapping and semantic score.', disabled: !matchData },
                { key: 'skills', label: 'Skill Gap & Learning Path', desc: 'Missing required technical/soft skills and course resources.', disabled: !matchData },
                { key: 'keywords', label: 'Keyword Density & Cloud', desc: 'Count details of matched and missing keywords.', disabled: !keywordData },
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
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
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

          {/* Formats */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              File Format
            </span>
            <div className="flex gap-3">
              {[
                { key: 'json', label: 'JSON Data', icon: Code, desc: 'Nested structural data file' },
                { key: 'csv', label: 'CSV Spreadsheet', icon: Database, desc: 'Tabular metric lists' },
              ].map((f) => {
                const Icon = f.icon
                return (
                  <button
                    key={f.key}
                    onClick={() => setFormat(f.key as 'json' | 'csv')}
                    className={`flex-1 flex flex-col items-center p-3 border rounded-xl transition-all cursor-pointer ${
                      format === f.key
                        ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                        : 'border-slate-250 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900'
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
            <span>Download Report</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportDialog
