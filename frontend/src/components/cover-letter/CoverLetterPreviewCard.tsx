import React, { useState, useEffect, useMemo } from 'react'
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  ChevronDown,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Edit3,
} from 'lucide-react'
import PlaceholderCard from './PlaceholderCard'
import { type MockCoverLetterContent, mockCoverLetterVersions } from '@/lib/cover-letter-mock-data'
import { defaultDocumentStyleSettings, type DocumentStyleSettings } from './DocumentStylePanel'

export interface CoverLetterPreviewCardProps {
  activeVersion?: MockCoverLetterContent
  selectedTemplateId?: string
  onTemplateChange?: (templateId: string) => void
  isGenerating?: boolean
  styleSettings?: DocumentStyleSettings
}

export const CoverLetterPreviewCard: React.FC<CoverLetterPreviewCardProps> = ({
  activeVersion = mockCoverLetterVersions[0],
  selectedTemplateId = 'modern',
  onTemplateChange,
  isGenerating = false,
  styleSettings = defaultDocumentStyleSettings,
}) => {
  const [template, setTemplate] = useState(selectedTemplateId)
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  // Editable Content States
  const [editableIntro, setEditableIntro] = useState(activeVersion.introParagraph)
  const [editableBody1, setEditableBody1] = useState(activeVersion.bodyParagraph1)
  const [editableBody2, setEditableBody2] = useState(activeVersion.bodyParagraph2)
  const [editableClosing, setEditableClosing] = useState(activeVersion.closingParagraph)

  // Section Ordering & Visibility
  const [deletedSection, setDeletedSection] = useState<string | null>(null)

  useEffect(() => {
    setEditableIntro(activeVersion.introParagraph)
    setEditableBody1(activeVersion.bodyParagraph1)
    setEditableBody2(activeVersion.bodyParagraph2)
    setEditableClosing(activeVersion.closingParagraph)
  }, [activeVersion])

  const handleTemplateSelect = (val: string) => {
    setTemplate(val)
    onTemplateChange?.(val)
  }

  // Memoized Text Statistics Calculation for Phase 8 Performance
  const fullText = useMemo(() => {
    return `${editableIntro} ${editableBody1} ${editableBody2} ${editableClosing}`
  }, [editableIntro, editableBody1, editableBody2, editableClosing])

  const wordCount = useMemo(() => {
    return fullText.split(/\s+/).filter(Boolean).length
  }, [fullText])

  const charCount = useMemo(() => {
    return fullText.length
  }, [fullText])

  const accentHex = styleSettings.accentColor

  return (
    <PlaceholderCard
      title={
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base text-[var(--heading)]">Cover Letter Preview & Inline Editor</span>
          <span
            className="text-xs font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-sm"
            style={{ backgroundColor: accentHex }}
          >
            {activeVersion.versionLabel}
          </span>
        </div>
      }
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <Edit3 size={10} className="text-emerald-400" />
          <span>Inline Editable</span>
        </span>
      }
      action={
        <div className="flex items-center gap-2">
          <label htmlFor="preview-template-select-p4" className="text-[11px] font-medium text-[var(--muted)] shrink-0">
            Format:
          </label>
          <div className="relative min-w-[170px]">
            <select
              id="preview-template-select-p4"
              value={template}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 pl-3 pr-7 py-1.5 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer"
            >
              <option value="modern">Modern Professional</option>
              <option value="professional">Classic Corporate</option>
              <option value="executive">Executive Leadership</option>
              <option value="minimal">Creative Minimal</option>
              <option value="creative">Bold Impact</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>
      }
      className="space-y-4"
    >
      {/* Editor Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 text-[var(--heading)] mb-4">
        {/* Undo / Redo */}
        <button
          type="button"
          aria-label="Undo"
          className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer border-none bg-transparent"
        >
          <Undo2 size={14} />
        </button>
        <button
          type="button"
          aria-label="Redo"
          className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer border-none bg-transparent"
        >
          <Redo2 size={14} />
        </button>

        <div className="h-4 w-px bg-[var(--border)] mx-1" />

        {/* Formatting */}
        <button
          type="button"
          aria-label="Bold"
          onClick={() => setIsBold(!isBold)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${
            isBold ? 'bg-[var(--primary)]/20 text-[var(--primary)] font-bold' : 'hover:bg-[var(--surface-hover)] text-[var(--muted)]'
          }`}
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          aria-label="Italic"
          onClick={() => setIsItalic(!isItalic)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${
            isItalic ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-[var(--surface-hover)] text-[var(--muted)]'
          }`}
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          aria-label="Underline"
          onClick={() => setIsUnderline(!isUnderline)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${
            isUnderline ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-[var(--surface-hover)] text-[var(--muted)]'
          }`}
        >
          <Underline size={14} />
        </button>

        <div className="h-4 w-px bg-[var(--border)] mx-1" />

        {/* Alignment */}
        <button
          type="button"
          aria-label="Align Left"
          onClick={() => setAlignment('left')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${
            alignment === 'left' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-[var(--surface-hover)] text-[var(--muted)]'
          }`}
        >
          <AlignLeft size={14} />
        </button>
        <button
          type="button"
          aria-label="Align Center"
          onClick={() => setAlignment('center')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${
            alignment === 'center' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-[var(--surface-hover)] text-[var(--muted)]'
          }`}
        >
          <AlignCenter size={14} />
        </button>
        <button
          type="button"
          aria-label="Align Right"
          onClick={() => setAlignment('right')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${
            alignment === 'right' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-[var(--surface-hover)] text-[var(--muted)]'
          }`}
        >
          <AlignRight size={14} />
        </button>
        <button
          type="button"
          aria-label="Align Justify"
          onClick={() => setAlignment('justify')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${
            alignment === 'justify' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-[var(--surface-hover)] text-[var(--muted)]'
          }`}
        >
          <AlignJustify size={14} />
        </button>

        <div className="h-4 w-px bg-[var(--border)] mx-1" />

        {/* Lists */}
        <button
          type="button"
          aria-label="Bullet List"
          className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer border-none bg-transparent"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          aria-label="Numbered List"
          className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer border-none bg-transparent"
        >
          <ListOrdered size={14} />
        </button>

        <div className="h-4 w-px bg-[var(--border)] mx-1 ml-auto" />

        <span className="text-[11px] font-bold text-[var(--muted)]">
          Click any paragraph to edit inline
        </span>
      </div>

      {/* Cover Letter Document Paper Container */}
      <div
        className={`rounded-xl border border-[var(--border)] bg-[#0b0c13] space-y-6 text-slate-200 shadow-inner transition-all ${
          styleSettings.fontFamily === 'Georgia'
            ? 'font-serif'
            : styleSettings.fontFamily === 'JetBrains Mono'
            ? 'font-mono'
            : 'font-sans'
        } ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
        style={{
          padding: `${styleSettings.margins}px`,
          lineHeight: styleSettings.lineSpacing,
          fontSize: `${styleSettings.fontSize}px`,
          textAlign: alignment,
        }}
      >
        {/* Applicant Contact Header */}
        {styleSettings.showContactInfo && (
          <div className="border-b border-slate-800 pb-5 space-y-2 group relative">
            <h2
              className="text-xl sm:text-2xl font-black text-white tracking-tight m-0 outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-1"
              contentEditable
              suppressContentEditableWarning
              aria-label="Applicant Full Name"
            >
              {activeVersion.applicantName}
            </h2>
            <p className="text-xs font-bold tracking-wide uppercase m-0" style={{ color: accentHex }}>
              AI/ML Engineer Candidate
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 pt-1 font-sans">
              <span className="flex items-center gap-1">
                <Mail size={12} style={{ color: accentHex }} />
                {activeVersion.applicantEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={12} style={{ color: accentHex }} />
                {activeVersion.applicantPhone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} style={{ color: accentHex }} />
                {activeVersion.applicantLocation}
              </span>
              <span className="flex items-center gap-1">
                <Globe size={12} style={{ color: accentHex }} />
                {activeVersion.applicantWebsite}
              </span>
            </div>
          </div>
        )}

        {/* Date & Recipient Block */}
        <div className="space-y-3">
          <p className="text-slate-400 font-medium m-0">{styleSettings.dateFormat}</p>

          {styleSettings.showRecipientBlock && (
            <div className="space-y-0.5 text-slate-300 font-medium">
              <p
                className="m-0 font-bold text-slate-100 outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-1"
                contentEditable
                suppressContentEditableWarning
                aria-label="Recipient Title"
              >
                {activeVersion.recipientTitle}
              </p>
              <p className="m-0 font-semibold" style={{ color: accentHex }}>
                {activeVersion.companyName}
              </p>
              <p className="m-0 text-slate-400">{activeVersion.companyAddress}</p>
            </div>
          )}
        </div>

        {/* Greeting */}
        <p
          className="font-semibold text-slate-100 m-0 outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-1"
          contentEditable
          suppressContentEditableWarning
          aria-label="Salutation Greeting"
        >
          {activeVersion.salutation}
        </p>

        {/* Section 1: Intro Paragraph */}
        <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
          <textarea
            value={editableIntro}
            onChange={(e) => setEditableIntro(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-slate-300 outline-none resize-none focus:bg-slate-900/40 focus:ring-2 focus:ring-[var(--primary)] rounded-lg p-1 transition-all"
            aria-label="Edit Introduction Paragraph"
          />
        </div>

        {/* Section 2: Body Paragraph 1 */}
        {deletedSection !== 'body1' ? (
          <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
            <textarea
              value={editableBody1}
              onChange={(e) => setEditableBody1(e.target.value)}
              rows={4}
              className="w-full bg-transparent text-slate-300 outline-none resize-none focus:bg-slate-900/40 focus:ring-2 focus:ring-[var(--primary)] rounded-lg p-1 transition-all"
              aria-label="Edit Technical Accomplishments Paragraph"
            />
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-400">
              <button
                type="button"
                onClick={() => setDeletedSection('body1')}
                className="text-rose-400 hover:underline border-none bg-transparent cursor-pointer"
              >
                Delete Section
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500 flex items-center justify-between">
            <span>Technical Accomplishments section removed</span>
            <button
              type="button"
              onClick={() => setDeletedSection(null)}
              className="text-purple-400 font-bold hover:underline cursor-pointer border-none bg-transparent"
            >
              Restore Section
            </button>
          </div>
        )}

        {/* Section 3: Body Paragraph 2 */}
        <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
          <textarea
            value={editableBody2}
            onChange={(e) => setEditableBody2(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-slate-300 outline-none resize-none focus:bg-slate-900/40 focus:ring-2 focus:ring-[var(--primary)] rounded-lg p-1 transition-all"
            aria-label="Edit Alignment Paragraph"
          />
        </div>

        {/* Section 4: Closing Paragraph */}
        <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
          <textarea
            value={editableClosing}
            onChange={(e) => setEditableClosing(e.target.value)}
            rows={2}
            className="w-full bg-transparent text-slate-300 outline-none resize-none focus:bg-slate-900/40 focus:ring-2 focus:ring-[var(--primary)] rounded-lg p-1 transition-all"
            aria-label="Edit Closing Paragraph"
          />
        </div>

        {/* Signature Section */}
        {styleSettings.showSignature && (
          <div className="pt-4 space-y-1">
            <p className="m-0 text-slate-300">Sincerely,</p>
            <p className="font-black text-slate-100 text-base m-0 pt-1">{activeVersion.applicantName}</p>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[var(--heading)]">
            {wordCount} words • 4 paragraphs • {charCount} characters
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ATS Score: {activeVersion.atsScore}%
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
          <span>Edited real-time</span>
          <CheckCircle2 size={13} />
        </div>
      </div>
    </PlaceholderCard>
  )
}

export default CoverLetterPreviewCard
