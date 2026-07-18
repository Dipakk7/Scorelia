import { useState } from 'react'
import type { ParsedResumeData } from '@/types/resume'
import ResumeSection from '@/components/ui/ResumeSection'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SkillBadge } from '@/components/ui/SkillBadge'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  Phone,
  Link as LinkIcon,
  BookOpen,
  Briefcase,
  FolderGit2,
  Award,
  Globe,
  Trophy,
  Copy,
  Printer,
  Download,
  Minimize2,
  Maximize2,
  FileText,
  ExternalLink,
} from 'lucide-react'

interface ResumeViewerProps {
  parsedData: ParsedResumeData | null
  originalFilename: string
  onEditClick?: () => void
}

export default function ResumeViewer({ parsedData, originalFilename, onEditClick }: ResumeViewerProps) {
  const renderEmptySector = (message: string) => (
    <div className="flex items-center justify-between gap-4 py-2.5 px-4 border border-dashed border-[var(--border)] rounded-xl bg-[var(--surface-hover)]/10 text-left">
      <span className="text-xs text-[var(--muted)] italic font-sans font-medium">{message}</span>
      {onEditClick && (
        <button
          type="button"
          onClick={onEditClick}
          className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] hover:underline border-none bg-transparent cursor-pointer p-0 select-none shrink-0"
        >
          Add in Editor →
        </button>
      )}
    </div>
  )

  const [sectionsOpen, setSectionsOpen] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: true,
    languages: true,
    achievements: true,
  })

  if (!parsedData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-2xl min-h-[300px] text-center">
        <FileText className="text-slate-300 dark:text-slate-650 mb-3 animate-pulse" size={40} />
        <h3 className="text-base font-bold font-display text-foreground">
          No parsed content available
        </h3>
        <p className="text-sm font-sans text-slate-550 dark:text-slate-400 mt-1 max-w-sm">
          Please run parser analysis on this resume first to review the structured sections.
        </p>
      </div>
    )
  }

  const { data } = parsedData

  const toggleSection = (key: string) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {}
    Object.keys(sectionsOpen).forEach((k) => (next[k] = true))
    setSectionsOpen(next)
  }

  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {}
    Object.keys(sectionsOpen).forEach((k) => (next[k] = false))
    setSectionsOpen(next)
  }

  // Format as Markdown for copy/download
  const formatAsMarkdown = (): string => {
    let md = `# Resume: ${data.name?.value || 'Unknown Name'}\n\n`

    if (data.email?.value || data.phone?.value) {
      md += `## Contact Information\n`
      if (data.email?.value) md += `- **Email**: ${data.email.value}\n`
      if (data.phone?.value) md += `- **Phone**: ${data.phone.value}\n`
      md += '\n'
    }

    if (data.links?.value && data.links.value.length > 0) {
      md += `## Links\n`
      data.links.value.forEach((l) => (md += `- [${l}](${l})\n`))
      md += '\n'
    }

    if (data.summary?.value) {
      md += `## Summary\n${data.summary.value}\n\n`
    }

    if (data.skills?.value && data.skills.value.length > 0) {
      md += `## Skills\n`
      md += data.skills.value.join(', ') + '\n\n'
    }

    if (data.experience?.value && data.experience.value.length > 0) {
      md += `## Experience\n\n`
      data.experience.value.forEach((exp) => {
        md += `### ${exp.title || 'Role'} at ${exp.company || 'Company'}\n`
        md += `*Duration: ${exp.duration || 'N/A'}*\n\n`
        if (exp.description) md += `${exp.description}\n\n`
      })
    }

    if (data.education?.value && data.education.value.length > 0) {
      md += `## Education\n\n`
      data.education.value.forEach((edu) => {
        md += `### ${edu.degree || 'Degree'}\n`
        md += `*${edu.institution || 'Institution'} (${edu.year || 'N/A'})*\n\n`
      })
    }

    if (data.projects?.value && data.projects.value.length > 0) {
      md += `## Projects\n\n`
      data.projects.value.forEach((proj) => {
        md += `### ${proj.name || 'Project Name'}\n`
        if (proj.technologies && proj.technologies.length > 0) {
          md += `*Technologies: ${proj.technologies.join(', ')}*\n\n`
        }
        if (proj.description) md += `${proj.description}\n\n`
      })
    }

    if (data.certifications?.value && data.certifications.value.length > 0) {
      md += `## Certifications\n`
      data.certifications.value.forEach((c) => (md += `- ${c}\n`))
      md += '\n'
    }

    if (data.languages?.value && data.languages.value.length > 0) {
      md += `## Languages\n`
      data.languages.value.forEach((l) => (md += `- ${l}\n`))
      md += '\n'
    }

    if (data.achievements?.value && data.achievements.value.length > 0) {
      md += `## Achievements\n`
      data.achievements.value.forEach((a) => (md += `- ${a}\n`))
      md += '\n'
    }

    return md
  }

  const handleCopy = () => {
    const text = formatAsMarkdown()
    navigator.clipboard.writeText(text)
    toast.success('Resume copied to clipboard as Markdown!')
  }

  const handleDownloadText = () => {
    const text = formatAsMarkdown()
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${originalFilename.split('.')[0]}_parsed.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Markdown download started!')
  }

  const handlePrint = () => {
    const printContent = document.getElementById('resume-print-area')
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Parsed Resume - ${data.name?.value || ''}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              h1 { font-size: 28px; margin-bottom: 5px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
              h2 { font-size: 18px; margin-top: 25px; margin-bottom: 10px; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
              h3 { font-size: 14px; margin-top: 15px; margin-bottom: 5px; color: #0f172a; }
              p { margin: 0 0 10px 0; font-size: 13px; }
              ul { margin: 0 0 15px 0; padding-left: 20px; font-size: 13px; }
              li { margin-bottom: 4px; }
              .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
              .item-meta { font-size: 12px; font-style: italic; color: #475569; margin-bottom: 8px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpandAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <Maximize2 size={13} />
            <span>Expand All</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCollapseAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <Minimize2 size={13} />
            <span>Collapse All</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy MD</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Printer size={13} />
            <span>Print</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadText}
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Download size={13} />
            <span>Export MD</span>
          </Button>
        </div>
      </div>

      {/* Accordion / Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Contact, Skills, Languages, Links */}
        <div className="space-y-6 lg:col-span-1">
          {/* Personal Info */}
          <ResumeSection
            title="Personal Info"
            icon={<User size={16} />}
            isOpen={sectionsOpen.personal}
            onToggle={() => toggleSection('personal')}
          >
            <div className="space-y-3.5 text-left text-sm font-sans">
              <div>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                  Full Name
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-150">
                  {data.name?.value || <span className="text-slate-400 italic">Not detected</span>}
                </p>
              </div>

              <div>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                  Email Address
                </span>
                {data.email?.value ? (
                  <a
                    href={`mailto:${data.email.value}`}
                    className="flex items-center gap-1 text-brand-650 dark:text-brand-400 hover:underline"
                  >
                    <Mail size={13} />
                    <span>{data.email.value}</span>
                  </a>
                ) : (
                  <p className="text-slate-400 italic font-sans">Not detected</p>
                )}
              </div>

              <div>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                  Phone Number
                </span>
                {data.phone?.value ? (
                  <div className="flex items-center gap-1 text-slate-750 dark:text-slate-200">
                    <Phone size={13} />
                    <span>{data.phone.value}</span>
                  </div>
                ) : (
                  <p className="text-slate-400 italic font-sans">Not detected</p>
                )}
              </div>
            </div>
          </ResumeSection>

          {/* Links */}
          <ResumeSection
            title="Links"
            icon={<LinkIcon size={16} />}
            isOpen={sectionsOpen.links}
            onToggle={() => toggleSection('links')}
            badge={data.links?.value?.length ? <Badge variant="default">{data.links.value.length}</Badge> : null}
          >
            {data.links?.value && data.links.value.length > 0 ? (
              <div className="space-y-2 text-left text-sm">
                {data.links.value.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.startsWith('http') ? link : `https://${link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-brand-650 dark:text-brand-400 hover:underline break-all"
                  >
                    <ExternalLink size={13} className="shrink-0" />
                    <span>{link}</span>
                  </a>
                ))}
              </div>
            ) : (
              renderEmptySector("No social or web links found.")
            )}
          </ResumeSection>

          {/* Skills */}
          <ResumeSection
            title="Skills"
            icon={<Award size={16} />}
            isOpen={sectionsOpen.skills}
            onToggle={() => toggleSection('skills')}
            badge={data.skills?.value?.length ? <Badge variant="success">{data.skills.value.length}</Badge> : null}
          >
            {data.skills?.value && data.skills.value.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 justify-start">
                {data.skills.value.map((skill, idx) => (
                  <SkillBadge key={idx} skill={skill} />
                ))}
              </div>
            ) : (
              renderEmptySector("No technical skills detected.")
            )}
          </ResumeSection>

          {/* Languages */}
          <ResumeSection
            title="Languages"
            icon={<Globe size={16} />}
            isOpen={sectionsOpen.languages}
            onToggle={() => toggleSection('languages')}
            badge={
              data.languages?.value?.length ? <Badge variant="default">{data.languages.value.length}</Badge> : null
            }
          >
            {data.languages?.value && data.languages.value.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 justify-start">
                {data.languages.value.map((lang, idx) => (
                  <Badge key={idx} variant="secondary" className="px-2.5 py-1 text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            ) : (
              renderEmptySector("No languages specified.")
            )}
          </ResumeSection>
        </div>

        {/* Right Side: Summary, Experience, Education, Projects, Certs, Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <ResumeSection
            title="Summary"
            icon={<FileText size={16} />}
            isOpen={sectionsOpen.summary}
            onToggle={() => toggleSection('summary')}
          >
            {data.summary?.value ? (
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-350 text-left whitespace-pre-line">
                {data.summary.value}
              </p>
            ) : (
              renderEmptySector("No professional summary detected.")
            )}
          </ResumeSection>

          {/* Experience */}
          <ResumeSection
            title="Work Experience"
            icon={<Briefcase size={16} />}
            isOpen={sectionsOpen.experience}
            onToggle={() => toggleSection('experience')}
            badge={
              data.experience?.value?.length ? (
                <Badge variant="default">{data.experience.value.length}</Badge>
              ) : null
            }
          >
            {data.experience?.value && data.experience.value.length > 0 ? (
              <div className="space-y-6 text-left">
                {data.experience.value.map((exp, idx) => (
                  <div key={idx} className="relative pl-5 border-l border-border space-y-1">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-brand-600 dark:bg-brand-500 rounded-full border border-white dark:border-slate-900" />
                    <div className="flex flex-wrap items-start justify-between gap-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        {exp.title || 'Role Name'}
                      </h4>
                      <span className="text-xs text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-brand-650 dark:text-brand-450">
                      {exp.company || 'Company'}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-line leading-relaxed font-sans">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              renderEmptySector("No work experience detected.")
            )}
          </ResumeSection>

          {/* Education */}
          <ResumeSection
            title="Education"
            icon={<BookOpen size={16} />}
            isOpen={sectionsOpen.education}
            onToggle={() => toggleSection('education')}
            badge={
              data.education?.value?.length ? <Badge variant="default">{data.education.value.length}</Badge> : null
            }
          >
            {data.education?.value && data.education.value.length > 0 ? (
              <div className="space-y-5 text-left">
                {data.education.value.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex flex-wrap items-start justify-between gap-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        {edu.degree || 'Degree'}
                      </h4>
                      <span className="text-xs text-muted-foreground">{edu.year}</span>
                    </div>
                    <p className="text-xs text-slate-550 dark:text-slate-450">{edu.institution}</p>
                  </div>
                ))}
              </div>
            ) : (
              renderEmptySector("No education history detected.")
            )}
          </ResumeSection>

          {/* Projects */}
          <ResumeSection
            title="Projects"
            icon={<FolderGit2 size={16} />}
            isOpen={sectionsOpen.projects}
            onToggle={() => toggleSection('projects')}
            badge={
              data.projects?.value?.length ? <Badge variant="default">{data.projects.value.length}</Badge> : null
            }
          >
            {data.projects?.value && data.projects.value.length > 0 ? (
              <div className="space-y-5 text-left">
                {data.projects.value.map((proj, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">
                      {proj.name || 'Project Name'}
                    </h4>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies.map((t, tidx) => (
                          <Badge key={tidx} variant="default" className="text-[10px] py-0 px-2 bg-slate-100 text-slate-650 hover:bg-slate-150 border-0">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              renderEmptySector("No projects documented.")
            )}
          </ResumeSection>

          {/* Certifications */}
          <ResumeSection
            title="Certifications & Coursework"
            icon={<Award size={16} />}
            isOpen={sectionsOpen.certifications}
            onToggle={() => toggleSection('certifications')}
            badge={
              data.certifications?.value?.length ? (
                <Badge variant="default">{data.certifications.value.length}</Badge>
              ) : null
            }
          >
            {data.certifications?.value && data.certifications.value.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-left text-sm text-slate-700 dark:text-slate-350">
                {data.certifications.value.map((cert, idx) => (
                  <li key={idx} className="font-sans">
                    {cert}
                  </li>
                ))}
              </ul>
            ) : (
              renderEmptySector("No certifications detected.")
            )}
          </ResumeSection>

          {/* Achievements */}
          <ResumeSection
            title="Achievements & Honors"
            icon={<Trophy size={16} />}
            isOpen={sectionsOpen.achievements}
            onToggle={() => toggleSection('achievements')}
            badge={
              data.achievements?.value?.length ? (
                <Badge variant="default">{data.achievements.value.length}</Badge>
              ) : null
            }
          >
            {data.achievements?.value && data.achievements.value.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-left text-sm text-slate-700 dark:text-slate-350">
                {data.achievements.value.map((ach, idx) => (
                  <li key={idx} className="font-sans">
                    {ach}
                  </li>
                ))}
              </ul>
            ) : (
              renderEmptySector("No achievements cataloged.")
            )}
          </ResumeSection>
        </div>
      </div>

      {/* Hidden print area template */}
      <div id="resume-print-area" className="hidden">
        <h1>{data.name?.value || 'Resume'}</h1>
        <div className="meta">
          {data.email?.value && <span>Email: ${data.email.value} | </span>}
          {data.phone?.value && <span>Phone: ${data.phone.value} | </span>}
          {data.links?.value && data.links.value.length > 0 && (
            <span>Links: ${data.links.value.join(', ')}</span>
          )}
        </div>

        {data.summary?.value && (
          <div>
            <h2>Summary</h2>
            <p>{data.summary.value}</p>
          </div>
        )}

        {data.skills?.value && data.skills.value.length > 0 && (
          <div>
            <h2>Skills</h2>
            <p>{data.skills.value.join(', ')}</p>
          </div>
        )}

        {data.experience?.value && data.experience.value.length > 0 && (
          <div>
            <h2>Work Experience</h2>
            {data.experience.value.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>
                  {exp.title} - {exp.company}
                </h3>
                <div className="item-meta">{exp.duration}</div>
                {exp.description && <p style={{ whiteSpace: 'pre-line' }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {data.education?.value && data.education.value.length > 0 && (
          <div>
            <h2>Education</h2>
            {data.education.value.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>{edu.degree}</h3>
                <div className="item-meta">
                  {edu.institution} ({edu.year})
                </div>
              </div>
            ))}
          </div>
        )}

        {data.projects?.value && data.projects.value.length > 0 && (
          <div>
            <h2>Projects</h2>
            {data.projects.value.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{proj.name}</h3>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="item-meta">Technologies: {proj.technologies.join(', ')}</div>
                )}
                {proj.description && <p>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {data.certifications?.value && data.certifications.value.length > 0 && (
          <div>
            <h2>Certifications</h2>
            <ul>
              {data.certifications.value.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {data.languages?.value && data.languages.value.length > 0 && (
          <div>
            <h2>Languages</h2>
            <ul>
              {data.languages.value.map((l, idx) => (
                <li key={idx}>{l}</li>
              ))}
            </ul>
          </div>
        )}

        {data.achievements?.value && data.achievements.value.length > 0 && (
          <div>
            <h2>Achievements & Honors</h2>
            <ul>
              {data.achievements.value.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
