import type { ParsedResumeData } from '@/types/resume'
import { Badge } from '@/components/ui/Badge'
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Clock,
  Layout,
  BookOpen,
  PieChart,
} from 'lucide-react'

interface ResumeMetadataProps {
  parsedData: ParsedResumeData | null
  fileSize: number
  fileType?: string
}

export default function ResumeMetadata({ parsedData, fileSize }: ResumeMetadataProps) {
  if (!parsedData) return null

  const { statistics, data } = parsedData

  // 1. Calculate Average Confidence
  const confidenceItems = [
    { name: 'Full Name', conf: data.name?.confidence },
    { name: 'Email Address', conf: data.email?.confidence },
    { name: 'Phone Number', conf: data.phone?.confidence },
    { name: 'Web Links', conf: data.links?.confidence },
    { name: 'Skills List', conf: data.skills?.confidence },
    { name: 'Education Entries', conf: data.education?.confidence },
    { name: 'Work Experience', conf: data.experience?.confidence },
    { name: 'Projects Details', conf: data.projects?.confidence },
    { name: 'Certifications', conf: data.certifications?.confidence },
    { name: 'Summary Segment', conf: data.summary?.confidence || 0 },
    { name: 'Languages Spoken', conf: data.languages?.confidence || 0 },
    { name: 'Achievements Log', conf: data.achievements?.confidence || 0 },
  ].filter((item) => item.conf !== undefined && item.conf > 0)

  const averageConfidence =
    confidenceItems.length > 0
      ? Math.round(
          (confidenceItems.reduce((acc, curr) => acc + (curr.conf || 0), 0) /
            confidenceItems.length) *
            100
        )
      : 0

  // 2. Identify Sections status
  const sectionsChecklist = [
    { id: 'name', label: 'Full Name', detected: !!data.name?.value, required: true },
    { id: 'email', label: 'Email Address', detected: !!data.email?.value, required: true },
    { id: 'phone', label: 'Phone Number', detected: !!data.phone?.value, required: true },
    { id: 'summary', label: 'Professional Summary', detected: !!data.summary?.value, required: false },
    { id: 'skills', label: 'Technical Skills', detected: (data.skills?.value?.length ?? 0) > 0, required: true },
    { id: 'experience', label: 'Work Experience', detected: (data.experience?.value?.length ?? 0) > 0, required: true },
    { id: 'education', label: 'Education History', detected: (data.education?.value?.length ?? 0) > 0, required: true },
    { id: 'projects', label: 'Projects History', detected: (data.projects?.value?.length ?? 0) > 0, required: false },
    { id: 'certifications', label: 'Certifications', detected: (data.certifications?.value?.length ?? 0) > 0, required: false },
    { id: 'languages', label: 'Languages Spoken', detected: (data.languages?.value?.length ?? 0) > 0, required: false },
    { id: 'achievements', label: 'Achievements', detected: (data.achievements?.value?.length ?? 0) > 0, required: false },
    { id: 'links', label: 'Web Links', detected: (data.links?.value?.length ?? 0) > 0, required: false },
  ]

  const missingSections = sectionsChecklist.filter((s) => !s.detected)

  // 3. Generate Parser Warnings
  const warnings: string[] = []
  if (!data.name?.value) {
    warnings.push('Full Name was not detected in document header.')
  }
  if (!data.email?.value && !data.phone?.value) {
    warnings.push('No contact methods (Email/Phone) were parsed successfully.')
  }
  if (data.skills?.value?.length < 5) {
    warnings.push('Fewer than 5 skills detected. ATS scorers prefer robust technical lists.')
  }
  if (data.experience?.value?.length === 0) {
    warnings.push('Work experience history is empty. Check formatting of headers.')
  }
  if (statistics.page_count > 3) {
    warnings.push('Resume length is longer than standard limits (ideal: 1-2 pages).')
  }
  if (averageConfidence < 65) {
    warnings.push('Average parsing confidence score is below 65%. Consider re-formatting layout.')
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Word count approximation (heuristic: 1 word ~ 6 chars)
  const approxWords = Math.round(statistics.text_length / 6)

  return (
    <div className="space-y-6 font-sans">
      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Confidence Meter Card */}
        <div className="md:col-span-2 p-5 border border-border bg-card rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Extraction Confidence
            </h4>
            <Badge
              variant={averageConfidence >= 80 ? 'success' : averageConfidence >= 60 ? 'warning' : 'error'}
            >
              {averageConfidence}% Acc.
            </Badge>
          </div>

          <div className="py-4 flex items-center gap-6">
            <div className="relative h-20 w-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    averageConfidence >= 80
                      ? 'text-emerald-500'
                      : averageConfidence >= 60
                      ? 'text-amber-500'
                      : 'text-red-500'
                  }
                  strokeDasharray={`${averageConfidence}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-lg font-bold font-display text-slate-800 dark:text-white">
                {averageConfidence}%
              </div>
            </div>

            <div className="flex-1 text-left space-y-1">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                Confidence Assessment
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Based on parsing heuristic matches, section boundary identification, and text spelling
                integrity checks.
              </p>
            </div>
          </div>
        </div>

        {/* File statistics card */}
        <div className="p-5 border border-border bg-card rounded-2xl flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-left">
            Document Stats
          </h4>
          <div className="space-y-2.5 py-2 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Layout size={13} /> Pages
              </span>
              <span className="font-semibold text-foreground">
                {statistics.page_count}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <BookOpen size={13} /> Words
              </span>
              <span className="font-semibold text-foreground">{approxWords}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <PieChart size={13} /> Size
              </span>
              <span className="font-semibold text-foreground">
                {formatBytes(fileSize)}
              </span>
            </div>
          </div>
        </div>

        {/* Parser stats card */}
        <div className="p-5 border border-border bg-card rounded-2xl flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-left">
            Analysis Stats
          </h4>
          <div className="space-y-2.5 py-2 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock size={13} /> Latency
              </span>
              <span className="font-semibold text-foreground">
                {statistics.processing_time_ms} ms
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <HelpCircle size={13} /> Missing Sec.
              </span>
              <span className="font-semibold text-foreground">
                {missingSections.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <FileText size={13} /> Model
              </span>
              <span className="font-semibold text-foreground uppercase truncate max-w-[80px]">
                {parsedData.model.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings & Completions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warnings Card */}
        <div className="p-5 border border-border bg-card rounded-2xl text-left space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="text-amber-500" size={14} />
            <span>Parser Warning Flags ({warnings.length})</span>
          </h4>

          {warnings.length === 0 ? (
            <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/20 text-emerald-800 dark:text-emerald-350 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500 shrink-0" />
              <span>Perfect parse structure. No warnings or flags found.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {warnings.map((warn, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 text-slate-650 dark:text-slate-350 text-xs rounded-xl flex items-start gap-2.5"
                >
                  <AlertTriangle size={14} className="text-amber-550 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complete Checklist Card */}
        <div className="p-5 border border-border bg-card rounded-2xl text-left space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Section completeness check
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {sectionsChecklist.map((sec) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850"
              >
                <span className="text-slate-600 dark:text-slate-400 truncate pr-1">
                  {sec.label}
                  {sec.required && <strong className="text-red-500 ml-0.5">*</strong>}
                </span>

                {sec.detected ? (
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                ) : (
                  <HelpCircle size={14} className="text-slate-300 dark:text-slate-700 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
