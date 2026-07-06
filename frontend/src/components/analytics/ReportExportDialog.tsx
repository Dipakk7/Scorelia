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
import {
  useDashboardAnalytics,
  useResumeAnalytics,
  useAtsAnalytics,
  useInterviewHistoryAnalytics,
  useProfileStats,
  useGithubProfile,
  useGithubInsights,
} from '@/api/analytics'
import { Download, FileJson, FileSpreadsheet, FileText, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ReportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultGithubUsername?: string
}

type ReportType = 'analytics' | 'resume' | 'ats' | 'interview' | 'career' | 'github'
type FormatType = 'pdf' | 'csv' | 'json'

export function ReportExportDialog({
  open,
  onOpenChange,
  defaultGithubUsername = '',
}: ReportExportDialogProps) {
  const [reportType, setReportType] = useState<ReportType>('analytics')
  const [formatType, setFormatType] = useState<FormatType>('pdf')
  const [githubUsername, setGithubUsername] = useState(defaultGithubUsername)
  const [exporting, setExporting] = useState(false)

  // Fetch queries (these will read from the React Query cache or trigger if needed)
  const dashboard = useDashboardAnalytics()
  const resume = useResumeAnalytics()
  const ats = useAtsAnalytics()
  const interview = useInterviewHistoryAnalytics()
  const profileStats = useProfileStats()
  const githubProfile = useGithubProfile(githubUsername)
  const githubInsights = useGithubInsights(githubUsername)

  const handleExport = async () => {
    setExporting(true)
    try {
      // Gather relevant data
      let exportData: any = null
      let filename = `careerpilot_${reportType}_report_${new Date().toISOString().split('T')[0]}`

      if (reportType === 'analytics') {
        if (!dashboard.data) throw new Error('Analytics summary data is loading, please try again.')
        exportData = { summary: dashboard.data, stats: profileStats.data || {} }
      } else if (reportType === 'resume') {
        if (!resume.data) throw new Error('Resume analytics data is loading, please try again.')
        exportData = resume.data
      } else if (reportType === 'ats') {
        if (!ats.data) throw new Error('ATS analytics data is loading, please try again.')
        exportData = ats.data
      } else if (reportType === 'interview') {
        if (!interview.data) throw new Error('Interview history analytics is loading, please try again.')
        exportData = interview.data
      } else if (reportType === 'career') {
        exportData = {
          career_progress: dashboard.data?.career_progress || 0,
          milestones_achieved: profileStats.data?.career_progress || 0,
        }
      } else if (reportType === 'github') {
        if (!githubUsername.trim()) throw new Error('Please specify a GitHub username for the report.')
        if (!githubProfile.data || !githubInsights.data) {
          throw new Error('GitHub intelligence data is loading, please try again.')
        }
        exportData = { profile: githubProfile.data, insights: githubInsights.data }
        filename += `_${githubUsername}`
      }

      if (formatType === 'json') {
        triggerJsonDownload(exportData, filename)
      } else if (formatType === 'csv') {
        triggerCsvDownload(exportData, filename, reportType)
      } else {
        triggerPdfDownload(exportData, filename, reportType)
      }

      toast.success('Report exported successfully!')
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to export report.')
    } finally {
      setExporting(false)
    }
  }

  // File Download Helpers
  const triggerJsonDownload = (data: any, name: string) => {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${name}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const triggerCsvDownload = (data: any, name: string, type: ReportType) => {
    let csvContent = ''
    if (type === 'analytics') {
      const summary = data.summary
      csvContent = `Metric,Value\n` +
        `Total Uploaded Resumes,${summary.total_resumes}\n` +
        `Total Parsed Resumes,${summary.parsed_resumes}\n` +
        `Average ATS Compliance,${summary.average_ats_score}%\n` +
        `Completed Job Matches,${summary.total_job_matches}\n` +
        `Average Match Compatibility,${summary.average_match_score}%\n` +
        `Career Milestone Progress,${summary.career_progress}%\n` +
        `Interview Prep Sessions,${summary.interview_sessions}\n` +
        `Cover Letters Generated,${summary.cover_letters_generated}\n` +
        `AI Usage Score,${summary.ai_usage}\n`
    } else if (type === 'resume') {
      csvContent = `Metric,Value\n` +
        `Total Resumes,${data.overview.total_resumes}\n` +
        `Parsed Resumes,${data.overview.parsed_resumes}\n` +
        `Success Rate,${data.overview.parsing_success_rate}%\n` +
        `Unique Skills Tracked,${data.skills.total_unique_skills}\n` +
        `Primary Tech Skill,${data.skills.most_common_skill}\n` +
        `Avg Experience Years,${data.experience.average_years_experience}\n`
    } else if (type === 'ats') {
      csvContent = `Evaluation Metric,Score,Weight\n` +
        `Average Score,${data.overview.average_ats_score}%,-\n` +
        `Contact Information,${data.category_breakdown.contact.average}%,${data.category_breakdown.contact.weight}\n` +
        `Skills Profile,${data.category_breakdown.skills.average}%,${data.category_breakdown.skills.weight}\n` +
        `Education Credentials,${data.category_breakdown.education.average}%,${data.category_breakdown.education.weight}\n` +
        `Experience Profile,${data.category_breakdown.experience.average}%,${data.category_breakdown.experience.weight}\n` +
        `Projects Portfolio,${data.category_breakdown.projects.average}%,${data.category_breakdown.projects.weight}\n` +
        `Certifications,${data.category_breakdown.certifications.average}%,${data.category_breakdown.certifications.weight}\n`
    } else if (type === 'interview') {
      csvContent = `Metric,Value\n` +
        `Total Interview Prep Sessions,${data.total_interviews}\n` +
        `Avg Communication Score,${data.average_communication_score}%\n` +
        `Avg Technical Evaluation,${data.average_technical_score}%\n` +
        `Avg STAR Structure Score,${data.average_star_score}%\n` +
        `Avg General Confidence,${data.average_confidence_score}%\n` +
        `Avg Overall Performance Score,${data.average_overall_score}%\n`
    } else if (type === 'career') {
      csvContent = `Milestones Progress,Value\n` +
        `Milestone Completion Rate,${data.career_progress}%\n` +
        `Target Achievements Completion,${data.milestones_achieved}%\n`
    } else if (type === 'github') {
      const p = data.profile.profile
      const i = data.insights
      csvContent = `Capability Index,Rating\n` +
        `GitHub Handle,${p.username}\n` +
        `Total Repositories,${p.public_repos_count}\n` +
        `Developer Score,${i.developer_score.developer_score}%\n` +
        `Code Quality,${i.developer_score.breakdown.code_quality_score}%\n` +
        `Documentation Score,${i.developer_score.breakdown.documentation_score}%\n` +
        `Complexity Rating,${i.developer_score.breakdown.complexity_score}%\n` +
        `Testing Standards,${i.developer_score.breakdown.testing_score}%\n` +
        `Security Score,${i.developer_score.breakdown.security_score}%\n`
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${name}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Styled PDF Print Generator
  const triggerPdfDownload = (data: any, name: string, type: ReportType) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    let htmlContent = `
      <html>
        <head>
          <title>${name.replace(/_/g, ' ').toUpperCase()}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { color: #4f46e5; margin: 0; font-size: 24px; font-weight: bold; }
            .meta { font-size: 11px; color: #64748b; margin-top: 5px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
            th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            th { background-color: #f8fafc; font-weight: bold; color: #475569; }
            .badge { display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: bold; border-radius: 4px; background-color: #4f46e5; color: white; }
            .footer { border-top: 1px solid #e2e8f0; margin-top: 50px; padding-top: 15px; font-size: 10px; color: #94a3b8; text-align: center; }
            .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: center; }
            .score-val { font-size: 32px; font-weight: 900; color: #4f46e5; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">CareerPilot AI</h1>
              <div class="meta">Exported on: ${new Date().toLocaleString()}</div>
            </div>
            <div class="badge">${type.toUpperCase()} REPORT</div>
          </div>
    `

    if (type === 'analytics') {
      const s = data.summary
      htmlContent += `
        <div class="section">
          <h2 class="section-title">Core Performance Indicators</h2>
          <table>
            <thead>
              <tr><th>Metric Indicator</th><th>Current Rating</th></tr>
            </thead>
            <tbody>
              <tr><td>Total Resumes Managed</td><td>${s.total_resumes}</td></tr>
              <tr><td>Parsed Resumes Count</td><td>${s.parsed_resumes}</td></tr>
              <tr><td>Average ATS Score</td><td><strong>${s.average_ats_score}%</strong></td></tr>
              <tr><td>Job Description Matches</td><td>${s.total_job_matches}</td></tr>
              <tr><td>Average Match Compatibility</td><td><strong>${s.average_match_score}%</strong></td></tr>
              <tr><td>Career Roadmap Milestones Progress</td><td>${s.career_progress}%</td></tr>
              <tr><td>Interview Prep Sessions</td><td>${s.interview_sessions}</td></tr>
              <tr><td>Cover Letters Generated</td><td>${s.cover_letters_generated}</td></tr>
              <tr><td>AI Usage Score</td><td>${s.ai_usage} interactions</td></tr>
            </tbody>
          </table>
        </div>
      `
    } else if (type === 'resume') {
      const r = data
      htmlContent += `
        <div class="section">
          <h2 class="section-title">Resume Builder Overview</h2>
          <table>
            <tr><td>Total Resumes</td><td>${r.overview.total_resumes}</td></tr>
            <tr><td>Parsed Resumes</td><td>${r.overview.parsed_resumes}</td></tr>
            <tr><td>Parsing Success Rate</td><td>${r.overview.parsing_success_rate}%</td></tr>
            <tr><td>Average Character Count</td><td>${r.overview.average_resume_length} chars</td></tr>
          </table>
        </div>
        <div class="section">
          <h2 class="section-title">Skills Intelligence</h2>
          <p><strong>Primary Tech Skill:</strong> ${r.skills.most_common_skill}</p>
          <p><strong>Total Unique Skills Tracked:</strong> ${r.skills.total_unique_skills}</p>
          <h3>Top Skills in Database</h3>
          <ul>
            ${r.skills.top_skills.map((s: string) => `<li>${s} (found in ${r.skills.skill_frequency[s] || 1} resumes)</li>`).join('')}
          </ul>
        </div>
      `
    } else if (type === 'ats') {
      const a = data
      htmlContent += `
        <div class="score-card">
          <div>AVERAGE ATS COMPLIANCE RATING</div>
          <div class="score-val">${a.overview.average_ats_score}%</div>
          <div>Across ${a.overview.total_ats_evaluations} evaluations</div>
        </div>
        <div class="section">
          <h2 class="section-title">Category Breakdown</h2>
          <table>
            <thead>
              <tr><th>Evaluation Area</th><th>Score</th><th>Impact Weight</th></tr>
            </thead>
            <tbody>
              <tr><td>Contact Details</td><td>${a.category_breakdown.contact.average}%</td><td>${a.category_breakdown.contact.weight}</td></tr>
              <tr><td>Core Skills Alignment</td><td>${a.category_breakdown.skills.average}%</td><td>${a.category_breakdown.skills.weight}</td></tr>
              <tr><td>Education Alignment</td><td>${a.category_breakdown.education.average}%</td><td>${a.category_breakdown.education.weight}</td></tr>
              <tr><td>Experience Fit</td><td>${a.category_breakdown.experience.average}%</td><td>${a.category_breakdown.experience.weight}</td></tr>
              <tr><td>Projects Fit</td><td>${a.category_breakdown.projects.average}%</td><td>${a.category_breakdown.projects.weight}</td></tr>
              <tr><td>Certifications Fit</td><td>${a.category_breakdown.certifications.average}%</td><td>${a.category_breakdown.certifications.weight}</td></tr>
            </tbody>
          </table>
        </div>
      `
    } else if (type === 'interview') {
      const i = data
      htmlContent += `
        <div class="score-card">
          <div>OVERALL INTERVIEW EVALUATION</div>
          <div class="score-val">${i.average_overall_score}%</div>
          <div>Based on ${i.total_interviews} simulated session prep</div>
        </div>
        <div class="section">
          <h2 class="section-title">Performance Metrics</h2>
          <table>
            <tr><td>STAR Structure Execution</td><td>${i.average_star_score}%</td></tr>
            <tr><td>Technical Competency Assessment</td><td>${i.average_technical_score}%</td></tr>
            <tr><td>Communication & Speech Quality</td><td>${i.average_communication_score}%</td></tr>
            <tr><td>General Confidence Level</td><td>${i.average_confidence_score}%</td></tr>
          </table>
        </div>
      `
    } else if (type === 'career') {
      htmlContent += `
        <div class="score-card">
          <div>ROADMAP MILESTONE ACHIEVEMENT</div>
          <div class="score-val">${data.career_progress}%</div>
          <div>Milestones completed relative to plan</div>
        </div>
      `
    } else if (type === 'github') {
      const p = data.profile.profile
      const i = data.insights
      htmlContent += `
        <div class="score-card">
          <div>DEVELOPER IQ SCORE</div>
          <div class="score-val">${i.developer_score.developer_score}/100</div>
          <div>User: @${p.username} (${p.name || 'Developer'})</div>
        </div>
        <div class="section">
          <h2 class="section-title">Profile Summary</h2>
          <table>
            <tr><td>Public Repos</td><td>${p.public_repos_count}</td></tr>
            <tr><td>Total Stars</td><td>${data.profile.repository_summary.total_stars}</td></tr>
            <tr><td>Total Forks</td><td>${data.profile.repository_summary.total_forks}</td></tr>
            <tr><td>Account Age</td><td>${p.account_age_years.toFixed(1)} years</td></tr>
          </table>
        </div>
        <div class="section">
          <h2 class="section-title">Quality Metrics Breakdown</h2>
          <table>
            <tr><td>Code Quality Standard</td><td>${i.developer_score.breakdown.code_quality_score}%</td></tr>
            <tr><td>Documentation Quality</td><td>${i.developer_score.breakdown.documentation_score}%</td></tr>
            <tr><td>Nesting Logic & Complexity</td><td>${i.developer_score.breakdown.complexity_score}%</td></tr>
            <tr><td>Testing Standards Compliance</td><td>${i.developer_score.breakdown.testing_score}%</td></tr>
            <tr><td>Security Standards Compliance</td><td>${i.developer_score.breakdown.security_score}%</td></tr>
          </table>
        </div>
      `
    }

    htmlContent += `
          <div class="footer">
            Powered by CareerPilot AI — Centralized Intelligence Center &copy; ${new Date().getFullYear()}
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
            Export Intelligence Report
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 dark:text-slate-500">
            Generate custom data exports from your CareerPilot modules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 font-sans text-xs">
          {/* Report Category Select */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              1. Select Report Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'analytics', label: 'Overall Analytics' },
                { value: 'resume', label: 'Resume Profile' },
                { value: 'ats', label: 'ATS Metrics' },
                { value: 'interview', label: 'AI Interviews' },
                { value: 'career', label: 'Career Roadmaps' },
                { value: 'github', label: 'GitHub Profile' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setReportType(item.value as ReportType)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    reportType === item.value
                      ? 'border-brand-500 bg-brand-500/5 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>{item.label}</span>
                  {reportType === item.value && <CheckCircle2 size={12} className="text-brand-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* GitHub Input */}
          {reportType === 'github' && (
            <div className="space-y-1.5 animate-slide-down">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Enter GitHub Username
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. torvalds"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
              />
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              2. Choose File Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'pdf', label: 'Print PDF', icon: FileText },
                { value: 'csv', label: 'CSV Sheet', icon: FileSpreadsheet },
                { value: 'json', label: 'JSON Data', icon: FileJson },
              ].map((item) => {
                const ItemIcon = item.icon
                return (
                  <button
                    key={item.value}
                    onClick={() => setFormatType(item.value as FormatType)}
                    className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      formatType === item.value
                        ? 'border-brand-500 bg-brand-500/5 text-brand-600 dark:text-brand-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ItemIcon size={18} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 font-bold rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-350 cursor-pointer text-xs p-2.5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white cursor-pointer shadow-md text-xs p-2.5 flex items-center justify-center gap-1.5"
          >
            {exporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Download Report</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
