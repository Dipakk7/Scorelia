import React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

export const Dropdown = DropdownMenuPrimitive.Root
export const DropdownTrigger = DropdownMenuPrimitive.Trigger
export const DropdownPortal = DropdownMenuPrimitive.Portal

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>((({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-1 text-[var(--body)] shadow-[var(--shadow-md)] backdrop-blur-md dropdown-content-anim',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
)))
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
      'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-all duration-[var(--duration-fast)] text-[var(--body)] hover:bg-[var(--divider)] hover:text-[var(--heading)] focus:bg-[var(--divider)] focus:text-[var(--heading)] data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)] font-sans',
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
      'px-3 py-2 text-xs font-semibold font-display text-[var(--muted)]',
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
    className={cn('-mx-1 my-1 h-px bg-[var(--divider)]', className)}
    {...props}
  />
))
DropdownSeparator.displayName = 'DropdownSeparator'
