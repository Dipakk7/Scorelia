import React, { useState } from 'react'
import {
  Palette,
  Type,
  Layout,
  Eye,
  Sliders,
  Calendar,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react'

export interface DocumentStyleSettings {
  accentColor: string
  fontFamily: string
  fontSize: string
  lineSpacing: string
  paragraphSpacing: string
  margins: string
  pageSize: 'A4' | 'Letter'
  dateFormat: string
  showSignature: boolean
  showContactInfo: boolean
  showRecipientBlock: boolean
}

export interface DocumentStylePanelProps {
  settings: DocumentStyleSettings
  onUpdateSettings: (newSettings: Partial<DocumentStyleSettings>) => void
  onClose?: () => void
}

export const defaultDocumentStyleSettings: DocumentStyleSettings = {
  accentColor: '#8b5cf6', // Purple
  fontFamily: 'Inter',
  fontSize: '14',
  lineSpacing: '1.6',
  paragraphSpacing: '16',
  margins: '32',
  pageSize: 'A4',
  dateFormat: 'May 18, 2026',
  showSignature: true,
  showContactInfo: true,
  showRecipientBlock: true,
}

export const DocumentStylePopover: React.FC<DocumentStylePanelProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const accentColors = [
    { label: 'Purple', hex: '#8b5cf6' },
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Blue', hex: '#3b82f6' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Rose', hex: '#f43f5e' },
  ]

  return (
    <div className="w-80 sm:w-96 rounded-2xl bg-[#121426] border border-white/10 shadow-2xl p-4 space-y-4 text-left z-50 text-slate-100 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="font-extrabold text-sm text-white m-0">
            Document Styling & Layout
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close style controls"
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Accent Color Picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Palette className="w-3 h-3 text-purple-400" />
            <span>Accent Theme Color</span>
          </label>
          <div className="flex items-center gap-2">
            {accentColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                aria-label={`Select ${color.label} accent color`}
                onClick={() => onUpdateSettings({ accentColor: color.hex })}
                className={`h-7 w-7 rounded-full flex items-center justify-center transition-all cursor-pointer border-none bg-transparent ${
                  settings.accentColor === color.hex ? 'scale-110 ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Font Family & Margins */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="popover-font-family" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Type className="w-3 h-3 text-purple-400" />
              <span>Font Family</span>
            </label>
            <div className="relative">
              <select
                id="popover-font-family"
                value={settings.fontFamily}
                onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer pr-7"
              >
                <option value="Inter">Inter (Sans)</option>
                <option value="Georgia">Georgia (Serif)</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="popover-margins" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Layout className="w-3 h-3 text-purple-400" />
              <span>Margins</span>
            </label>
            <div className="relative">
              <select
                id="popover-margins"
                value={settings.margins}
                onChange={(e) => onUpdateSettings({ margins: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer pr-7"
              >
                <option value="16">Narrow (16px)</option>
                <option value="32">Normal (32px)</option>
                <option value="48">Wide (48px)</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Line Spacing & Page Size */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="popover-line-spacing" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Line Spacing
            </label>
            <div className="relative">
              <select
                id="popover-line-spacing"
                value={settings.lineSpacing}
                onChange={(e) => onUpdateSettings({ lineSpacing: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer pr-7"
              >
                <option value="1.4">Compact (1.4)</option>
                <option value="1.6">Normal (1.6)</option>
                <option value="1.8">Relaxed (1.8)</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="popover-page-size" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Page Size
            </label>
            <div className="relative">
              <select
                id="popover-page-size"
                value={settings.pageSize}
                onChange={(e) => onUpdateSettings({ pageSize: e.target.value as 'A4' | 'Letter' })}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer pr-7"
              >
                <option value="A4">A4 Format</option>
                <option value="Letter">US Letter</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Eye className="w-3 h-3 text-purple-400" />
            <span>Document Section Visibility</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onUpdateSettings({ showContactInfo: !settings.showContactInfo })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                settings.showContactInfo
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              Contact Header
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ showRecipientBlock: !settings.showRecipientBlock })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                settings.showRecipientBlock
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              Recipient Block
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ showSignature: !settings.showSignature })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                settings.showSignature
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              Sign-off Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const DocumentStylePanel: React.FC<DocumentStylePanelProps> = (props) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121426] p-4 sm:p-5 shadow-lg space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="font-extrabold text-sm text-white m-0">
            Document Styling & Personalization
          </h3>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Live Formatting</span>
      </div>
      <DocumentStylePopover {...props} />
    </div>
  )
}

export default DocumentStylePanel
