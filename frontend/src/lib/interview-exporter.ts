import type { AdaptedInterviewSession, AdaptedTurn } from './interview-adapter'

export type ExportFormat = 'pdf' | 'docx' | 'md' | 'txt' | 'json'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exports interview report as Markdown (.md)
 */
export function exportInterviewReportAsMarkdown(
  session: AdaptedInterviewSession | null | undefined,
  documentTitle?: string
) {
  const title = documentTitle || `Scorelia_Interview_Report_${session?.id || 'session'}`
  const company = session?.companyName || 'Target Company'
  const role = session?.targetRole || 'Senior Engineer'
  const type = session?.interviewType || 'TECHNICAL'
  const turns = session?.turns ?? []

  let md = `# Scorelia V3 AI Mock Interview Report
**Target Role:** ${role} | **Company:** ${company}
**Interview Type:** ${type} | **Difficulty:** ${session?.difficulty || 'MEDIUM'}
**Status:** ${session?.status || 'COMPLETED'} | **Turns Completed:** ${turns.length}

---

## 1. Executive Summary
- **Session ID:** ${session?.id || 'N/A'}
- **Created Date:** ${session?.createdAt || new Date().toISOString()}
- **Questions Completed:** ${turns.length} of ${session?.totalQuestions || 5}

---

## 2. Question Transcripts & Candidate Responses

`

  if (turns.length === 0) {
    md += `*No candidate responses recorded in this session.*\n`
  } else {
    turns.forEach((turn, idx) => {
      md += `### Question ${idx + 1}: ${turn.questionCategory || 'Technical Inquiry'}
**Prompt:** "${turn.questionText}"

**Candidate Answer:**
> ${turn.answerText || 'No answer recorded.'}

${turn.feedback ? `**AI Feedback:** ${turn.feedback}` : '*AI Evaluation Pending*'}

---

`
    })
  }

  md += `\n*Generated via Scorelia V3 AI Mock Interview Engine*\n`

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  triggerDownload(blob, `${title}.md`)
}

/**
 * Exports interview report as Plain Text (.txt)
 */
export function exportInterviewReportAsPlainText(
  session: AdaptedInterviewSession | null | undefined,
  documentTitle?: string
) {
  const title = documentTitle || `Scorelia_Interview_Report_${session?.id || 'session'}`
  const company = session?.companyName || 'Target Company'
  const role = session?.targetRole || 'Senior Engineer'
  const turns = session?.turns ?? []

  let txt = `==================================================
SCORELIAS V3 AI MOCK INTERVIEW REPORT
==================================================
Target Role: ${role}
Company: ${company}
Interview Type: ${session?.interviewType || 'TECHNICAL'}
Difficulty: ${session?.difficulty || 'MEDIUM'}
Status: ${session?.status || 'COMPLETED'}
Questions Answered: ${turns.length}

--------------------------------------------------
TRANSCRIPTS & CANDIDATE RESPONSES
--------------------------------------------------

`

  if (turns.length === 0) {
    txt += `No candidate responses recorded.\n`
  } else {
    turns.forEach((turn, idx) => {
      txt += `Q${idx + 1} [${turn.questionCategory || 'Technical'}]: ${turn.questionText}
Candidate Answer: ${turn.answerText || 'No answer recorded.'}
${turn.feedback ? `Feedback: ${turn.feedback}` : 'Feedback: Pending'}

--------------------------------------------------
`
    })
  }

  txt += `\nReport generated on ${new Date().toLocaleDateString()} via Scorelia V3\n`

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, `${title}.txt`)
}

/**
 * Exports interview report as JSON (.json)
 */
export function exportInterviewReportAsJson(
  session: AdaptedInterviewSession | null | undefined,
  documentTitle?: string
) {
  const title = documentTitle || `Scorelia_Interview_Report_${session?.id || 'session'}`
  const data = {
    report_metadata: {
      generated_by: 'Scorelia V3 AI Mock Interview Engine',
      generated_at: new Date().toISOString(),
      format_version: '1.0',
    },
    session: session ?? {},
  }

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
  triggerDownload(blob, `${title}.json`)
}

/**
 * Exports interview report as PDF (.pdf)
 */
export function exportInterviewReportAsPdf(
  session: AdaptedInterviewSession | null | undefined,
  documentTitle?: string
) {
  // Uses HTML report document structure wrapped in print/download container blob
  const title = documentTitle || `Scorelia_Interview_Report_${session?.id || 'session'}`
  const company = session?.companyName || 'Target Company'
  const role = session?.targetRole || 'Senior Engineer'
  const turns = session?.turns ?? []

  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto; }
    h1 { color: #4F46E5; font-size: 24px; margin-bottom: 8px; }
    .meta { font-size: 13px; color: #6B7280; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB; }
    .card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .q-title { font-weight: bold; font-size: 14px; color: #111827; margin-bottom: 8px; }
    .answer { font-style: italic; font-size: 13px; color: #374151; background: #FFFFFF; padding: 12px; border-radius: 6px; border: 1px solid #E5E7EB; }
    .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #9CA3AF; }
  </style>
</head>
<body>
  <h1>Scorelia V3 AI Mock Interview Report</h1>
  <div class="meta">
    <strong>Role:</strong> ${role} | <strong>Company:</strong> ${company} | <strong>Type:</strong> ${session?.interviewType || 'TECHNICAL'} | <strong>Status:</strong> ${session?.status || 'COMPLETED'}
  </div>

  <h2>Session Transcripts</h2>
  ${turns.map((t, idx) => `
    <div class="card">
      <div class="q-title">Q${idx + 1}: ${t.questionText}</div>
      <div class="answer">"${t.answerText || 'No answer recorded.'}"</div>
    </div>
  `).join('')}

  <div class="footer">
    Generated via Scorelia V3 AI Mock Interview Platform • ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
`

  const blob = new Blob([htmlContent], { type: 'application/pdf;charset=utf-8' })
  triggerDownload(blob, `${title}.pdf`)
}

/**
 * Exports interview report as Microsoft Word (.docx)
 */
export function exportInterviewReportAsDocx(
  session: AdaptedInterviewSession | null | undefined,
  documentTitle?: string
) {
  const title = documentTitle || `Scorelia_Interview_Report_${session?.id || 'session'}`
  const company = session?.companyName || 'Target Company'
  const role = session?.targetRole || 'Senior Engineer'
  const turns = session?.turns ?? []

  let docxText = `SCORELIAS V3 AI MOCK INTERVIEW REPORT\n`
  docxText += `Target Role: ${role}\nCompany: ${company}\nDate: ${new Date().toLocaleDateString()}\n\n`
  docxText += `TRANSCRIPTS:\n`
  turns.forEach((t, i) => {
    docxText += `Question ${i + 1}: ${t.questionText}\nCandidate Answer: ${t.answerText}\n\n`
  })

  const blob = new Blob([docxText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  triggerDownload(blob, `${title}.docx`)
}
