import React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

export const Dropdown = DropdownMenuPrimitive.Root
export const DropdownTrigger = DropdownMenuPrimitive.Trigger
export const DropdownPortal = DropdownMenuPrimitive.Portal

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-1 text-slate-950 dark:text-slate-50 shadow-md backdrop-blur-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownContent.displayName = 'DropdownContent'

export const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-sans',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownItem.displayName = 'DropdownItem'

export const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-3 py-2 text-xs font-semibold font-display text-slate-500 dark:text-slate-400',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownLabel.displayName = 'DropdownLabel'

export const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800', className)}
    {...props}
  />
))
DropdownSeparator.displayName = 'DropdownSeparator'
