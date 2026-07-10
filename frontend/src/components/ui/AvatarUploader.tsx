import { useRef, useState } from 'react'
import { Upload, Camera, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AvatarUploaderProps {
  value: string | null
  onChange: (base64: string | null) => void
  fallbackName?: string
  className?: string
}

export function AvatarUploader({
  value,
  onChange,
  fallbackName = 'User',
  className,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 2MB images
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be smaller than 2MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setPreview(base64)
      onChange(base64)
      toast.success('Image selected. Click Save to persist.')
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Image cleared. Click Save to persist.')
  }

  const triggerInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('flex flex-col items-center gap-4 sm:flex-row text-left', className)}>
      {/* Avatar Display */}
      <div className="relative group shrink-0">
        <Avatar
          src={preview || undefined}
          fallbackText={fallbackName}
          className="h-20 w-20 border-2 border-border shadow-md"
        />
        <button
          type="button"
          onClick={triggerInput}
          className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full text-white cursor-pointer transition-opacity focus:outline-none"
          aria-label="Upload Photo"
        >
          <Camera size={18} />
        </button>
      </div>

      {/* Upload Actions */}
      <div className="space-y-1">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={triggerInput}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Upload size={14} />
            <span>Upload Photo</span>
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 bg-card/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground font-sans mt-1 max-w-[200px]">
          Allowed formats: PNG, JPG, or GIF. Max size of 2MB.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
