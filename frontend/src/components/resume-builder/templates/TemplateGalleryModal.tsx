import React from 'react'
import { X, Check, Layout } from 'lucide-react'
import type { ResumeTemplateId } from './types'
import { TEMPLATES_LIST } from './types'
import { cn } from '@/lib/utils'

interface TemplateGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTemplateId: ResumeTemplateId
  onSelectTemplate: (templateId: ResumeTemplateId) => void
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-gallery-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left"
    >
      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-[#0e0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30">
              <Layout size={18} />
            </div>
            <div>
              <h2 id="template-gallery-title" className="text-lg font-bold text-white font-display m-0">
                Resume Template Gallery
              </h2>
              <p className="text-xs text-slate-400 m-0">
                Select a formatted layout. Your resume content adapts instantly without losing any details.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close template gallery"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Template Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES_LIST.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId
              return (
                <div
                  key={tpl.id}
                  role="button"
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectTemplate(tpl.id)
                    onClose()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectTemplate(tpl.id)
                      onClose()
                    }
                  }}
                  className={cn(
                    'group relative rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 overflow-hidden shadow-lg hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/50'
                      : 'bg-slate-900/50 border-white/10 hover:border-purple-500/40 hover:bg-slate-900/80'
                  )}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-md font-mono">
                      <Check size={12} />
                      <span>Active</span>
                    </div>
                  )}

                  {/* Template Visual Card Preview Box */}
                  <div
                    className={cn(
                      'w-full h-32 rounded-lg mb-3 p-3 flex flex-col justify-between border border-white/10 transition-transform duration-300 group-hover:scale-[1.02]',
                      tpl.thumbnailBg
                    )}
                  >
                    <div className="space-y-1 text-left">
                      <div className="w-20 h-2 bg-white/80 rounded" />
                      <div className="w-12 h-1 bg-white/40 rounded" />
                    </div>

                    <div className="space-y-1 text-left">
                      <div className="w-full h-1 bg-white/30 rounded" />
                      <div className="w-full h-1 bg-white/30 rounded" />
                      <div className="w-3/4 h-1 bg-white/30 rounded" />
                    </div>
                  </div>

                  {/* Template Metadata */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white font-display m-0 group-hover:text-purple-300 transition-colors">
                        {tpl.name}
                      </h3>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                        {tpl.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed m-0 font-sans">
                      {tpl.description}
                    </p>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tpl.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Select Action Button */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                    <span
                      className={cn(
                        'w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center',
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-300 group-hover:bg-purple-600/30 group-hover:text-white'
                      )}
                    >
                      {isSelected ? 'Currently Applied' : 'Use Template'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  )
}
