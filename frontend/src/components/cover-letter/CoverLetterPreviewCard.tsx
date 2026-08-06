import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  Sparkles,
  Wand2,
  Briefcase,
  Minimize2,
  Maximize2,
  SpellCheck,
  Target,
  Sliders,
  Copy,
  Download,
  RotateCcw,
  Check,
  Clock,
  FileText,
  Trash2,
} from 'lucide-react'
import { type MockCoverLetterContent, mockCoverLetterVersions, mockToolTransformations } from '@/lib/cover-letter-mock-data'
import { defaultDocumentStyleSettings, type DocumentStyleSettings, DocumentStylePopover } from './DocumentStylePanel'

export interface CoverLetterPreviewCardProps {
  activeVersion?: MockCoverLetterContent
  selectedTemplateId?: string
  onTemplateChange?: (templateId: string) => void
  isGenerating?: boolean
  styleSettings?: DocumentStyleSettings
  onUpdateStyleSettings?: (newSettings: Partial<DocumentStyleSettings>) => void
  onCopyText?: () => void
  onExportClick?: () => void
}

export const CoverLetterPreviewCard: React.FC<CoverLetterPreviewCardProps> = ({
  activeVersion = mockCoverLetterVersions[0],
  selectedTemplateId = 'modern',
  onTemplateChange,
  isGenerating = false,
  styleSettings = defaultDocumentStyleSettings,
  onUpdateStyleSettings,
  onCopyText,
  onExportClick,
}) => {
  const [template, setTemplate] = useState(selectedTemplateId)
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  // Popover Toggles
  const [isStylePopoverOpen, setIsStylePopoverOpen] = useState(false)
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false)
  const [copiedStatus, setCopiedStatus] = useState(false)
  const [aiTransformStatus, setAiTransformStatus] = useState<string | null>(null)

  // Editable Content States
  const [editableIntro, setEditableIntro] = useState(activeVersion.introParagraph)
  const [editableBody1, setEditableBody1] = useState(activeVersion.bodyParagraph1)
  const [editableBody2, setEditableBody2] = useState(activeVersion.bodyParagraph2)
  const [editableClosing, setEditableClosing] = useState(activeVersion.closingParagraph)

  // Section Visibility
  const [deletedSection, setDeletedSection] = useState<string | null>(null)

  const popoverRef = useRef<HTMLDivElement>(null)

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

  // Memoized Text Statistics
  const fullText = useMemo(() => {
    return `${editableIntro} ${editableBody1} ${editableBody2} ${editableClosing}`
  }, [editableIntro, editableBody1, editableBody2, editableClosing])

  const wordCount = useMemo(() => {
    return fullText.split(/\s+/).filter(Boolean).length
  }, [fullText])

  const charCount = useMemo(() => {
    return fullText.length
  }, [fullText])

  const readingTime = useMemo(() => {
    const minutes = Math.ceil(wordCount / 200)
    return minutes < 1 ? 1 : minutes
  }, [wordCount])

  const accentHex = styleSettings.accentColor

  const handleCopy = () => {
    if (onCopyText) {
      onCopyText()
    } else {
      navigator.clipboard?.writeText(fullText)
    }
    setCopiedStatus(true)
    setTimeout(() => setCopiedStatus(false), 2000)
  }

  const handleApplyAITransformation = (toolId: string, label: string) => {
    const transform = mockToolTransformations[toolId]
    if (transform) {
      setEditableIntro(transform.intro)
      setEditableBody1(transform.body1)
      setEditableBody2(transform.body2)
      setEditableClosing(transform.closing)
      setAiTransformStatus(`Applied "${label}" transformation!`)
      setIsAIDropdownOpen(false)
      setTimeout(() => setAiTransformStatus(null), 3000)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121426] bg-gradient-to-b from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-6 shadow-2xl shadow-purple-950/20 space-y-4 text-left relative">
      {/* 1. EXECUTIVE LIVE STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-saved just now</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>{wordCount} words</span>
            <span className="text-slate-600">•</span>
            <span>{charCount} chars</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>~{readingTime} min read</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            ATS Score: {activeVersion.atsScore}%
          </span>

          {/* Template Selector */}
          <div className="relative min-w-[160px]">
            <select
              id="editor-template-select"
              aria-label="Select Template Format"
              value={template}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900/90 pl-3 pr-7 py-1.5 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="modern">Modern Professional</option>
              <option value="professional">Classic Corporate</option>
              <option value="executive">Executive Leadership</option>
              <option value="minimal">Creative Minimal</option>
              <option value="creative">Bold Impact</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* AI Notification Alert */}
      {aiTransformStatus && (
        <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-200 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
          <span>{aiTransformStatus}</span>
        </div>
      )}

      {/* 2. INTEGRATED HERO EDITOR TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-slate-700/80 bg-slate-900/90 text-white shadow-md">
        {/* Left Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo / Redo */}
          <button
            type="button"
            aria-label="Undo"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Bold, Italic, Underline */}
          <button
            type="button"
            aria-label="Bold"
            onClick={() => setIsBold(!isBold)}
            className={`p-2 rounded-lg transition-colors cursor-pointer border-none ${
              isBold ? 'bg-purple-500/30 text-purple-300 font-bold' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Italic"
            onClick={() => setIsItalic(!isItalic)}
            className={`p-2 rounded-lg transition-colors cursor-pointer border-none ${
              isItalic ? 'bg-purple-500/30 text-purple-300' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Underline"
            onClick={() => setIsUnderline(!isUnderline)}
            className={`p-2 rounded-lg transition-colors cursor-pointer border-none ${
              isUnderline ? 'bg-purple-500/30 text-purple-300' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Alignments */}
          <button
            type="button"
            aria-label="Align Left"
            onClick={() => setAlignment('left')}
            className={`p-2 rounded-lg transition-colors cursor-pointer border-none ${
              alignment === 'left' ? 'bg-purple-500/30 text-purple-300' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Align Center"
            onClick={() => setAlignment('center')}
            className={`p-2 rounded-lg transition-colors cursor-pointer border-none ${
              alignment === 'center' ? 'bg-purple-500/30 text-purple-300' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Align Right"
            onClick={() => setAlignment('right')}
            className={`p-2 rounded-lg transition-colors cursor-pointer border-none ${
              alignment === 'right' ? 'bg-purple-500/30 text-purple-300' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Integrated AI Assistant Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAIDropdownOpen(!isAIDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-sm hover:opacity-95 transition-opacity cursor-pointer border-none"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-200" />
              <span>AI Writing Assistant</span>
              <ChevronDown className="w-3 h-3 text-purple-200 ml-0.5" />
            </button>

            {/* AI Assistant Quick Dropdown Menu */}
            {isAIDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-[#121426] border border-white/10 shadow-2xl p-2 z-50 text-xs space-y-1">
                <button
                  type="button"
                  onClick={() => handleApplyAITransformation('improve-writing', 'Improve Writing')}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-200 hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer border-none text-left font-semibold"
                >
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Improve Writing & Flow</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAITransformation('make-professional', 'Executive Tone')}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-200 hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer border-none text-left font-semibold"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Make Executive & Formal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAITransformation('shorten', 'Shorten Text')}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-200 hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer border-none text-left font-semibold"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shorten Paragraphs</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAITransformation('expand', 'Expand Text')}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-200 hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer border-none text-left font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Expand Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAITransformation('fix-grammar', 'Fix Grammar')}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-200 hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer border-none text-left font-semibold"
                >
                  <SpellCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fix Grammar & Mechanics</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAITransformation('ats-optimization', 'ATS Optimization')}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-200 hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer border-none text-left font-semibold"
                >
                  <Target className="w-3.5 h-3.5 text-teal-400" />
                  <span>ATS Keyword Optimization</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Toolbar Controls (Style Popover & Copy/Export) */}
        <div className="flex items-center gap-1.5">
          {/* Style Popover Trigger */}
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setIsStylePopoverOpen(!isStylePopoverOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Document Formatting</span>
            </button>

            {/* Popover Card */}
            {isStylePopoverOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <DocumentStylePopover
                  settings={styleSettings}
                  onUpdateSettings={(newSettings) => {
                    onUpdateStyleSettings?.(newSettings)
                  }}
                  onClose={() => setIsStylePopoverOpen(false)}
                />
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Letter Text"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border-none flex items-center gap-1 text-xs font-semibold"
          >
            {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={onExportClick}
            title="Export Document"
            className="p-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 transition-colors cursor-pointer border border-purple-500/30 flex items-center gap-1 text-xs font-bold"
          >
            <Download className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* 3. AUTHENTIC DOCUMENT PAPER CANVAS */}
      <div
        className={`rounded-xl border border-slate-800 bg-[#0b0c13] space-y-6 text-slate-100 shadow-2xl shadow-black/80 transition-all ${
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
              className="text-xl sm:text-2xl font-black text-white tracking-tight m-0 outline-none focus:ring-2 focus:ring-purple-500 rounded px-1"
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
                className="m-0 font-bold text-slate-100 outline-none focus:ring-2 focus:ring-purple-500 rounded px-1"
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
          className="font-semibold text-slate-100 m-0 outline-none focus:ring-2 focus:ring-purple-500 rounded px-1"
          contentEditable
          suppressContentEditableWarning
          aria-label="Salutation Greeting"
        >
          {activeVersion.salutation}
        </p>

        {/* PARAGRAPH 1: INTRODUCTION */}
        <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
          <textarea
            value={editableIntro}
            onChange={(e) => setEditableIntro(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-slate-200 outline-none resize-none focus:bg-slate-900/60 focus:ring-2 focus:ring-purple-500 rounded-lg p-2 transition-all leading-relaxed"
            aria-label="Edit Introduction Paragraph"
          />
          {/* Paragraph Floating AI Actions */}
          <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-[10px] text-slate-300 shadow-md">
            <button
              type="button"
              onClick={() => handleApplyAITransformation('improve-writing', 'Refine Intro')}
              className="flex items-center gap-1 text-purple-400 hover:text-white border-none bg-transparent cursor-pointer font-bold"
            >
              <Wand2 className="w-3 h-3" />
              <span>Refine AI</span>
            </button>
          </div>
        </div>

        {/* PARAGRAPH 2: TECHNICAL ACCOMPLISHMENTS */}
        {deletedSection !== 'body1' ? (
          <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
            <textarea
              value={editableBody1}
              onChange={(e) => setEditableBody1(e.target.value)}
              rows={4}
              className="w-full bg-transparent text-slate-200 outline-none resize-none focus:bg-slate-900/60 focus:ring-2 focus:ring-purple-500 rounded-lg p-2 transition-all leading-relaxed"
              aria-label="Edit Technical Accomplishments Paragraph"
            />
            {/* Paragraph Floating AI Actions */}
            <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-[10px] text-slate-300 shadow-md">
              <button
                type="button"
                onClick={() => handleApplyAITransformation('make-professional', 'Executive Body')}
                className="flex items-center gap-1 text-purple-400 hover:text-white border-none bg-transparent cursor-pointer font-bold"
              >
                <Wand2 className="w-3 h-3" />
                <span>Refine AI</span>
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={() => setDeletedSection('body1')}
                className="text-rose-400 hover:underline border-none bg-transparent cursor-pointer font-bold"
              >
                Delete
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

        {/* PARAGRAPH 3: ALIGNMENT & FIT */}
        <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
          <textarea
            value={editableBody2}
            onChange={(e) => setEditableBody2(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-slate-200 outline-none resize-none focus:bg-slate-900/60 focus:ring-2 focus:ring-purple-500 rounded-lg p-2 transition-all leading-relaxed"
            aria-label="Edit Alignment Paragraph"
          />
          {/* Paragraph Floating AI Actions */}
          <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-[10px] text-slate-300 shadow-md">
            <button
              type="button"
              onClick={() => handleApplyAITransformation('expand', 'Expand Fit')}
              className="flex items-center gap-1 text-purple-400 hover:text-white border-none bg-transparent cursor-pointer font-bold"
            >
              <Wand2 className="w-3 h-3" />
              <span>Expand AI</span>
            </button>
          </div>
        </div>

        {/* PARAGRAPH 4: CLOSING & CALL TO ACTION */}
        <div className="relative group border border-transparent hover:border-slate-800 rounded-xl p-2 transition-all">
          <textarea
            value={editableClosing}
            onChange={(e) => setEditableClosing(e.target.value)}
            rows={2}
            className="w-full bg-transparent text-slate-200 outline-none resize-none focus:bg-slate-900/60 focus:ring-2 focus:ring-purple-500 rounded-lg p-2 transition-all leading-relaxed"
            aria-label="Edit Closing Paragraph"
          />
          {/* Paragraph Floating AI Actions */}
          <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-[10px] text-slate-300 shadow-md">
            <button
              type="button"
              onClick={() => handleApplyAITransformation('stronger-closing', 'Strong Closing')}
              className="flex items-center gap-1 text-purple-400 hover:text-white border-none bg-transparent cursor-pointer font-bold"
            >
              <Sparkles className="w-3 h-3" />
              <span>Strong Closing</span>
            </button>
          </div>
        </div>

        {/* SIGNATURE SECTION */}
        {styleSettings.showSignature && (
          <div className="pt-4 space-y-1">
            <p className="m-0 text-slate-300">Sincerely,</p>
            <p className="font-black text-slate-100 text-base m-0 pt-1">{activeVersion.applicantName}</p>
          </div>
        )}
      </div>

      {/* FOOTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-200">
            {wordCount} words • 4 paragraphs • {charCount} characters
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
          <span>Real-time sync active</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  )
}

export default CoverLetterPreviewCard
