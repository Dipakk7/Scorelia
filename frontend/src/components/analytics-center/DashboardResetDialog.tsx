import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'

interface DashboardResetDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirmReset: () => void
}

export function DashboardResetDialog({
  isOpen,
  onClose,
  onConfirmReset,
}: DashboardResetDialogProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-dialog-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md p-6 rounded-2xl bg-[#0f101c] border border-white/10 shadow-2xl space-y-5 text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle size={20} className="stroke-[2]" />
              </div>
              <h3 id="reset-dialog-title" className="text-base font-bold text-slate-100 m-0">
                Reset Dashboard Preferences?
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Message */}
          <p className="text-xs text-slate-400 font-medium leading-relaxed m-0">
            This will restore all Analytics Center widget ordering, visibility toggles, section collapses, and dashboard presets back to factory defaults. Your saved custom layouts will remain intact.
          </p>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirmReset()
                onClose()
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-md shadow-rose-900/40 cursor-pointer"
            >
              <RefreshCw size={14} className="shrink-0" />
              <span>Confirm Reset</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DashboardResetDialog
