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
        'flex flex-col h-full bg-white/90 dark:bg-[#0b0c14]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden text-left relative transition-colors',
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

      {/* Sticky Top Preview Toolbar */}
      <div className="sticky top-0 z-20 p-3 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/90 dark:bg-[#0b0c14]/90 backdrop-blur-md transition-colors">
        {/* Left: Title, Active Template Picker Trigger & Live Badge */}
        <div className="flex items-center gap-2.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display m-0 flex items-center gap-1.5">
            <FileText size={15} className="text-purple-600 dark:text-purple-400" />
            <span>Document Preview</span>
          </h3>

          {/* Template Selector Trigger */}
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/40 hover:bg-purple-100 dark:hover:bg-purple-600/30 text-purple-900 dark:text-purple-200 cursor-pointer transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Layout size={13} />
            <span>{activeTemplate.name}</span>
            <ChevronDown size={13} className="text-purple-700 dark:text-purple-300" />
          </button>

          {/* Live Status Pill */}
          <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        {/* Right Toolbar Controls: Zoom (-/+, Fit Width, Fit Page, Zoom %), Device Toggles, Theme, Refresh, Fullscreen, Download */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              className="p-0.5 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 cursor-pointer focus:outline-none"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center font-bold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              className="p-0.5 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 cursor-pointer focus:outline-none"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Fit Actions */}
          <button
            type="button"
            onClick={handleFitWidth}
            className="hidden md:block px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            Fit Width
          </button>
          <button
            type="button"
            onClick={handleFitPage}
            className="hidden md:block px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            Fit Page
          </button>

          {/* Page Selector Indicator */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            Page 1 of 1
          </span>

          {/* Device Toggles */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={cn(
                'p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer',
                previewDevice === 'desktop' && 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-sm'
              )}
              title="Desktop View"
            >
              <Monitor size={13} />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={cn(
                'p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer',
                previewDevice === 'tablet' && 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-sm'
              )}
              title="Tablet View"
            >
              <Tablet size={13} />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={cn(
                'p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer',
                previewDevice === 'mobile' && 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-sm'
              )}
              title="Mobile View"
            >
              <Smartphone size={13} />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            title="Toggle Paper Theme"
            aria-label="Toggle Paper Theme"
          >
            {previewTheme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => setZoomLevel(100)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            title="Reset Zoom & Refresh"
            aria-label="Reset Zoom & Refresh"
          >
            <RotateCw size={13} />
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 cursor-pointer shadow-md transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            title="Download PDF"
            aria-label="Download PDF"
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* A4 Paper Document Preview Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-slate-100/90 dark:bg-[#07080e]/95 flex justify-center items-start custom-scrollbar transition-colors">
        {/* A4 Proportioned Canvas Wrapper - Always Pure White Paper with Crisp Print Typography */}
        <div
          className={cn(
            'w-full max-w-[720px] transition-all duration-200 ease-out transform-gpu origin-top mx-auto text-left rounded-sm border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] ring-1 ring-slate-900/10 overflow-hidden print-document-canvas my-2 bg-white text-slate-900 selection:bg-purple-500/20 antialiased motion-reduce:transition-none',
            previewTheme === 'dark' && 'ring-slate-400/20'
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
      <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0c14] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 transition-colors">
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
