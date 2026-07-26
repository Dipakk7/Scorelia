import type { MockCoverLetterContent } from './cover-letter-mock-data'
import type { DocumentStyleSettings } from '@/components/cover-letter/DocumentStylePanel'

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
 * Exports cover letter in Markdown format (.md)
 */
export function exportAsMarkdown(
  content: MockCoverLetterContent,
  settings: DocumentStyleSettings,
  title: string
) {
  const md = `# ${content.applicantName}
**${content.applicantEmail}** | **${content.applicantPhone}** | ${content.applicantLocation} | ${content.applicantWebsite}

---

*${settings.dateFormat}*

**${content.recipientTitle}**  
*${content.companyName}*  
${content.companyAddress}

---

### ${content.salutation}

${content.introParagraph}

${content.bodyParagraph1}

${content.bodyParagraph2}

${content.closingParagraph}

---

**Sincerely,**  
${content.applicantName}

---
*Generated via Scorelia V3 Cover Letter Engine | ATS Score: ${content.atsScore}%*
`

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  triggerDownload(blob, `${title || 'Cover_Letter'}.md`)
}

/**
 * Exports cover letter in Plain Text format (.txt)
 */
export function exportAsPlainText(
  content: MockCoverLetterContent,
  settings: DocumentStyleSettings,
  title: string
) {
  const text = `${content.applicantName.toUpperCase()}
Email: ${content.applicantEmail} | Phone: ${content.applicantPhone}
Location: ${content.applicantLocation} | Web: ${content.applicantWebsite}

Date: ${settings.dateFormat}

Recipient: ${content.recipientTitle}
Company: ${content.companyName}
Address: ${content.companyAddress}

${content.salutation}

${content.introParagraph}

${content.bodyParagraph1}

${content.bodyParagraph2}

${content.closingParagraph}

Sincerely,
${content.applicantName}

--------------------------------------------------
Scorelia V3 Cover Letter | ATS Score: ${content.atsScore}%
`

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, `${title || 'Cover_Letter'}.txt`)
}

/**
 * Exports cover letter in JSON format (.json)
 */
export function exportAsJson(
  content: MockCoverLetterContent,
  settings: DocumentStyleSettings,
  title: string
) {
  const jsonPayload = {
    metadata: {
      generator: 'Scorelia V3 Cover Letter Engine',
      version: content.versionLabel,
      ats_score: content.atsScore,
      word_count: content.wordCount,
      exported_at: new Date().toISOString(),
      style_settings: settings,
    },
    applicant: {
      name: content.applicantName,
      email: content.applicantEmail,
      phone: content.applicantPhone,
      location: content.applicantLocation,
      website: content.applicantWebsite,
    },
    recipient: {
      title: content.recipientTitle,
      company: content.companyName,
      address: content.companyAddress,
      date: settings.dateFormat,
    },
    document: {
      salutation: content.salutation,
      intro_paragraph: content.introParagraph,
      body_paragraph_1: content.bodyParagraph1,
      body_paragraph_2: content.bodyParagraph2,
      closing_paragraph: content.closingParagraph,
      sign_off: content.signOff,
    },
  }

  const jsonStr = JSON.stringify(jsonPayload, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' })
  triggerDownload(blob, `${title || 'Cover_Letter'}.json`)
}

/**
 * Exports cover letter in HTML-printable PDF format (.pdf)
 */
export function exportAsPdf(
  content: MockCoverLetterContent,
  settings: DocumentStyleSettings,
  title: string
) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: ${settings.fontFamily}, sans-serif; margin: ${settings.margins}px; line-height: ${settings.lineSpacing}; color: #1e293b; }
    h1 { margin: 0; color: ${settings.accentColor}; font-size: 24px; }
    .contact { font-size: 12px; color: #64748b; margin-bottom: 20px; }
    .recipient { margin-bottom: 20px; font-[weight:600]; }
    p { margin-bottom: 16px; font-size: ${settings.fontSize}px; }
    .signature { margin-top: 30px; font-weight: bold; }
    .footer { margin-top: 40px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>${content.applicantName}</h1>
  <div class="contact">${content.applicantEmail} • ${content.applicantPhone} • ${content.applicantLocation}</div>
  <p>${settings.dateFormat}</p>
  <div class="recipient">
    <div>${content.recipientTitle}</div>
    <div style="color: ${settings.accentColor}; font-weight: bold;">${content.companyName}</div>
    <div>${content.companyAddress}</div>
  </div>
  <p><strong>${content.salutation}</strong></p>
  <p>${content.introParagraph}</p>
  <p>${content.bodyParagraph1}</p>
  <p>${content.bodyParagraph2}</p>
  <p>${content.closingParagraph}</p>
  <div class="signature">Sincerely,<br>${content.applicantName}</div>
  <div class="footer">Scorelia V3 Cover Letter | ATS Score: ${content.atsScore}%</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  triggerDownload(blob, `${title || 'Cover_Letter'}.html`)
}

/**
 * Exports cover letter in DOCX formatted HTML (.docx)
 */
export function exportAsDocx(
  content: MockCoverLetterContent,
  settings: DocumentStyleSettings,
  title: string
) {
  const docxHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>${title}</title></head>
<body>
  <h2 style="color:${settings.accentColor};">${content.applicantName}</h2>
  <p>${content.applicantEmail} | ${content.applicantPhone} | ${content.applicantLocation}</p>
  <p>Date: ${settings.dateFormat}</p>
  <p><b>${content.recipientTitle}</b><br/>${content.companyName}<br/>${content.companyAddress}</p>
  <p><b>${content.salutation}</b></p>
  <p>${content.introParagraph}</p>
  <p>${content.bodyParagraph1}</p>
  <p>${content.bodyParagraph2}</p>
  <p>${content.closingParagraph}</p>
  <p>Sincerely,<br/><b>${content.applicantName}</b></p>
</body>
</html>`

  const blob = new Blob([docxHtml], { type: 'application/msword;charset=utf-8' })
  triggerDownload(blob, `${title || 'Cover_Letter'}.docx`)
}
