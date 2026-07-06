import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string | null
  alt?: string
  fallbackText?: string
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, fallbackText, ...props }, ref) => {
  const initials = fallbackText
    ? fallbackText
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800',
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src || undefined}
        alt={alt || 'User Profile'}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center rounded-full bg-brand-500 text-white font-medium font-display text-sm"
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
})

Avatar.displayName = 'Avatar'
