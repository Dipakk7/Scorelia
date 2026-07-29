import React, { useState, useMemo } from 'react'
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
  Layout,
  FileText,
} from 'lucide-react'
import type { ResumeTemplateId, SampleResumeData } from './templates/types'
import { TEMPLATES_LIST } from './templates/types'
import { ResumePreviewRenderer } from './templates/ResumePreviewRenderer'
import { TemplateGalleryModal } from './templates/TemplateGalleryModal'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export const LivePreviewBadge: React.FC = () => (
  <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-mono">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
    Live
  </span>
)

interface DeviceViewSwitcherProps {
  activeDevice: 'desktop' | 'tablet' | 'mobile'
  onSelectDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
}

export const DeviceViewSwitcher: React.FC<DeviceViewSwitcherProps> = ({
  activeDevice,
  onSelectDevice,
}) => (
  <div className="hidden sm:flex items-center bg-slate-100/90 dark:bg-[#1f2238] p-0.5 rounded-lg border border-slate-200/80 dark:border-white/[0.1]">
    <button
      type="button"
      onClick={() => onSelectDevice('desktop')}
      className={cn(
        'p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80',
        activeDevice === 'desktop' && 'bg-white dark:bg-[#272a45] text-slate-900 dark:text-white font-bold shadow-xs'
      )}
      title="Desktop View"
      aria-label="Desktop View"
    >
      <Monitor size={13} />
    </button>
    <button
      type="button"
      onClick={() => onSelectDevice('tablet')}
      className={cn(
        'p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80',
        activeDevice === 'tablet' && 'bg-white dark:bg-[#272a45] text-slate-900 dark:text-white font-bold shadow-xs'
      )}
      title="Tablet View"
      aria-label="Tablet View"
    >
      <Tablet size={13} />
    </button>
    <button
      type="button"
      onClick={() => onSelectDevice('mobile')}
      className={cn(
        'p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80',
        activeDevice === 'mobile' && 'bg-white dark:bg-[#272a45] text-slate-900 dark:text-white font-bold shadow-xs'
      )}
      title="Mobile View"
      aria-label="Mobile View"
    >
      <Smartphone size={13} />
    </button>
  </div>
)

interface ZoomControlsProps {
  zoomLevel: number
  onZoomChange: (delta: number) => void
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomLevel, onZoomChange }) => (
  <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-[#1f2238] px-2 py-1 rounded-lg border border-slate-200/80 dark:border-white/[0.1] text-xs font-mono text-slate-700 dark:text-slate-300 shadow-xs">
    <button
      type="button"
      onClick={() => onZoomChange(-10)}
      className="p-0.5 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 cursor-pointer focus:outline-none"
      title="Zoom Out"
      aria-label="Zoom Out"
    >
      <Minus size={12} />
    </button>
    <span className="w-8 text-center font-bold text-[11px]">{zoomLevel}%</span>
    <button
      type="button"
      onClick={() => onZoomChange(10)}
      className="p-0.5 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 cursor-pointer focus:outline-none"
      title="Zoom In"
      aria-label="Zoom In"
    >
      <Plus size={12} />
    </button>
  </div>
)

interface DownloadButtonProps {
  onClick: () => void
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="h-8 px-3 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-md transition-opacity flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
    title="Download PDF Document"
    aria-label="Download PDF Document"
  >
    <Download size={13} />
    <span className="hidden sm:inline">Download PDF</span>
  </button>
)

interface ResumePaperProps {
  activeTemplateId: ResumeTemplateId
  resumeData?: SampleResumeData
  zoomLevel: number
  previewTheme: 'light' | 'dark'
}

export const ResumePaper: React.FC<ResumePaperProps> = ({
  activeTemplateId,
  resumeData,
  zoomLevel,
  previewTheme,
}) => (
  <div
    className={cn(
      'w-full max-w-[720px] transition-all duration-200 ease-out transform-gpu origin-top mx-auto text-left rounded-sm border-none shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.85)] ring-1 ring-slate-900/10 dark:ring-white/15 overflow-hidden print-document-canvas my-2 bg-white text-slate-900 selection:bg-purple-500/20 antialiased motion-reduce:transition-none',
      previewTheme === 'dark' && 'ring-slate-400/30'
    )}
    style={{
      aspectRatio: '210 / 297',
      transform: `scale(${zoomLevel / 100})`,
    }}
  >
    <ResumePreviewRenderer templateId={activeTemplateId} data={resumeData} />
  </div>
)

interface StatusItemProps {
  icon: React.ReactNode
  label: string
}

export const StatusItem: React.FC<StatusItemProps> = ({ icon, label }) => (
  <div className="flex items-center gap-1.5">
    {icon}
    <span>{label}</span>
  </div>
)

interface WorkspaceStatusStripProps {
  saveStatus: string
}

export const WorkspaceStatusStrip: React.FC<WorkspaceStatusStripProps> = ({ saveStatus }) => (
  <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-[#171a2b] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 transition-colors">
    <StatusItem
      icon={<CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />}
      label={saveStatus}
    />
    <StatusItem
      icon={<Lock size={13} className="text-purple-600 dark:text-purple-400" />}
      label="All changes are secure"
    />
    <StatusItem
      icon={<ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />}
      label="Your data is private"
    />
  </div>
)

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
        'flex flex-col h-full bg-white/95 dark:bg-[#121522] border border-slate-200/70 dark:border-white/[0.07] rounded-2xl shadow-[0_6px_24px_-6px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] overflow-hidden text-left relative transition-colors',
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
      <div className="sticky top-0 z-20 px-3.5 py-2.5 border-b border-slate-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-[#171a2b] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] transition-colors">
        {/* Left Group: Title, Template Selector & Live Badge */}
        <div className="flex items-center gap-2.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display m-0 flex items-center gap-1.5">
            <FileText size={15} className="text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Resume Preview</span>
          </h3>

          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-bold bg-purple-50 dark:bg-[#1f2238] border border-purple-300 dark:border-purple-500/40 hover:bg-purple-100 dark:hover:bg-[#272a45] text-purple-900 dark:text-purple-200 cursor-pointer transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Layout size={13} />
            <span>{activeTemplate.name}</span>
            <ChevronDown size={13} className="text-purple-700 dark:text-purple-300" />
          </button>

          <LivePreviewBadge />
        </div>

        {/* Right Group: Device Switcher, Zoom, Theme, Reset, Fullscreen, Download */}
        <div className="flex items-center gap-2 flex-wrap">
          <ZoomControls zoomLevel={zoomLevel} onZoomChange={handleZoom} />
          <DeviceViewSwitcher activeDevice={previewDevice} onSelectDevice={setPreviewDevice} />

          <button
            type="button"
            onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg bg-slate-100/90 dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            title="Toggle Paper Theme"
            aria-label="Toggle Paper Theme"
          >
            {previewTheme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel(100)}
            className="p-2 rounded-lg bg-slate-100/90 dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            title="Reset Zoom & Refresh"
            aria-label="Reset Zoom & Refresh"
          >
            <RotateCw size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-100/90 dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-white/[0.1]" />

          <DownloadButton onClick={handleDownloadPDF} />
        </div>
      </div>

      {/* A4 Paper Workspace Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-slate-200/50 dark:bg-[#07080e] flex justify-center items-start custom-scrollbar transition-colors">
        <ResumePaper
          activeTemplateId={activeTemplateId}
          resumeData={resumeData}
          zoomLevel={zoomLevel}
          previewTheme={previewTheme}
        />
      </div>

      {/* Bottom Status Footer */}
      <WorkspaceStatusStrip saveStatus={saveStatus} />
    </div>
  )
}
