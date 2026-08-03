import React, { useState, useMemo, useCallback } from 'react'
import {
  Monitor,
  Tablet,
  Smartphone,
  Minus,
  Plus,
  Moon,
  Sun,
  Download,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ChevronDown,
  Maximize2,
  Minimize2,
  RotateCw,
  Maximize,
  Layout,
  FileText,
} from 'lucide-react'
import type { ResumeTemplateId, SampleResumeData } from './templates/types'
import { TEMPLATES_LIST } from './templates/types'
import { ResumePreviewRenderer } from './templates/ResumePreviewRenderer'
import { TemplateGalleryModal } from './templates/TemplateGalleryModal'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ResumePreviewPanelProps {
  resumeData?: SampleResumeData
  saveStatus?: string
  onDownload?: () => void
}

export const ResumePreviewPanel: React.FC<ResumePreviewPanelProps> = ({
  resumeData,
  saveStatus = 'Auto-saved 2 min ago',
  onDownload,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')
  const [activeTemplateId, setActiveTemplateId] = useState<ResumeTemplateId>('professional')
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const activeTemplate = useMemo(
    () => TEMPLATES_LIST.find((t) => t.id === activeTemplateId) || TEMPLATES_LIST[0],
    [activeTemplateId]
  )

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 50), 150))
  }

  const handleFitWidth = () => {
    setZoomLevel(110)
  }

  const handleFitPage = () => {
    setZoomLevel(90)
  }

  const handleDownloadPDF = () => {
    toast.success('Preparing PDF Export...')
    if (onDownload) {
      onDownload()
    } else {
      setTimeout(() => {
        window.print()
      }, 400)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full min-h-0 bg-[#0b0c14]/95 border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden text-left relative transition-colors',
        isFullscreen && 'fixed inset-0 z-50 rounded-none border-none'
      )}
    >
      {/* Interactive Template Gallery Modal */}
      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        selectedTemplateId={activeTemplateId}
        onSelectTemplate={(tplId) => setActiveTemplateId(tplId)}
      />

      {/* Top Preview Toolbar Header Bar (Fixed-Width Controls, Horizontal Scroll Restored) */}
      <div className="sticky top-0 z-20 h-[48px] min-h-[48px] shrink-0 flex-none px-3.5 bg-[#0e101c] border-b border-slate-800/80 overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth custom-scrollbar transition-colors box-border">
        <div className="flex flex-nowrap items-center justify-between gap-4 min-w-max w-full h-full">
          {/* Left Section: Active Template & Live Status Indicator */}
          <div className="flex items-center gap-3 shrink-0 flex-none">
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="h-8 flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/30 text-white cursor-pointer transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shrink-0 flex-none"
            >
              <Layout size={13} className="text-purple-400" />
              <span>{activeTemplate.name}</span>
              <ChevronDown size={13} className="text-purple-300" />
            </button>

            {/* Live Status Pill */}
            <span className="hidden sm:flex h-8 items-center gap-1.5 px-2.5 rounded-lg text-xs font-black bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 font-mono shrink-0 flex-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          {/* Right Toolbar Controls: 4 Grouped Sections with 16px Spacing */}
          <div className="flex items-center gap-4 shrink-0 flex-none">
            {/* Group 1: Zoom Control & Fit Controls */}
            <div className="flex items-center gap-2 shrink-0 flex-none">
              {/* Segmented Zoom Control */}
              <div className="h-8 inline-flex items-center bg-[#141628] p-0.5 rounded-lg border border-slate-700/80 text-xs font-mono text-slate-200 shrink-0 flex-none">
                <button
                  type="button"
                  onClick={() => handleZoom(-10)}
                  className="w-6 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none shrink-0"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <Minus size={12} />
                </button>
                <span className="w-9 text-center font-bold px-0.5 select-none shrink-0">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => handleZoom(10)}
                  className="w-6 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none shrink-0"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Fit Width Pill */}
              <button
                type="button"
                onClick={handleFitWidth}
                className="hidden md:flex h-8 items-center px-3 rounded-lg text-xs font-semibold bg-[#141628] border border-slate-700/80 hover:bg-[#1c1f36] text-slate-200 hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shrink-0 flex-none"
              >
                Fit Width
              </button>
              {/* Fit Page Pill */}
              <button
                type="button"
                onClick={handleFitPage}
                className="hidden md:flex h-8 items-center px-3 rounded-lg text-xs font-semibold bg-[#141628] border border-slate-700/80 hover:bg-[#1c1f36] text-slate-200 hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shrink-0 flex-none"
              >
                Fit Page
              </button>
            </div>

            {/* Group 2: Page Indicator */}
            <span className="hidden sm:flex h-8 items-center px-3 rounded-lg text-xs font-mono font-medium text-slate-300 bg-[#141628] border border-slate-700/80 select-none shrink-0 flex-none">
              Page 1 of 1
            </span>

            {/* Group 3: View Mode Toggle Segmented Control (Exact Equal Segments) */}
            <div className="hidden sm:inline-flex h-8 items-center bg-[#141628] p-0.5 rounded-[10px] border border-slate-700/80 shrink-0 flex-none gap-0.5">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={cn(
                  'w-8 h-7 flex-none flex items-center justify-center rounded-md transition-colors cursor-pointer',
                  previewDevice === 'desktop'
                    ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold shadow-none'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                )}
                title="Desktop View"
              >
                <Monitor size={13} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={cn(
                  'w-8 h-7 flex-none flex items-center justify-center rounded-md transition-colors cursor-pointer',
                  previewDevice === 'tablet'
                    ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold shadow-none'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                )}
                title="Tablet View"
              >
                <Tablet size={13} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={cn(
                  'w-8 h-7 flex-none flex items-center justify-center rounded-md transition-colors cursor-pointer',
                  previewDevice === 'mobile'
                    ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold shadow-none'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                )}
                title="Mobile View"
              >
                <Smartphone size={13} />
              </button>
            </div>

            {/* Group 4: Action Icons Container (8px Spacing, Fixed Sizing) */}
            <div className="flex items-center gap-2 shrink-0 flex-none">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
                className="w-8 h-8 shrink-0 flex-none flex items-center justify-center rounded-[10px] bg-slate-100 dark:bg-surface-l4 border border-slate-200 dark:border-border-subtle text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-surface-l3 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
                title="Toggle Paper Theme"
                aria-label="Toggle Paper Theme"
              >
                {previewTheme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
              </button>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="w-8 h-8 shrink-0 flex-none flex items-center justify-center rounded-[10px] bg-slate-100 dark:bg-surface-l4 border border-slate-200 dark:border-border-subtle text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-surface-l3 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
                title="Reset Zoom & Refresh"
                aria-label="Reset Zoom & Refresh"
              >
                <RotateCw size={13} />
              </button>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-8 h-8 shrink-0 flex-none flex items-center justify-center rounded-[10px] bg-slate-100 dark:bg-surface-l4 border border-slate-200 dark:border-border-subtle text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-surface-l3 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-8 h-8 shrink-0 flex-none flex items-center justify-center rounded-[10px] bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 cursor-pointer shadow-sm transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
                title="Download PDF"
                aria-label="Download PDF"
              >
                <Download size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* A4 Paper Document Preview Container */}
      <div className="flex-1 min-h-0 overflow-auto p-3 sm:p-4 md:p-5 bg-slate-200/70 dark:bg-[#0c0d15] flex justify-center items-start custom-scrollbar transition-colors">
        {/* A4 Proportioned Canvas Wrapper - Softened Eye-Friendly Paper Surface with Premium Elevation */}
        <div
          className={cn(
            'w-full max-w-[850px] transition-all duration-200 ease-out transform-gpu origin-top mx-auto text-left rounded-sm border border-slate-300/60 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.28)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.65)] ring-1 ring-slate-900/5 dark:ring-white/5 overflow-hidden print-document-canvas my-1 bg-[#FAFBFD] dark:bg-[#FAFBFC] print:bg-white text-slate-900 selection:bg-purple-500/20 antialiased motion-reduce:transition-none',
            previewTheme === 'dark' && 'bg-[#181926] text-slate-100 ring-slate-400/20'
          )}
          style={{
            aspectRatio: '210 / 297', // Standard A4 proportions
            transform: `scale(${zoomLevel / 100})`,
          }}
        >
          {/* Dynamic Template Renderer */}
          <ResumePreviewRenderer templateId={activeTemplateId} data={resumeData} />
        </div>
      </div>

      {/* Bottom Status Footer */}
      <div className="h-[46px] min-h-[46px] px-3.5 border-t border-slate-200/80 dark:border-border-subtle/30 bg-white/90 dark:bg-surface-l2/40 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 transition-colors shrink-0 flex-none box-border">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>{saveStatus}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={13} className="text-purple-600 dark:text-purple-400" />
          <span>All changes are secure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />
          <span>Your data is private</span>
        </div>
      </div>
    </div>
  )
}
