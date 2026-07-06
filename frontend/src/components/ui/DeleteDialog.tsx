import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AlertTriangle } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title?: string
  description?: string
  requireConfirmationText?: boolean
  confirmWord?: string
}

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Resume',
  description = 'Are you sure you want to delete this resume? This action is permanent and cannot be undone.',
  requireConfirmationText = false,
  confirmWord = 'DELETE',
}: DeleteDialogProps) {
  const [confirmInput, setConfirmInput] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (requireConfirmationText && confirmInput !== confirmWord) {
      return
    }
    setIsDeleting(true)
    try {
      await onConfirm()
      setConfirmInput('')
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
        <DialogHeader className="space-y-3">
          <div className="mx-auto sm:mx-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold font-display text-slate-900 dark:text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm font-sans text-slate-500 dark:text-slate-400">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {requireConfirmationText && (
          <div className="space-y-2 py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please type <strong className="font-semibold text-slate-700 dark:text-slate-300 select-all">{confirmWord}</strong> to confirm:
            </p>
            <Input
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={`Type ${confirmWord} here`}
              className="w-full text-sm font-sans"
              disabled={isDeleting}
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 font-sans mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting || (requireConfirmationText && confirmInput !== confirmWord)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-red-650 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Spinner size="sm" className="text-white" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
