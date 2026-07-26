import React from 'react'
import {
  Palette,
  Type,
  Layout,
  Eye,
  Sliders,
  Calendar,
  ChevronDown,
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

export const DocumentStylePanel: React.FC<DocumentStylePanelProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const accentColors = [
    { label: 'Purple', hex: '#8b5cf6' },
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Blue', hex: '#3b82f6' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Rose', hex: '#f43f5e' },
  ]

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-[var(--shadow-sm)] space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-purple-400" />
          <h3 className="font-display font-extrabold text-sm text-[var(--heading)] m-0">
            Document & Style Personalization
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[var(--muted)]">Live Styling</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
        {/* Accent Color Picker (44x44px minimum touch targets) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Palette size={10} className="text-purple-400" />
            <span>Accent Color</span>
          </label>
          <div className="flex items-center gap-1.5 pt-0.5">
            {accentColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                aria-label={`Select ${color.label} accent color`}
                onClick={() => onUpdateSettings({ accentColor: color.hex })}
                className={`min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center rounded-full transition-transform cursor-pointer border-none bg-transparent ${
                  settings.accentColor === color.hex ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <span
                  className={`h-6 w-6 rounded-full border ${
                    settings.accentColor === color.hex
                      ? 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--surface)] border-white'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-1.5">
          <label htmlFor="style-font-family" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Type size={10} className="text-purple-400" />
            <span>Font Family</span>
          </label>
          <div className="relative">
            <select
              id="style-font-family"
              value={settings.fontFamily}
              onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
              className="w-full min-h-[44px] sm:min-h-0 appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer pr-7"
            >
              <option value="Inter">Inter (Sans)</option>
              <option value="Georgia">Georgia (Serif)</option>
              <option value="JetBrains Mono">JetBrains Mono</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-3.5 sm:top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>

        {/* Line Spacing */}
        <div className="space-y-1.5">
          <label htmlFor="style-line-spacing" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Layout size={10} className="text-purple-400" />
            <span>Line Spacing</span>
          </label>
          <div className="relative">
            <select
              id="style-line-spacing"
              value={settings.lineSpacing}
              onChange={(e) => onUpdateSettings({ lineSpacing: e.target.value })}
              className="w-full min-h-[44px] sm:min-h-0 appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer pr-7"
            >
              <option value="1.4">Compact (1.4)</option>
              <option value="1.6">Normal (1.6)</option>
              <option value="1.8">Relaxed (1.8)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-3.5 sm:top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>

        {/* Margins */}
        <div className="space-y-1.5">
          <label htmlFor="style-margins" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Layout size={10} className="text-purple-400" />
            <span>Margins</span>
          </label>
          <div className="relative">
            <select
              id="style-margins"
              value={settings.margins}
              onChange={(e) => onUpdateSettings({ margins: e.target.value })}
              className="w-full min-h-[44px] sm:min-h-0 appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer pr-7"
            >
              <option value="16">Narrow (16px)</option>
              <option value="32">Normal (32px)</option>
              <option value="48">Wide (48px)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-3.5 sm:top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>

        {/* Page Size & Date Format */}
        <div className="space-y-1.5">
          <label htmlFor="style-page-size" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Calendar size={10} className="text-purple-400" />
            <span>Page & Date</span>
          </label>
          <div className="flex gap-1.5">
            <select
              id="style-page-size"
              aria-label="Page Size"
              value={settings.pageSize}
              onChange={(e) => onUpdateSettings({ pageSize: e.target.value as 'A4' | 'Letter' })}
              className="w-1/2 min-h-[44px] sm:min-h-0 appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-2 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:outline-none cursor-pointer"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
            <select
              aria-label="Date Format"
              value={settings.dateFormat}
              onChange={(e) => onUpdateSettings({ dateFormat: e.target.value })}
              className="w-1/2 min-h-[44px] sm:min-h-0 appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-2 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:outline-none cursor-pointer"
            >
              <option value="May 18, 2026">US Date</option>
              <option value="18/05/2026">UK Date</option>
              <option value="2026-05-18">ISO Date</option>
            </select>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Eye size={10} className="text-purple-400" />
            <span>Visibility Toggles</span>
          </label>
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            <button
              type="button"
              onClick={() => onUpdateSettings({ showSignature: !settings.showSignature })}
              className={`min-h-[44px] sm:min-h-[32px] px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                settings.showSignature
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  : 'bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]'
              }`}
            >
              Signature
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ showContactInfo: !settings.showContactInfo })}
              className={`min-h-[44px] sm:min-h-[32px] px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                settings.showContactInfo
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  : 'bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]'
              }`}
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ showRecipientBlock: !settings.showRecipientBlock })}
              className={`min-h-[44px] sm:min-h-[32px] px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                settings.showRecipientBlock
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  : 'bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]'
              }`}
            >
              Recipient
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentStylePanel
