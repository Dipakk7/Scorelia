import type { ATSOverviewData, MetricItem, ATSCompatibilityItem } from './ats-mock-data'
import type { AIOverviewBannerData, PriorityRecommendationItem, RecruiterFeedbackData } from './ats-ai-mock-data'
import type { SectionDetailData } from './ats-section-mock-data'

export type ExportFormat = 'pdf' | 'markdown' | 'json'

export interface ATSReportPayload {
  resumeTitle?: string
  exportDate?: string
  overview?: ATSOverviewData
  aiBanner?: AIOverviewBannerData
  quickMetrics?: MetricItem[]
  compatibility?: ATSCompatibilityItem[]
  recommendations?: PriorityRecommendationItem[]
  recruiterFeedback?: RecruiterFeedbackData
  sectionDetails?: Record<string, SectionDetailData>
}

/**
 * Trigger browser file download for text/json/markdown content
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 1. Generate JSON Export Report
 */
export function exportATSReportJSON(payload: ATSReportPayload) {
  const jsonString = JSON.stringify(payload || {}, null, 2)
  const safeTitle = (payload?.resumeTitle || 'ATS_Report').replace(/[^a-zA-Z0-9_-]/g, '_')
  downloadFile(jsonString, `${safeTitle}_ATS_Report.json`, 'application/json')
}

/**
 * 2. Generate Markdown (.md) Export Report
 */
export function exportATSReportMarkdown(payload: ATSReportPayload) {
  const resumeTitle = payload?.resumeTitle || 'Software_Engineer_Resume.pdf'
  const exportDate = payload?.exportDate || new Date().toLocaleDateString()
  const overview = payload?.overview || { overallScore: 92, status: 'Excellent', percentile: 'Top 10%' }
  const aiBanner = payload?.aiBanner || { summary: '', readinessLevel: '92% Ready', recruiterImpression: 'Strong', passProbability: '95%' }
  const quickMetrics = payload?.quickMetrics || []
  const compatibility = payload?.compatibility || []
  const recommendations = payload?.recommendations || []
  const recruiterFeedback = payload?.recruiterFeedback || { firstImpression: 'Strong', strengths: [], weaknesses: [], verdict: 'Pass', interviewReadiness: 92 }
  const sectionDetails = payload?.sectionDetails || {}

  const recsList = recommendations.map((r, i) => `${i + 1}. **[${r?.priority || 'Medium'} Priority] ${r?.title || 'Recommendation'}** (${r?.estimatedImpact || ''})\n   - ${r?.description || ''}`).join('\n\n')

  const metricsTable = quickMetrics.map(m => `| ${m?.title || ''} | ${m?.score || 0}/100 | ${m?.status || ''} | ${m?.description || ''} |`).join('\n')

  const compatibilityTable = compatibility.map(c => `| ${c?.name || ''} | ${c?.score || 0}% | ${c?.status || ''} |`).join('\n')

  const sectionsText = Object.values(sectionDetails).map(s => `### ${s?.name || 'Section'} (Score: ${s?.score || 0}%)\n- **Status:** ${s?.status || ''}\n- **Summary:** ${s?.summary || ''}\n- **Recruiter Notes:** ${s?.recruiterNotes || ''}\n- **ATS Notes:** ${s?.atsNotes || ''}\n`).join('\n')

  const markdownContent = `# Scorelia V3 — ATS Analysis Report

**Resume File:** ${resumeTitle}  
**Date Generated:** ${exportDate}  
**Overall ATS Score:** ${overview.overallScore ?? 92} / 100 (${overview.status ?? 'Excellent'})  
**Candidate Percentile:** ${overview.percentile ?? 'Top 10%'}  

---

## Executive Summary
${aiBanner.summary ?? ''}

- **ATS Readiness Level:** ${aiBanner.readinessLevel ?? ''}
- **Recruiter Impression:** ${aiBanner.recruiterImpression ?? ''}
- **ATS Pass Probability:** ${aiBanner.passProbability ?? ''}

---

## Performance Metrics Breakdown

| Metric Name | Score | Status | Description |
| :--- | :--- | :--- | :--- |
${metricsTable}

---

## Enterprise ATS Compatibility

| ATS System Platform | Compatibility Score | Status |
| :--- | :--- | :--- |
${compatibilityTable}

---

## Priority Recommendations

${recsList}

---

## Recruiter Perspective Feedback

- **First Impression:** ${recruiterFeedback.firstImpression ?? ''}
- **Interview Readiness:** ${recruiterFeedback.interviewReadiness ?? 90}%
- **Verdict:** ${recruiterFeedback.verdict ?? ''}

### Key Strengths
${(recruiterFeedback.strengths ?? []).map(s => `- ${s}`).join('\n')}

### Areas for Improvement
${(recruiterFeedback.weaknesses ?? []).map(w => `- ${w}`).join('\n')}

---

## Section-by-Section Analysis

${sectionsText}

---

*Report generated automatically by Scorelia V3 ATS Analysis Engine.*
`

  const safeTitle = resumeTitle.replace(/[^a-zA-Z0-9_-]/g, '_')
  downloadFile(markdownContent, `${safeTitle}_ATS_Report.md`, 'text/markdown')
}

/**
 * 3. Generate PDF Report (Printable HTML Document)
 */
export function exportATSReportPDF(payload: ATSReportPayload) {
  const resumeTitle = payload?.resumeTitle || 'Software_Engineer_Resume.pdf'
  const exportDate = payload?.exportDate || new Date().toLocaleDateString()
  const overview = payload?.overview || { overallScore: 92, status: 'Excellent', percentile: 'Top 10%' }
  const aiBanner = payload?.aiBanner || { summary: '' }
  const quickMetrics = payload?.quickMetrics || []
  const recommendations = payload?.recommendations || []
  const recruiterFeedback = payload?.recruiterFeedback || { firstImpression: 'Strong', verdict: 'Pass' }

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>ATS Analysis Report - ${resumeTitle}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
    h1 { color: #6d28d9; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    h2 { color: #4338ca; margin-top: 24px; }
    .badge { background: #f3e8ff; color: #6d28d9; padding: 4px 8px; rounded: 4px; font-weight: bold; }
    .score-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <h1>Scorelia V3 — ATS Analysis Report</h1>
  <p><strong>Resume File:</strong> ${resumeTitle} | <strong>Export Date:</strong> ${exportDate}</p>
  
  <div class="score-box">
    <h2>Overall ATS Score: ${overview.overallScore ?? 92} / 100</h2>
    <p><strong>Status:</strong> ${overview.status ?? 'Excellent'} (${overview.percentile ?? 'Top 10%'})</p>
    <p>${aiBanner.summary ?? ''}</p>
  </div>

  <h2>Performance Metrics Breakdown</h2>
  <table>
    <tr><th>Metric</th><th>Score</th><th>Status</th><th>Description</th></tr>
    ${quickMetrics.map(m => `<tr><td><strong>${m?.title || ''}</strong></td><td>${m?.score || 0}/100</td><td>${m?.status || ''}</td><td>${m?.description || ''}</td></tr>`).join('')}
  </table>

  <h2>Recruiter Evaluation & Verdict</h2>
  <p><strong>First Impression:</strong> ${recruiterFeedback.firstImpression ?? ''}</p>
  <p><strong>Verdict:</strong> <span class="badge">${recruiterFeedback.verdict ?? ''}</span></p>

  <h2>Priority Recommendations</h2>
  <ol>
    ${recommendations.map(r => `<li><strong>[${r?.priority || 'Medium'} Priority] ${r?.title || ''}:</strong> ${r?.description || ''} (${r?.estimatedImpact || ''})</li>`).join('')}
  </ol>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
`

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
